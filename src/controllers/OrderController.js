import * as orderCache from '../cache/OrderCache';
import * as cartCache from '../cache/CartCache';
import * as orderService from '../services/OrderService';
import * as orderValidator from '../validator/OrderValidator';
import { getCustomerIdFromToken } from "../utils";

export const getCustomerOrders = async (req, res) => {
    try {
        const customerId = getCustomerIdFromToken(req);

        const { cachedData, isCached } = await orderCache.getCustomerOrders(customerId);

        res.status(200).json({
            status: true,
            data: cachedData,
            meta: {
                from_cache: isCached,
            },
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

export const create = async (req, res) => {
    try {
        const customerId = getCustomerIdFromToken(req);

        await orderValidator.forSavingData(req.body);

        const { cachedData: customerCartData } = await cartCache.getProducts(customerId);
        
        if (customerCartData.length === 0) throw new Error('cart is empty');

        const payload = {
            shipping_address: req.body.shipping_address,
            customer_id: customerId,
            products: customerCartData,
        }

        await orderService.create(payload);

        const customerOrders = await orderService.createListCustomerOrders(customerId);

        await orderCache.setCacheCustomerOrders(customerId, customerOrders);
        await cartCache.removeCacheCustomerCartData(customerId);
        await cartCache.removeCacheTotalCustomerCartData(customerId);

        res.status(200).json({
            status: true,
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}