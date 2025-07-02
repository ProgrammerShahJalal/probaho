import { FastifyInstance, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Models from '../../../database/models';
import { responseObject, anyObject } from '../../../common_types/object';
import { body, validationResult } from 'express-validator';
import { Request } from '../../../common_types/object';
import { env } from 'process';
import response from '../../../helpers/response';
import error_trace from '../../../common/errors/error_trace';
import custom_error from '../../../common/errors/custom_error';

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

// const SUPER_ADMIN_ROLE_SERIAL = 1; // No longer needed for role-specific check here
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
    // Generic message is always sent to prevent email enumeration
    const genericSuccessMessage = 'If an account with that email exists, a password reset link has been sent.';

    try {
        const user = await models.UserModel.findOne({
            where: { email: userEmail },
        });

        // If user does not exist, still return a generic success message.
        if (!user) {
            console.log(`Password reset request for ${userEmail}: User not found. Sending generic response.`);
            return response(200, 'Request received', { message: genericSuccessMessage });
        }

        // User exists, proceed to generate token and send email.
        console.log(`Password reset request for ${userEmail}: User found: ${user.id}`);

        const plainToken = crypto.randomBytes(32).toString('hex');
        user.forget_code = plainToken; // Storing plain token
        user.forget_code_expiry = new Date(Date.now() + FORGET_CODE_EXPIRY_MINUTES * 60 * 1000);
        await user.save();

        const transporter = nodemailer.createTransport({
            host: env.MAIL_HOST || 'mail.kalyanprokashoni.com',
            port: parseInt(env.MAIL_PORT || "587"),
            secure: env.MAIL_SECURE === 'true' || false,
            auth: {
                user: env.MAIL_USER || 'schoolforget@kalyanprokashoni.com',
                pass: env.MAIL_PASSWORD || 'RPfIt{GuCvOt',
            },
        });

        const appBaseUrl = env.APP_URL || `http://${req.headers.host}`;
        // Use the new generic reset password link
        const resetLink = `${appBaseUrl}/auth/reset-password/${plainToken}`;

        const mailOptions = {
            from: `"${env.MAIL_FROM_NAME || 'Probaha System'}" <${env.MAIL_FROM_ADDRESS || 'schoolforget@kalyanprokashoni.com'}>`,
            to: user.email,
            subject: 'Password Reset Request', // Generic subject
            text: `Hello ${user.name || 'User'},\n\nYou requested a password reset for your account.\nClick the link below to reset your password. This link is valid for ${FORGET_CODE_EXPIRY_MINUTES} minutes.\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nThanks,\nThe Probaha System Team`,
            html: `<p>Hello ${user.name || 'User'},</p><p>You requested a password reset for your account.</p><p>Click the link below to reset your password. This link is valid for <b>${FORGET_CODE_EXPIRY_MINUTES} minutes</b>.</p><p><a href="${resetLink}">Reset Password</a></p><p>If you did not request this, please ignore this email.</p><p>Thanks,<br/>The Probaha System Team</p>`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${user.email}`);
        } catch (emailError: any) {
            console.error('Error sending password reset email:', emailError);
            // Log the error but still return the generic success message to the client.
            // This prevents leaking information about email system failures for valid users.
            await error_trace(models, emailError, req.url, req.body as anyObject);
            // Optionally, if email sending is critical and fails, you might want to inform admin or retry,
            // but client should still get generic message.
        }

        // Always return the generic success message whether email was successfully sent or user found,
        // to prevent email enumeration and information leakage.
        return response(200, 'Request processed', { message: genericSuccessMessage });

    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body as any);
        // For internal server errors, log them but respond generically if possible,
        // or with a non-specific server error message to the client.
        // Here, we'll let the global error handler manage it if it's a true server fault.
        if (error instanceof custom_error) {
            error.uid = uid;
            throw error;
        } else {
             throw new custom_error('Server error during password reset request.', 500, error.message, uid);
        }
    }
}

export default forgetPassword;
