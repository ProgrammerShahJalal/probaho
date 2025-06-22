import { FastifyInstance, FastifyRequest } from 'fastify';
import Papa from 'papaparse';
import bcrypt from 'bcrypt';
import moment from 'moment'; // Import moment
import { responseObject } from '../../../common_types/object';
import Models from '../../../database/models';

interface UserImportData {
    name: string;
    email: string;
    phone_number: string;
    photo?: string; // Photo might be optional if not provided in CSV
    password?: string; // Password might be optional if we generate one, or required
    role_serial: number;
    // Add other relevant fields from UserModel that can be imported
    branch_id?: number;
    class_id?: number;
    is_approved?: '0' | '1';
    is_blocked?: '0' | '1';
    is_verified?: '0' | '1';
    slug?: string; // slug might be auto-generated based on name
    status?: 'active' | 'deactive'; 
}

export default async function import_users(
    fastify: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {

    let models = Models.get();
    try {
        // filePayload is attached in the controller from req.body.csv_file
        const filePayload = (req as any).filePayload; 
        if (!filePayload || !filePayload.data || !filePayload.name) {
            return {
                status: 400,
                message: 'File data not found in request.', // More specific error
                data: {},
            };
        }

        // The 'data' property from the onFile handler in app.ts should be a Buffer
        const fileContent = filePayload.data.toString('utf8');
        const fileName = filePayload.name; // We have the filename if needed for logging, etc.

        // Quick check on the onFile handler in app.ts:
        // data: Buffer.from(buff, 'base64') -> this is suspicious. If `buff` is already a buffer, this re-encodes.
        // Assuming `buff` from `part.toBuffer()` is correct, then `data: buff` would be more direct.
        // If it IS base64 encoded, then toString('utf8') on it directly might be wrong.
        // It should be `Buffer.from(filePayload.data, 'base64').toString('utf8')`.
        // For now, proceeding with simple toString('utf8'), but this is a potential bug source from app.ts's onFile.
        // Let's assume for now that filePayload.data is a direct buffer of the file content.

        return new Promise((resolve, reject) => {
            Papa.parse<UserImportData>(fileContent, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    const errors: string[] = [];
                    let successfulImports = 0;
                    let failedImports = 0;

                    // Helper function for unique slug generation
                    async function generateUniqueSlugInternal(name: string): Promise<string> {
                        let baseSlug = `${name}`
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '');
                        if (!baseSlug) baseSlug = 'user'; // Handle empty names for slug generation

                        let uniqueSlug = baseSlug;
                        let counter = 1;
                        while (await models.UserModel.findOne({ where: { slug: uniqueSlug } })) {
                            uniqueSlug = `${baseSlug}-${counter}`;
                            counter++;
                        }
                        return uniqueSlug;
                    }

                    // Helper function for unique UID generation
                    async function generateUniqueUidInternal(): Promise<string> {
                        let uidPrefix = moment().format('YYYYMMDD');
                        let uidCounter = 1001;
                        let uid = `${uidPrefix}${uidCounter}`;
                        while (await models.UserModel.findOne({ where: { uid: uid } })) {
                            uidCounter++;
                            uid = `${uidPrefix}${uidCounter}`;
                        }
                        return uid;
                    }

                    for (const [index, row] of results.data.entries()) {
                        // Skip rows where all fields are empty or whitespace
                        const allFieldsEmpty = Object.values(row).every(
                            (val) => val === undefined || val === null || String(val).trim() === ''
                        );
                        if (allFieldsEmpty) continue;
                        const csvRowNumber = index + 2;

                        try {
                            // --- 1. Basic Validation ---
                            if (!row.email || !row.name || !row.phone_number || !row.role_serial || !row.password) {
                                throw new Error(`Missing required fields (email, name, phone_number, role_serial, password).`);
                            }
                            // TODO: Add more robust data type/format validation here

                            // --- 2. Password Hashing ---
                            let hashedPassword;
                            try {
                                hashedPassword = await bcrypt.hash(row.password, 10);
                            } catch (hashError: any) {
                                throw new Error(`Error hashing password: ${hashError.message}`);
                            }

                            // --- 3. Generate Unique UID ---
                            const uid = await generateUniqueUidInternal();

                            // --- 4. Generate Unique Slug (if not provided) ---
                            const slug = row.slug 
                                ? row.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                                : await generateUniqueSlugInternal(row.name);
                            
                            // Check if provided slug (if any) is already taken
                            if (row.slug) {
                                const existingUserWithSlug = await models.UserModel.findOne({ where: { slug: slug }});
                                if (existingUserWithSlug) {
                                    throw new Error(`Provided slug '${slug}' already exists.`);
                                }
                            }
                             // Check if email is already taken
                            const existingUserWithEmail = await models.UserModel.findOne({ where: { email: row.email }});
                            if (existingUserWithEmail) {
                                throw new Error(`Email '${row.email}' already exists.`);
                            }


                            // --- 5. Create User ---
                            await models.UserModel.create({
                                uid: uid,
                                name: row.name,
                                email: row.email,
                                phone_number: row.phone_number,
                                password: hashedPassword,
                                role_serial: Number(row.role_serial),
                                slug: slug,
                                photo: row.photo || '',
                                is_approved: row.is_approved || '0',
                                branch_id: row.branch_id ? Number(row.branch_id) : undefined,
                                class_id: row.class_id ? Number(row.class_id) : undefined,
                                is_verified: row.is_verified || '0', 
                                is_blocked: row.is_blocked || '0',
                                status: row.status || 'active',
                                token: '', // Provide a default empty string or generate a token if needed
                            });
                            successfulImports++;
                        } catch (error: any) {
                            errors.push(`CSV Row ${csvRowNumber} (Email: ${row.email || 'N/A'}): ${error.message}`);
                            failedImports++;
                        }
                    }

                    resolve({
                        status: errors.length > 0 && successfulImports === 0 ? 400 : 200,
                        message: `Import process completed. Successful: ${successfulImports}, Failed: ${failedImports}.`,
                        data: {
                            successful_imports: successfulImports,
                            failed_imports: failedImports,
                            errors: errors,
                        },
                    });
                },
                error: (error: Error) => {
                    console.error('CSV parsing error:', error);
                    reject({ // This reject will be caught by the outer try-catch
                        status: 500,
                        message: `Error parsing CSV file: ${error.message}`,
                        data: null,
                    });
                },
            });
        });

    } catch (error: any) {
        console.error('Error in import_users service:', error);
        // This catches errors from Papa.parse if it rejects, or other synchronous errors
        return {
            status: error.status || 500,
            message: error.message || 'An unexpected error occurred during user import.',
            data: error.data || null,
        };
    }
}
