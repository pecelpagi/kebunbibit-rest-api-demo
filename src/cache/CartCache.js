import { cacheify, setCacheData, getCacheData, EXPIRED_IN_A_DAY, removeCacheData } from '../../redis.util';
import * as cartService from '../services/CartService';

const CACHE_KEY = {
    CUSTOMER_CART_DATA: 'CUSTOMER_CART_DATA',
    TOTAL_CUSTOMER_CART_DATA: 'TOTAL_CUSTOMER_CART_DATA',
}

export const removeCacheCustomerCartData = async (customerId) => { await removeCacheData(`${CACHE_KEY.CUSTOMER_CART_DATA}::${customerId}`); }

export const setCacheCustomerCartData = async (customerId, cartData) => {
    await setCacheData(`${CACHE_KEY.CUSTOMER_CART_DATA}::${customerId}`, JSON.stringify(cartData), EXPIRED_IN_A_DAY);
}

export const getCacheCustomerCartData = async (customerId) => await getCacheData(`${CACHE_KEY.CUSTOMER_CART_DATA}::${customerId}`);

export const removeCacheTotalCustomerCartData = async (customerId) => { await removeCacheData(`${CACHE_KEY.TOTAL_CUSTOMER_CART_DATA}::${customerId}`); }

export const setCacheTotalCustomerCartData = async (customerId, totalCustomerCartProduct) => {
    await setCacheData(`${CACHE_KEY.TOTAL_CUSTOMER_CART_DATA}::${customerId}`, totalCustomerCartProduct, EXPIRED_IN_A_DAY);
}

export const getCacheTotalCustomerCartData = async (customerId) => await getCacheData(`${CACHE_KEY.TOTAL_CUSTOMER_CART_DATA}::${customerId}`);

const getTotalCustomerCartProduct = async (customerId) => {
    const cacheResult = await getCacheTotalCustomerCartData(customerId);

    if (cacheResult) return +cacheResult;

    const totalData = await cartService.getTotalCustomerCartProduct(customerId);

    await setCacheTotalCustomerCartData(customerId, totalData);

    return +totalData;
}

export const getProducts = async (customerId) => {
    const totalData = await getTotalCustomerCartProduct(customerId);

    const redisKey = `${CACHE_KEY.CUSTOMER_CART_DATA}::${customerId}`;

    const onExecuteServiceWhenUncached = async () => (await cartService.getProducts(customerId));

    const cacheResult = await cacheify(redisKey, onExecuteServiceWhenUncached, EXPIRED_IN_A_DAY);

    return { ...cacheResult, totalData };
}
