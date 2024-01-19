import Joi from 'joi';
import { handleValidation } from './utils';

export const forSavingData = async (value) => {
    const schema = Joi.object({
        product_id: Joi.number().required(),
        qty: Joi.number().required(),
    });

    await handleValidation(schema, value);
}

export const requireProductID = async (value) => {
    const schema = Joi.object({
        product_id: Joi.number().required(),
    });

    await handleValidation(schema, value);
}