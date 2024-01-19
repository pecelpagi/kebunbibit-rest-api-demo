import * as ShippingAddressModel from '../models/ShippingAddress';

export const createListCustomerAddresses = async (customerId, search = '') => {
    const rows = await ShippingAddressModel.findAllByCustomerId(customerId, search);

    return rows;
}
