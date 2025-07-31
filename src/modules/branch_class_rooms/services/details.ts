import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../../../helpers/response';
import error_trace from '../../../common/errors/error_trace';
import custom_error from '../../../common/errors/custom_error';
import { modelName } from '../models/model';
import Models from '../../../database/models';
import { Op } from 'sequelize';


async function details(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = Models.get();

    let params = req.params as any;

    try {
        let data = await models[modelName].findOne({
            where: {
                id: params.id,
            },
            paranoid: false, // Add this line
        });

        if (data) {
            // Helper function to fetch related data based on IDs
            const fetchRelatedData = async (
                model: any, 
                ids: number[], 
                attributes: string[]
            ): Promise<any[]> => {
                if (!ids || !Array.isArray(ids) || ids.length === 0) {
                    return [];
                }
                return await model.findAll({
                    where: { id: { [Op.in]: ids } },
                    attributes,
                });
            };

            // Configuration for related data fetching
            const relatedDataConfig = [
                {
                    field: 'branch_user_id',
                    model: models.UserModel,
                    attributes: ['id', 'name'],
                    dataKey: 'users'
                },
                {
                    field: 'branch_id',
                    model: models.BranchInfosModel,
                    attributes: ['id', 'name'],
                    dataKey: 'branches'
                },
                {
                    field: 'academic_year_id',
                    model: models.AcademicYearModel,
                    attributes: ['id', 'title'],
                    dataKey: 'academic_years'
                },
                {
                    field: 'branch_class_building_id',
                    model: models.BranchClassBuildingsModel,
                    attributes: ['id', 'title'],
                    dataKey: 'branch_class_buildings'
                }
            ];

            // Fetch all related data concurrently
            const relatedDataPromises = relatedDataConfig.map(config => 
                fetchRelatedData(config.model, (data as any)[config.field], config.attributes)
            );

            const [users, branches, academicYears, branchClassBuildings] = await Promise.all(relatedDataPromises);

            // Attach related data to the main data object
            relatedDataConfig.forEach((config, index) => {
                const relatedData = [users, branches, academicYears, branchClassBuildings][index];
                (data as any).dataValues[config.dataKey] = relatedData;
            });

            return response(200, 'data found', data);
        } else {
            throw new custom_error('not found', 404, 'data not found');
        }
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.params);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default details;
