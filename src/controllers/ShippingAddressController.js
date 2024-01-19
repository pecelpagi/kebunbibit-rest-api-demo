import * as shippingAddressService from '../services/ShippingAddressService';
import { getCustomerIdFromToken } from '../utils';

export const getCustomerAddresses = async (req, res) => {
    try {
        const customerId = getCustomerIdFromToken(req);

        const searchKeyword = req.query.search ? req.query.search : '';

        const addresses = await shippingAddressService.createListCustomerAddresses(customerId, searchKeyword);

        res.status(200).json({
            status: true,
            data: addresses,
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}
