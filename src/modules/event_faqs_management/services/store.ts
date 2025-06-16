import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { InferCreationAttributes } from 'sequelize';

import response from '../../../helpers/response';
import custom_error from '../../../helpers/custom_error';
import error_trace from '../../../helpers/error_trace';

import { modelName } from '../models/model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    let field = '';
    let fields = [
        { name: 'event_id', isArray: true },
        { name: 'title', isArray: false },
        { name: 'description', isArray: false },
    ];

    //validate array fields
    for (const field of fields.filter(f => f.isArray)) {
        await body(field.name)
            .custom(value => {
                try {
                    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
                    return Array.isArray(parsed) && parsed.length > 0;
                } catch {
                    return false;
                }
            })
            .withMessage(`the <b>${field.name.replaceAll('_', ' ')}</b> field is required`)
            .run(req);
    }

    // Validate other fields
    for (const field of fields.filter(f => !f.isArray)) {
        await body(field.name)
            .not()
            .isEmpty()
            .withMessage(`the <b>${field.name.replaceAll('_', ' ')}</b> field is required`)
            .run(req);
    }


    let result = await validationResult(req);

    return result;
}

async function store(
    fastify_instance: FastifyInstance,
    req: FastifyRequest
): Promise<responseObject> {
    /** validation */
    let validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'Validation error', validate_result.array());
    }

    /** initializations */
    let models = Models.get();
    let body = req.body as anyObject;
    let data = new models[modelName]();

    // Helper to parse or return original value
    const parseField = (field: any) => {
        try {
            return typeof field === 'string' ? JSON.parse(field) : field;
        } catch {
            return field;
        }
    };

    // Helper to get clean value
    const getValue = (val: any) => {
        let parsedValue = parseField(val);
        return Array.isArray(parsedValue) ? parsedValue[0] : parsedValue;
    }

    let inputs: InferCreationAttributes<typeof data> = {
        event_id: getValue(body.event_id),
        title: body.title,
        description: body.description,
    };

    try {
        /** Store event data */
        let savedData = await (await data.update(inputs)).save();

        /** Parse and store FAQs */
        let faqRecords = [];
        if (body.faqs) {
            let faqs = JSON.parse(body.faqs);
            if (Array.isArray(faqs)) {
                for (let faq of faqs) {
                    let createdFaq = await models.EventFaqsModel.create({
                        event_id: getValue(body.event_id), // Link FAQ to the event
                        title: faq.title,
                        description: faq.description,
                    });
                    faqRecords.push(createdFaq);
                }
            }
        }

        /** Fetch all FAQs for the event */
        let allFaqs = await models.EventFaqsModel.findAll({
            where: { event_id: getValue(body.event_id), },
        });

        return response(201, 'Data created', {
            faqs: allFaqs, // Include all stored FAQs
        });

    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('Server error', 500, error.message, uid);
    }
}

export default store;
