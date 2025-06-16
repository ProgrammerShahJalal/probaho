import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import bcrypt from 'bcrypt';
import moment from 'moment/moment';
import Models from '../../../database/models';
import { body, validationResult } from 'express-validator';
import {Request} from '../../../common_types/object';

/** validation rules */
async function validate(req: Request) {
    const fields = [
        {
            name: 'first_name',
            rules: [
                body('first_name')
                    .notEmpty()
                    .withMessage('The <b>first name</b> field is required')
                    .trim()
                    .isLength({ min: 2, max: 50 })
                    .withMessage('First name must be between 2 and 50 characters')
                    .matches(/^[A-Za-z\s-]+$/)
                    .withMessage('First name can only contain letters, spaces, and hyphens'),
            ],
        },
        {
            name: 'last_name',
            rules: [
                body('last_name')
                    .notEmpty()
                    .withMessage('The <b>last name</b> field is required')
                    .trim()
                    .isLength({ min: 2, max: 50 })
                    .withMessage('Last name must be between 2 and 50 characters')
                    .matches(/^[A-Za-z\s-]+$/)
                    .withMessage('Last name can only contain letters, spaces, and hyphens'),
            ],
        },
        {
            name: 'email',
            rules: [
                body('email')
                    .notEmpty()
                    .withMessage('The <b>email</b> field is required')
                    .trim()
                    .isEmail()
                    .withMessage('Please provide a valid email address')
                    .normalizeEmail()
                    .isLength({ max: 255 })
                    .withMessage('Email must not exceed 255 characters'),
            ],
        },
        {
            name: 'phone_number',
            rules: [
                body('phone_number')
                    .notEmpty()
                    .withMessage('The <b>phone number</b> field is required')
                    .trim()
                    .matches(/^\+?[\d\s-]{10,15}$/)
                    .withMessage('Please provide a valid phone number (10-15 digits, may include +, spaces, or hyphens)'),
            ],
        },
        {
            name: 'password',
            rules: [
                body('password')
                    .notEmpty()
                    .withMessage('The <b>password</b> field is required')
                    .isLength({ min: 8, max: 50 })
                    .withMessage('Password must be between 8 and 50 characters')
                    .matches(/[A-Z]/)
                    .withMessage('Password must contain at least one uppercase letter')
                    .matches(/[a-z]/)
                    .withMessage('Password must contain at least one lowercase letter')
                    .matches(/[0-9]/)
                    .withMessage('Password must contain at least one number')
                    .matches(/[!@#$%^&*(),.?":{}|<>]/)
                    .withMessage('Password must contain at least one special character'),
            ],
        },
    ];

    // Run all validations in parallel
    await Promise.all(
        fields.flatMap(field => field.rules.map(rule => rule.run(req)))
    );

    return await validationResult(req);
}

async function generateUniqueSlug(
    models: any,
    firstName: string,
    lastName: string,
): Promise<string> {
    let baseSlug = `${firstName}-${lastName}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Trim hyphens

    let uniqueSlug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await models.UserModel.findOne({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}

async function register(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {

    /** validation */
    let validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'validation error', validate_result.array());
    }


    let models = Models.get();
    let body = req.body as { [key: string]: any };

    // Check if user already exists
    let existingUser = await models.UserModel.findOne({
        where: { email: body.email },
    });

    if (existingUser) {
        return response(409, 'User already exists', {});
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Generate unique slug
        const slug = await generateUniqueSlug(
            models,
            body.first_name,
            body.last_name,
        );

        // Check if a student record exists
        let studentRecord = await models.UserRolesModel.findOne({
            where: { title: 'student' },
        });

        // Assign role serial dynamically
        let roleSerial = body.role || studentRecord?.serial || 0;

        // Check if a role with this serial exists
        let roleRecord = await models.UserRolesModel.findOne({
            where: { serial: roleSerial },
        });

        if (!roleRecord) {
            // If no student record exists, create a new student role with the next available serial
            let nextSerial = ((await models.UserRolesModel.max('serial')) as number) || 0;
            nextSerial++;
        
            roleRecord = await models.UserRolesModel.create({
                title: 'student', // Default title
                serial: nextSerial, // Assign a new serial properly
            });
        }
        roleSerial = roleRecord.serial;
        


        // Handle profile image upload
        let image_path = 'avatar.png';
        if (body['photo'] && typeof body['photo'] === 'object' && body['photo'].name) {
            image_path = `uploads/users/${moment().format('YYYYMMDDHHmmss')}_${body['photo'].name}`;
            await (fastify_instance as any).upload(body['photo'], image_path);
        }

        // Store only the string path in the database
        body.photo = image_path;

        if (typeof body.photo !== 'string') {
            return response(400, 'Invalid photo format', {});
        }

        // Generate unique UID
        let uidPrefix = moment().format('YYYYMMDD');
        let uidCounter = 1001;
        let uid = uidPrefix + uidCounter;

        while (await models.UserModel.findOne({ where: { uid: uid } })) {
            uidCounter++;
            uid = uidPrefix + uidCounter;
        }

        // Create user
        let newUser = await models.UserModel.create({
            uid: uid,
            role_serial: roleSerial || studentRecord?.serial,
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            phone_number: body.phone_number,
            photo: body.photo || image_path,
            password: hashedPassword,
            slug: slug,
            token: body.token,
        });

        return response(200, 'User registered successfully', newUser);
    }  catch (error: unknown) {
        let errorMessage = 'Unknown error occurred';
    
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else if (typeof error === 'object' && error !== null) {
            errorMessage = JSON.stringify(error);
        }
    
        console.error('Registration Error:', errorMessage);
        return response(500, 'Error registering user', { error: errorMessage });
    }
}

export default register;
