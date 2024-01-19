import md5 from 'md5';
import { cacheify, removeCacheData, setCacheData, getCacheData, EXPIRED_IN_A_DAY } from '../../redis.util';
import * as categoryService from '../services/CategoryService';

const CACHE_KEY = {
    TOTAL_CATEGORY: 'TOTAL_CATEGORY::PRODUCT',
    GET_CATEGORY_BY_SLUG: 'GET_CATEGORY_BY_SLUG',
}

export const removeCacheCategoryDataBySlug = async (slug) => { await removeCacheData(`${CACHE_KEY.GET_CATEGORY_BY_SLUG}::${slug}`); }

export const setCacheCategoryDataBySlug = async (slug, data) => {
    await setCacheData(`${CACHE_KEY.GET_CATEGORY_BY_SLUG}::${slug}`, JSON.stringify(data), EXPIRED_IN_A_DAY);
}

export const getCacheCategoryDataBySlug = async (slug) => await getCacheData(`${CACHE_KEY.GET_CATEGORY_BY_SLUG}::${slug}`);

export const setCacheTotalCategory = async (totalCategory) => {
    await setCacheData(`${CACHE_KEY.TOTAL_CATEGORY}`, totalCategory);
}

export const getCacheTotalCategory = async () => await getCacheData(`${CACHE_KEY.TOTAL_CATEGORY}`);

const getTotalCategory = async () => {
    const cacheResult = await getCacheTotalCategory();

    if (cacheResult) return +cacheResult;

    const totalData = await categoryService.getTotalData();

    await setCacheTotalCategory(totalData);

    return +totalData;
}

export const listCategories = async ({ payload, cacheHelperKey }) => {
    const totalData = await getTotalCategory();

    const redisKey = md5(JSON.stringify({ ...payload, totalData, cacheHelperKey }));

    const onExecuteServiceWhenUncached = async () => (await categoryService.createListCategories(payload));

    const cacheResult = await cacheify(redisKey, onExecuteServiceWhenUncached, EXPIRED_IN_A_DAY);

    return cacheResult;
}

export const getCategoryBySlug = async (slug) => {
    const redisKey = `${CACHE_KEY.GET_CATEGORY_BY_SLUG}::${slug}`;

    const onExecuteServiceWhenUncached = async () => (await categoryService.findBySlug(slug));

    const cacheResult = await cacheify(redisKey, onExecuteServiceWhenUncached, EXPIRED_IN_A_DAY);

    return cacheResult;
}
