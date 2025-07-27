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
            // Fetch associated data
        const userModel = models.UserModel;
        const branchInfoModel = models.BranchInfosModel;
        const academicYearModel = models.AcademicYearModel;
        const academicCalendarEventTypesModel = models.AcademicCalendarEventTypesModel;

        // If 'data' is a single object, not an array, process it directly
        const rules = Array.isArray(data) ? data : [data];
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];

            // Fetch user names
            const users = await userModel.findAll({
                where: {
                    id: {
                        [Op.in]: rule.branch_user_id,
                    },
                },
                attributes: ['id', 'name'],
            });
            rule.dataValues.users = users;

            // Fetch branch names
            const branches = await branchInfoModel.findAll({
                where: {
                    id: {
                        [Op.in]: rule.branch_id,
                    },
                },
                attributes: ['id', 'name'],
            });
            rule.dataValues.branches = branches;

            // Fetch academic year titles
            const academicYears = await academicYearModel.findAll({
                where: {
                    id: {
                        [Op.in]: rule.academic_year_id,
                    },
                },
                attributes: ['id', 'title'],
            });
            rule.dataValues.academic_years = academicYears;

            // Fetch academic calendar event types
            const academicCalendarEventTypes = await academicCalendarEventTypesModel.findAll({
                where: {
                    id: {
                        [Op.in]: rule.academic_calendar_event_type_id,
                    },
                },
                attributes: ['id', 'title'],
            });
            rule.dataValues.academic_calendar_event_types = academicCalendarEventTypes;
        }

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
