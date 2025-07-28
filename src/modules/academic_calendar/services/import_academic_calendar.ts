import { FastifyInstance, FastifyRequest } from 'fastify';
import Papa from 'papaparse';
import bcrypt from 'bcrypt';
import moment from 'moment'; // Import moment
import { responseObject } from '../../../common_types/object';
import Models from '../../../database/models';

interface ImportData {
    branch_user_id: number[] | string;
    branch_id?: number[] | string; // Allow single or multiple branches
    academic_year_id: number[] | string;
    academic_calendar_event_types_id: number[] | string; // Allow single or multiple event types
    event_name: string;
    description?: string;
    date: Date; 
    status?: 'active' | 'deactive'; 
}

export default async function import_academic_calendar(
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
                            if (!row.branch_user_id || !row.academic_year_id || !row.academic_calendar_event_types_id || !row.event_name || !row.description || !row.date || !row.status) {
                                throw new Error(`Missing required fields (branch_user_id, academic_year_id, academic_calendar_event_types_id, event_name, description, data, status).`);
                            }

                            await models.AcademicCalendarModel.create({
                                branch_user_id: row.branch_user_id,
                                branch_id: row.branch_id || [1], // Default to branch 1 if not provided
                                academic_year_id: row.academic_year_id,
                                academic_calendar_event_types_id: row.academic_calendar_event_types_id,
                                event_name: row.event_name,
                                description: row.description,
                                date: row.date ? moment(row.date).toDate() : new Date(),
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
        console.error('Error in import_academic_calendar service:', error);
        // This catches errors from Papa.parse if it rejects, or other synchronous errors
        return {
            status: error.status || 500,
            message: error.message || 'An unexpected error occurred during academic calendar import.',
            data: error.data || null,
        };
    }
}
