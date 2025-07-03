import db from '../models/db';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { anyObject, responseObject } from '../../../common_types/object';
import Models from '../../../database/models';
import logoutHistoryUpdate from '../../user_login_histories/services/update';
import { env } from 'process';
import custom_error from '../../../common/errors/custom_error';
import response from '../../../helpers/response';
import error_trace from '../../../common/errors/error_trace';

function parseCookieString(cookieString: string) {
    try {
        const cookieObj: any = {};
        const cookies = cookieString.split(';');
        cookies.forEach((cookie: string) => {
            const [key, value] = cookie.split('=');
            if (key && value) {
                cookieObj[key.trim()] = decodeURIComponent(value.trim());
            }
        });
        return cookieObj;
    } catch (error) {
        console.error('Cookie parsing error:', error);
        return {};
    }
}

async function logout(
    fastify_instance: FastifyInstance,
    req: FastifyRequest, 
    reply: FastifyReply,
): Promise<responseObject> {

    let models = Models.get();
    const secretKey = env.JTI;
    const jwt = require('jsonwebtoken');

    // Get token from multiple sources - prioritize user token from localStorage
    let token = null;
    let tokenSource = "";
    
    // Method 1: Get user token from localStorage (most reliable)
    if ((req.body as any)?.userToken) {
        token = (req.body as any).userToken;
        tokenSource = "userToken from body";
        console.log("Token from userToken (localStorage):", token);
    }
    // Method 2: Get token from user object (backup)
    else if ((req.body as any)?.user?.token) {
        token = (req.body as any).user.token;
        tokenSource = "user.token from body";
        console.log("Token from user object:", token);
    }
    // Method 3: Use Fastify's cookie parser if available
    else if ((req as any).cookies?.token) {
        token = (req as any).cookies.token;
        tokenSource = "Fastify cookies";
        console.log("Token from Fastify cookies:", token);
    }
    // Method 4: Parse from raw cookie header
    else if (req.headers.cookie) {
        const parsedCookies = parseCookieString(req.headers.cookie);
        token = parsedCookies.token;
        tokenSource = "parsed cookies";
        console.log("Token from parsed cookies:", token);
    }
    // Method 5: Get cookie token from body
    else if ((req.body as any)?.cookieToken) {
        token = (req.body as any).cookieToken;
        tokenSource = "cookieToken from body";
        console.log("Token from cookieToken:", token);
    }

    if (!token) {
        console.log("No token found anywhere. Cookie header:", req.headers.cookie);
        console.log("Request body:", req.body);
        throw new custom_error('Unauthorized', 401, 'No token provided');
    }

    console.log(`Using token from: ${tokenSource}`);

    try {
        let authUser = (req as anyObject)?.body?.user;
        let decoded = null;

        const roleRedirectMap: { [key: number]: string } = {
            1: '/super-admin-login', // super_admin
            2: '/admin-login',       // admin
            3: '/student-login',     // student
            4: '/teacher-login',     // teacher
            5: '/staff-login',       // staff
            6: '/parent-login',      // parent
            7: '/librarian-login',   // librarian
            8: '/accountant-login',  // accountant
            9: '/receptionist-login',// receptionist
        };

        // Check if token is a JWT (long token) or a simple user token (short token)
        const isJWTToken = token.length > 50 && (token.includes('.') || token.startsWith('Bearer'));
        
        if (isJWTToken) {
            console.log("Processing as JWT token");
            // Decode URL-encoded token first
            const decodedToken = decodeURIComponent(token);
            console.log("Decoded JWT token:", decodedToken);
            
            // Remove "Bearer " prefix if it exists
            const tokenToVerify = decodedToken.startsWith('Bearer ') ? decodedToken.slice(7) : decodedToken;
            console.log("JWT token to verify:", tokenToVerify);
            
            decoded = jwt.verify(tokenToVerify, secretKey);
            console.log("JWT token decoded successfully:", decoded);
        } else {
            console.log("Processing as simple user token:", token);
            // Simple user token - validate against database
            if (authUser && authUser.id) {
                const userRecord = await models.UserModel.findOne({ where: { id: authUser.id } });
                if (!userRecord || userRecord.token !== token) {
                    console.log("User token validation failed");
                    throw new custom_error('Unauthorized', 401, 'Invalid token');
                }
                console.log("User token validation successful");
                decoded = { id: authUser.id }; // Create a decoded-like object
            } else {
                console.log("No user info available for token validation");
                throw new custom_error('Unauthorized', 401, 'Invalid user data');
            }
        }
        
        // Set authUser from decoded token or request body
        if (!authUser && decoded) {
            authUser = { id: decoded.id };
        } else if (!authUser) {
            console.log("No valid user found");
            throw new custom_error('Unauthorized', 401, 'Invalid user data');
        }

        if (!authUser.id) {
            console.log("No user ID found");
            throw new custom_error('Unauthorized', 401, 'Invalid user data');
        }

        const user = await models.UserModel.findOne({ where: { id: authUser?.id } });

        if (!user) {
            console.log("User not found for ID:", authUser?.id);
            throw new custom_error('Expectation Failed', 417, 'Action not possible');
        }
        
        // Clear user token and user_agent
        user.token = "";
        user.user_agent = "";
        await user.save();
        
        console.log("User token cleared for user:", user.id);

        // Update request body for logout history
        (req as anyObject).body = {
            ...(typeof req.body === 'object' && req.body !== null ? req.body : {}),
            user_id: authUser.id,
        };
        
        try {
            await logoutHistoryUpdate(fastify_instance, req);
        } catch (err) {
            console.error("Error in logoutHistoryUpdate:", err);
        }

        // Check if logout is from frontend
        if ((req.body as any)?.from === "frontend") {
            console.log('Logout from frontend successful');
            // For frontend logouts, we might still want to inform it where to go,
            // or handle redirection client-side based on user role.
            // For now, returning a success message.
            // If frontend needs redirect path: return response(200, 'Logout Successfully', { redirectTo: redirectPath });
            return response(200, 'Logout Successfully', {});
        } else {
            // Determine redirect path based on user's role_serial
            let redirectPath = '/login'; // Default redirect path
            let roleSerial: number | undefined;
            if (Array.isArray(user?.role_serial)) {
                roleSerial = Number(user.role_serial[0]);
            } else if (user?.role_serial !== undefined) {
                roleSerial = Number(user.role_serial);
            } else {
                roleSerial = undefined;
            }
            if (roleSerial && roleRedirectMap[roleSerial]) {
                redirectPath = roleRedirectMap[roleSerial];
            }
            console.log(`Logout from admin panel/backend - redirecting to: ${redirectPath} for role_serial: ${roleSerial}`);
            return reply.redirect(redirectPath);
        }

    } catch (error: any) {
        console.error("Logout error:", error);
        
        // Handle JWT specific errors
        if (error.name === 'JsonWebTokenError') {
            console.log("Invalid token format");
            throw new custom_error('Unauthorized', 401, 'Invalid token');
        }
        if (error.name === 'TokenExpiredError') {
            console.log("Token expired");
            throw new custom_error('Unauthorized', 401, 'Token expired');
        }
        
        const uid = await error_trace(models, error, req.url, req.params);
        throw error instanceof custom_error
            ? { ...error, uid }
            : new custom_error('server error', 500, error.message, uid);
    }
}

export default logout;
