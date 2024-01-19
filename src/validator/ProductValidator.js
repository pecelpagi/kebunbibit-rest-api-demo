import Joi from 'joi';
import { handleValidation } from './utils';

export const forSavingData = async (value, type = 'create') => {
    let schemaValue = {
        id_category: Joi.number().required(),
        name: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required(),
    }

    if (type === 'update') {
        schemaValue = {
            ...schemaValue,
            id: Joi.number().required(),
        }
    }

    const schema = Joi.object(schemaValue).when(Joi.object({ images: Joi.exist() }).unknown(), {
        then: Joi.object({
            images: Joi.string().custom((value, helper) => {
                try {
                    if (!isNaN(Number(value))) throw new Error('number is not allowed');
                    JSON.parse(value);
                } catch (e) {
                    return helper.message('images must be an array');
                }

                return true
            }),
        })
    });

    await handleValidation(schema, value);
}

export const requireID = async (value) => {
    const schema = Joi.object({
        id: Joi.number().required(),
    });

    await handleValidation(schema, value);
}