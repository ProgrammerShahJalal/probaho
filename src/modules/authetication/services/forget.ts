import { Model } from 'sequelize';
import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { anyObject, responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import Models from '../../../database/models';

async function forget(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    // let models = await db();
    let models = Models.get();
    let body = req.body as { [key: string]: any };
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        host: 'mail.kalyanprokashoni.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: 'schoolforget@kalyanprokashoni.com',
            pass: 'RPfIt{GuCvOt',
        },
    });

    function generateRandomNumber(): string {
        return Math.floor(100000 + Math.random() * 900000) + '';
    }

    let data = await models.UserModel.findOne({
        where: {
            id: 1,
        },
    });

    if (data) {
        let forget_code = generateRandomNumber();
        data.forget_code = forget_code;
        await data.save();

        const mailOptions = {
            from: 'schoolforget@kalyanprokashoni.com',
            to: 'myphoto288@gmail.com',
            subject: `forgot password`,
            text: `yout code for forgetting password is: ${forget_code}`,
        };

        // Send email
        transporter.sendMail(
            mailOptions,
            (error: anyObject, info: anyObject) => {
                if (error) {
                    console.error('Error:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            },
        );

        return response(200, 'data deactivated', {
            message: 'a code has been sent to your email.',
        });
    } else {
        return response(500, 'data deactivation failed', {});
    }
}

export default forget;
