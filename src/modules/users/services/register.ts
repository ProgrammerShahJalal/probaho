import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import bcrypt from 'bcrypt';
import moment from 'moment/moment';
import Models from '../../../database/models';
import { body, validationResult } from 'express-validator';
import {Request} from '../../../common_types/object';
import response from '../../../helpers/response';

/** validation rules */
async function validate(req: Request) {
    const fields = [
        {
            name: 'name',
            rules: [
                body('name')
                    .notEmpty()
                    .withMessage('The <b>name</b> field is required')
                    .trim()
                    .isLength({ min: 2, max: 100 })
                    .withMessage('Name must be between 2 and 100 characters')
                    .matches(/^[A-Za-z\s-]+$/)
                    .withMessage('Name can only contain letters, spaces, and hyphens'),
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
        // let roleSerial = body.role_serial || studentRecord?.serial || 0; // Changed body.role to body.role_serial

        // Handle multiple roles: store as array or string (JSON) in DB
        let role_serial_to_save: any;
        if (body.role_serial) { // Using body.role_serial now
            let rolesArr: number[] = [];
            if (Array.isArray(body.role_serial)) {
                rolesArr = body.role_serial.map((r: any) => parseInt(r, 10)).filter((r: any) => !isNaN(r));
            } else if (typeof body.role_serial === 'string') {
                rolesArr = body.role_serial.split(',').map((r: string) => parseInt(r.trim(), 10)).filter((r: any) => !isNaN(r));
            } else if (typeof body.role_serial === 'number') {
                rolesArr = [body.role_serial];
            }
            role_serial_to_save = rolesArr;
        } else {
            // Default to student role if no role_serial is provided
            role_serial_to_save = [studentRecord?.serial || 0]; // Default to student role
            // Ensure the default student role exists or create it
            if (!studentRecord && role_serial_to_save[0] === 0) { // Check if studentRecord was null and we're attempting to use serial 0
                let nextSerial = ((await models.UserRolesModel.max('serial')) as number) || 0;
                nextSerial++;
                const newStudentRole = await models.UserRolesModel.create({
                    title: 'student',
                    serial: nextSerial,
                });
                role_serial_to_save = [newStudentRole.serial]; // Update with the newly created student role serial
                studentRecord = newStudentRole; // Update studentRecord for consistency
            } else if (!studentRecord && role_serial_to_save[0] !== 0) { // Should not happen if logic is correct, but as a safeguard
                 return response(400, 'Default student role configuration error.', {});
            }
        }

        // Verify existence of all provided role serials
        for (const serial of role_serial_to_save) {
            const roleExists = await models.UserRolesModel.findOne({ where: { serial: serial } });
            if (!roleExists) {
                // If a specific role serial does not exist (and it's not the default student role scenario handled above)
                // This check is particularly for cases where body.role_serial is provided by the client
                if (body.role_serial) { // Only error if client explicitly provided non-existing roles
                    return response(400, `Role with serial ${serial} not found.`, {});
                }
                // If it's the default student role scenario and it somehow wasn't created (e.g. serial was not 0 initially but studentRecord was null)
                // This part of the logic might be redundant if the default role creation above is robust.
                // However, it acts as a safeguard.
                else if (serial === (studentRecord?.serial || 0) && !studentRecord) {
                    // This case should ideally be covered by the default role creation logic.
                    // If it reaches here, it implies a logic flaw or an unexpected state.
                    // For safety, try to create the student role if it's the default one expected.
                    let nextSerialVal = ((await models.UserRolesModel.max('serial')) as number) || 0;
                    nextSerialVal++;
                    const newStudentRoleDefault = await models.UserRolesModel.create({
                        title: 'student',
                        serial: nextSerialVal,
                    });
                    // Update the specific serial in role_serial_to_save if it was the default student role
                    const indexToUpdate = role_serial_to_save.indexOf(serial);
                    if (indexToUpdate !== -1) {
                        role_serial_to_save[indexToUpdate] = newStudentRoleDefault.serial;
                    }
                    console.warn(`Default student role was missing and has been created with serial ${newStudentRoleDefault.serial}.`);
                } else if (!body.role_serial && serial !== (studentRecord?.serial || 0)) {
                    // If no role_serial was provided by the client, and the serial in role_serial_to_save
                    // is not the studentRecord's serial, this indicates an internal logic issue.
                    return response(500, 'Internal server error: Role processing failed.', {});
                }
            }
        }
        


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
            role_serial: role_serial_to_save, // Use the processed array
            is_approved: body.is_approved,
            name: body.name,
            email: body.email,
            phone_number: body.phone_number,
            photo: body.photo || image_path,
            gender: body.gender,
            blood_group: body.blood_group,
            password: hashedPassword,
            slug: slug,
            token: body.token,
            // user_infos: body.user_infos,
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
        // Handle user infos (similar to user docs)
        let finalUserInfosString = null; // Default to null if no documents
        if (body.user_infos && typeof body.user_infos === 'string') {
            try {
                let userInfosArray = JSON.parse(body.user_infos);
                const processedUserInfos = [];

                for (let i = 0; i < userInfosArray.length; i++) {
                    const doc = userInfosArray[i];
                    const fileFieldKey = `info_files[${i}]`; 
                    
                    if (body[fileFieldKey] && typeof body[fileFieldKey] === 'object' && body[fileFieldKey].name && body[fileFieldKey].data) {
                        const fileData = body[fileFieldKey];
                        const infoFileName = `${Date.now()}_${i}_${fileData.name.replace(/\s+/g, '_')}`;
                        const infoPath = `uploads/user_infos/${infoFileName}`;
                        
                        await (fastify_instance as any).upload(fileData, infoPath);
                        doc.file = infoPath; 
                        doc.fileName = fileData.name; 
                    } else if (doc.file && typeof doc.file === 'string') {
                        // This case might be less relevant for new registration unless pre-set paths are possible
                        // For now, keep it consistent with update logic
                    }
                    processedUserInfos.push(doc);
                }
                finalUserInfosString = JSON.stringify(processedUserInfos);
            } catch (e: any) {
                console.error('Error processing user informations during registration:', e);
                // Potentially return an error response or log, depending on desired behavior
                // For now, we'll let it proceed and save null or existing data if parsing fails.
                // Consider if an error response is more appropriate here.
                return response(400, 'Error processing user informations', { error: e.message });
            }
        }
        
        if (finalUserInfosString) {
            newUser.user_infos = finalUserInfosString;
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
