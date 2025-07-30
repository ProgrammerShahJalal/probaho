import { FastifyInstance, FastifyRequest } from 'fastify';
import Papa from 'papaparse';
import { responseObject } from '../../../common_types/object';
import Models from '../../../database/models';

interface ImportData {
    branch_user_id: number[] | string;
    branch_id: number[] | string; // Required field, not optional
    academic_year_id: number[] | string;
    title: string;
    code: string;
    capacity: number;
    image?: string; // Optional image field
    status?: 'active' | 'deactive'; 
}

export default async function importCSV(
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

        // The 'data' property from the onFile handler should be a Buffer
        const fileContent = filePayload.data.toString('utf8');
        const fileName = filePayload.name; // We have the filename if needed for logging, etc.

        return new Promise((resolve, reject) => {
            Papa.parse<ImportData>(fileContent, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    const errors: string[] = [];
                    let successfulImports = 0;
                    let failedImports = 0;

                    for (const [index, row] of results.data.entries()) {
                        // Skip rows where all fields are empty or whitespace
                        const allFieldsEmpty = Object.values(row).every(
                            (val) => val === undefined || val === null || String(val).trim() === ''
                        );
                        if (allFieldsEmpty) continue;
                        const csvRowNumber = index + 2;

                        try {
                            // --- 1. Basic Validation ---
                            if (!row.branch_user_id || !row.branch_id || !row.academic_year_id || !row.title || !row.code || !row.capacity || !row.status) {
                                throw new Error(`Missing required fields (branch_user_id, branch_id, academic_year_id, title, code, capacity, status).`);
                            }

                            // --- 2. Data Type Validation ---
                            const capacity = parseInt(String(row.capacity), 10);
                            if (isNaN(capacity) || capacity < 1) {
                                throw new Error(`Invalid capacity: must be a positive integer.`);
                            }

                            await models.BranchClassBuildingsModel.create({
                                branch_user_id: row.branch_user_id,
                                branch_id: row.branch_id ? row.branch_id : [1], // Default to [1] if not provided
                                academic_year_id: row.academic_year_id,
                                title: row.title,
                                code: row.code,
                                capacity: capacity,
                                image: row.image || undefined,
                                status: row.status,
                            });
                            successfulImports++;
                        } catch (error: any) {
                            errors.push(`CSV Row ${csvRowNumber}: ${error.message}`);
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
        console.error('Error in import_branch_class_buildings service:', error);
        // This catches errors from Papa.parse if it rejects, or other synchronous errors
        return {
            status: error.status || 500,
            message: error.message || 'An unexpected error occurred during branch class buildings import.',
            data: error.data || null,
        };
    }
}
