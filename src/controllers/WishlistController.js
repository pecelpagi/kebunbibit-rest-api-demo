import * as wishlistService from '../services/WishlistService';
import * as generalValidator from '../validator/GeneralValidator';
import { getCustomerIdFromToken } from '../utils';

export const getProducts = async (req, res) => {
    try {
        const customerId = getCustomerIdFromToken(req);

        const data = await wishlistService.getProducts(customerId);
        const totalData = await wishlistService.getTotalData(customerId);

        res.status(200).json({
            status: true,
            data,
            meta: {
                total_data: totalData,
            },
            message: 'OK'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: err.message });
    }
}

export const toggleData = async (req, res) => {
    try {
        const customerId = getCustomerIdFromToken(req);

        await generalValidator.requireProductID(req.body);

        const payload = {
            customer_id: customerId,
            product_id: req.body.product_id,
        }

        const data = await wishlistService.toggleData(payload);

        res.status(200).json({
            status: true,
            data,
            message: 'OK'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: err.message });
    }
}