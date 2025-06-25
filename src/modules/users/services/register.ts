import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import bcrypt from 'bcrypt';
import moment from 'moment/moment';
import Models from '../../../database/models';
import { body, validationResult } from 'express-validator';
import {Request} from '../../../common_types/object';

// Field validation rules extracted for reusability and clarity
const registerFieldValidations = [
    body('name')
        .notEmpty()
        .withMessage('The <b>name</b> field is required')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[A-Za-z\s-]+$/)
        .withMessage('Name can only contain letters, spaces, and hyphens'),
    body('email')
        .notEmpty()
        .withMessage('The <b>email</b> field is required')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email must not exceed 255 characters'),
    body('phone_number')
        .notEmpty()
        .withMessage('The <b>phone number</b> field is required')
        .trim()
        .matches(/^\+?[\d\s-]{10,15}$/)
        .withMessage('Please provide a valid phone number (10-15 digits, may include +, spaces, or hyphens)'),
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
];

/** validation rules */
async function validate(req: Request) {
    await Promise.all(registerFieldValidations.map(rule => rule.run(req)));
    return await validationResult(req);
}

async function generateUniqueSlug(
    models: any,
    name: string,
): Promise<string> {
    let baseSlug = `${name}`
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

    let newUser: any = undefined;
    let image_path = 'avatar.png';
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Generate unique slug
        const slug = await generateUniqueSlug(
            models,
            body.name,
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
            branch_id: body.branch_id,
            class_id: body.class_id,
            role_serial: roleSerial || studentRecord?.serial,
            is_approved: body.is_approved,
            name: body.name,
            email: body.email,
            phone_number: body.phone_number,
            photo: body.photo || image_path,
            password: hashedPassword,
            slug: slug,
            token: body.token,
            user_infos: body.user_infos,
            // user_documents will be handled after user creation
            join_date: body.join_date ? moment(body.join_date).toDate() : null,
            base_salary: body.base_salary || null,
        });

        // Handle user documents (similar to user_profile_update.ts)
        let finalUserDocumentsString = null; // Default to null if no documents
        if (body.user_documents && typeof body.user_documents === 'string') {
            try {
                let userDocumentsArray = JSON.parse(body.user_documents);
                const processedUserDocuments = [];

                for (let i = 0; i < userDocumentsArray.length; i++) {
                    const doc = userDocumentsArray[i];
                    const fileFieldKey = `document_files[${i}]`; 
                    
                    if (body[fileFieldKey] && typeof body[fileFieldKey] === 'object' && body[fileFieldKey].name && body[fileFieldKey].data) {
                        const fileData = body[fileFieldKey];
                        const documentFileName = `${Date.now()}_${i}_${fileData.name.replace(/\s+/g, '_')}`;
                        const documentPath = `uploads/user_documents/${documentFileName}`;
                        
                        await (fastify_instance as any).upload(fileData, documentPath);
                        doc.file = documentPath; 
                        doc.fileName = fileData.name; 
                    } else if (doc.file && typeof doc.file === 'string') {
                        // This case might be less relevant for new registration unless pre-set paths are possible
                        // For now, keep it consistent with update logic
                    }
                    processedUserDocuments.push(doc);
                }
                finalUserDocumentsString = JSON.stringify(processedUserDocuments);
            } catch (e: any) {
                console.error('Error processing user documents during registration:', e);
                // Potentially return an error response or log, depending on desired behavior
                // For now, we'll let it proceed and save null or existing data if parsing fails.
                // Consider if an error response is more appropriate here.
                return response(400, 'Error processing user documents', { error: e.message });
            }
        }
        
        if (finalUserDocumentsString) {
            newUser.user_documents = finalUserDocumentsString;
            await newUser.save();
        }

        return response(200, 'User registered successfully', newUser);
    }  catch (error: unknown) {
        let errorMessage = 'Unknown error occurred';

        // Attempt to clean up uploaded files if user creation failed mid-document processing
        // This is a basic cleanup attempt. More robust transaction handling might be needed.
        if (newUser && newUser.id && body.user_documents && typeof body.user_documents === 'string') {
             // If user was created but document processing failed or main catch hit,
             // consider deleting the user or handling partial data.
             // For now, we are not deleting the user, but this is a point of consideration.
        }
        // Also, cleanup profile photo if it was uploaded and user creation failed
        if (image_path !== 'avatar.png' && body['photo'] && newUser === undefined) {
            try {
                // This assumes a flat file structure in uploads/users and no complex rollback needed for fastify_instance.upload
                // fs.unlinkSync(image_path); // Requires 'fs' module and careful path handling
                console.warn(`Orphaned profile photo may exist at ${image_path} due to registration error.`);
            } catch (cleanupError) {
                console.error('Error cleaning up profile photo:', cleanupError);
            }
        }
    
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
