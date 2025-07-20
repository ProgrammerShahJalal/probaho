import { FastifyInstance, FastifyRequest } from 'fastify';
import Papa from 'papaparse';
import { responseObject } from '../../../common_types/object';
import Models from '../../../database/models';
import { modelName } from '../models/model';
import response from '../../../helpers/response';

interface AcademicYearImportData {
    title: string;
    start_month: string;
    end_month: string;
}

export default async function import_academic_years(
    fastify: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = Models.get();
    try {
        const filePayload = (req as any).filePayload;
        if (!filePayload || !filePayload.data || !filePayload.name) {
            return response(400, 'File data not found in request.', {});
        }

        const fileContent = filePayload.data.toString('utf8');

        return new Promise((resolve, reject) => {
            Papa.parse<AcademicYearImportData>(fileContent, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    const errors: string[] = [];
                    let successfulImports = 0;
                    let failedImports = 0;

                    for (const [index, row] of results.data.entries()) {
                        const allFieldsEmpty = Object.values(row).every(
                            (val) => val === undefined || val === null || String(val).trim() === ''
                        );
                        if (allFieldsEmpty) continue;
                        const csvRowNumber = index + 2;

                        try {
                            if (!row.title || !row.start_month || !row.end_month) {
                                throw new Error(`Missing required fields (title, start_month, end_month).`);
                            }

                            await models[modelName].create({
                                title: row.title,
                                start_month: row.start_month,
                                end_month: row.end_month,
                            });
                            successfulImports++;
                        } catch (error: any) {
                            errors.push(`CSV Row ${csvRowNumber}: ${error.message}`);
                            failedImports++;
                        }
                    }

                    resolve(response(errors.length > 0 && successfulImports === 0 ? 400 : 200, `Import process completed. Successful: ${successfulImports}, Failed: ${failedImports}.`, {
                        successful_imports: successfulImports,
                        failed_imports: failedImports,
                        errors: errors,
                    }));
                },
                error: (error: Error) => {
                    console.error('CSV parsing error:', error);
                    reject(response(500, `Error parsing CSV file: ${error.message}`, {}));
                },
            });
        });

    } catch (error: any) {
        console.error('Error in import_academic_years service:', error);
        return response(error.status || 500, error.message || 'An unexpected error occurred during academic year import.', {});
    }
}
