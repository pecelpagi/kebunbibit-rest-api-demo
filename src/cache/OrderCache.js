import { cacheify, EXPIRED_IN_A_DAY, setCacheData } from '../../redis.util';
import * as orderService from '../services/OrderService';

const CACHE_KEY = {
    GET_CUSTOMER_ORDERS: 'GET_CUSTOMER_ORDERS',
}

export const setCacheCustomerOrders = async (customerId, data) => {
    await setCacheData(`${CACHE_KEY.GET_CUSTOMER_ORDERS}::${customerId}`, JSON.stringify(data), EXPIRED_IN_A_DAY);
}

export const getCacheCustomerOrders = async (customerId) => await getCacheData(`${CACHE_KEY.GET_CUSTOMER_ORDERS}::${customerId}`);

export const getCustomerOrders = async (customerId) => {
    const redisKey = `${CACHE_KEY.GET_CUSTOMER_ORDERS}::${customerId}`;

    const onExecuteServiceWhenUncached = async () => await orderService.createListCustomerOrders(customerId);

    const cacheResult = await cacheify(redisKey, onExecuteServiceWhenUncached, EXPIRED_IN_A_DAY);

    return cacheResult;
}
