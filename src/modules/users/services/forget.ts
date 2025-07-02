import { FastifyInstance, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Models from '../../../database/models';
import response from '../helpers/response';
import { responseObject, anyObject } from '../../../common_types/object';
import { body, validationResult } from 'express-validator';
import { Request } from '../../../common_types/object';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';
import { env } from 'process';

// Basic email validation
async function validate(req: Request) {
    await body('email')
        .not()
        .isEmpty()
        .withMessage('The email field is required.')
        .isEmail()
        .withMessage('Please provide a valid email address.')
        .run(req);

    let result = await validationResult(req);
    return result;
}

// Define SUPER_ADMIN_ROLE_SERIAL based on user feedback
const SUPER_ADMIN_ROLE_SERIAL = 1;
const FORGET_CODE_EXPIRY_MINUTES = 15; // Token expiry time

async function forgetPassword(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    const models = Models.get();
    const requestBody = req.body as { email?: string };

    /** Validation **/
    const validateResult = await validate(req as Request);
    if (!validateResult.isEmpty()) {
        return response(422, 'Validation error', validateResult.array());
    }

    const userEmail = requestBody.email;
    const genericMessage = 'If an account with that email exists and belongs to a super admin, a password reset link has been sent.';

    try {
        const user = await models.UserModel.findOne({
            where: { email: userEmail },
        });
        console.log(`Password reset request for ${userEmail}: User found:`, user);

        // IMPORTANT: Only proceed if user exists and is a super admin.
        // Otherwise, return a generic message to prevent email enumeration.
        if (!user || user.role_serial !== SUPER_ADMIN_ROLE_SERIAL) {
            console.log(`Password reset request for ${userEmail}: User not found or not a Super Admin. Sending generic response.`);
            return response(200, 'Request received', { message: genericMessage });
        }

        // Generate secure plain token
        const plainToken = crypto.randomBytes(32).toString('hex');

        // Set token and expiry: Store PLAIN token directly for this flow
        user.forget_code = plainToken; // Storing plain token
        user.forget_code_expiry = new Date(Date.now() + FORGET_CODE_EXPIRY_MINUTES * 60 * 1000);
        await user.save();

        // Configure nodemailer (Consider moving to a central config if used elsewhere)
        // Using existing hardcoded credentials as per original file.
        // TODO: These should ideally be environment variables.
        const transporter = nodemailer.createTransport({
            host: env.MAIL_HOST || 'mail.kalyanprokashoni.com',
            port: parseInt(env.MAIL_PORT || "587"),
            secure: env.MAIL_SECURE === 'true' || false, // true for 465, false for other ports
            auth: {
                user: env.MAIL_USER || 'schoolforget@kalyanprokashoni.com',
                pass: env.MAIL_PASSWORD || 'RPfIt{GuCvOt',
            },
        });

        const appBaseUrl = env.APP_URL || `http://${req.headers.host}`; // Infer base URL or use env var
        const resetLink = `${appBaseUrl}/auth/super-admin/reset-password/${plainToken}`;

        const mailOptions = {
            from: `"${env.MAIL_FROM_NAME || 'Probaha System'}" <${env.MAIL_FROM_ADDRESS || 'schoolforget@kalyanprokashoni.com'}>`,
            to: user.email,
            subject: 'Super Admin Password Reset Request',
            text: `Hello ${user.name},\n\nYou requested a password reset for your Super Admin account.\nClick the link below to reset your password. This link is valid for ${FORGET_CODE_EXPIRY_MINUTES} minutes.\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nThanks,\nThe System`,
            html: `<p>Hello ${user.name},</p><p>You requested a password reset for your Super Admin account.</p><p>Click the link below to reset your password. This link is valid for <b>${FORGET_CODE_EXPIRY_MINUTES} minutes</b>.</p><p><a href="${resetLink}">Reset Password</a></p><p>If you did not request this, please ignore this email.</p><p>Thanks,<br/>The System</p>`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${user.email}`);
        } catch (emailError: any) {
            console.error('Error sending password reset email:', emailError);
            // Log the error, but still return the generic message to the client to avoid info leaks.
            // Depending on policy, you might want to return a specific error if email sending is critical and fails.
            // For now, we prioritize not leaking user existence.
            await error_trace(models, emailError, req.url, req.body as any); // Log detailed error internally
            // Optionally, you could throw a custom error here if you want the user to know sending failed.
            // throw new custom_error('Failed to send password reset email.', 500, 'Email service error.');
            // However, for security, often better to stick to generic message.
        }

        return response(200, 'Request processed', { message: genericMessage });

    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body as any);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            // Ensure a generic server error is thrown if not a custom one
             throw new custom_error('Server error during password reset request.', 500, error.message, uid);
        }
        throw error; // Re-throw to be caught by global error handler or Fastify's default
    }
}

export default forgetPassword;
