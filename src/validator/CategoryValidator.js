import Joi from 'joi';
import { handleValidation } from './utils';

export const forSavingData = async (value, type = 'create') => {
    let schemaValue = {
        name: Joi.string().required(),
    }

    if (type === 'update') {
        schemaValue = {
            ...schemaValue,
            id: Joi.number().required(),
        }
    }

    const schema = Joi.object(schemaValue);

    await handleValidation(schema, value);
}

export const requireID = async (value) => {
    const schema = Joi.object({
        id: Joi.number().required(),
    });

    await handleValidation(schema, value);
}

export const requireSlug = async (value) => {
    const schema = Joi.object({
        slug: Joi.string().required(),
    });

    await handleValidation(schema, value);
}