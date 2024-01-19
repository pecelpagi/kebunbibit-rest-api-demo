import Joi from 'joi';
import { handleValidation } from './utils';

export const requireProductID = async (value) => {
    const schema = Joi.object({
        product_id: Joi.number().required(),
    });

    await handleValidation(schema, value);
}