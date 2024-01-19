import Joi from 'joi';
import { handleValidation } from './utils';

export const forSavingData = async (value) => {
    const schema = Joi.object({
        shipping_address: Joi.object().required(),
    })

    await handleValidation(schema, value);
}