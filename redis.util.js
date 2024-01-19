const redis = require("redis");

let redisClient = null;

export const EXPIRED_IN_A_DAY = 86400;

export const connectToRedis = async () => {
    redisClient = redis.createClient({
        socket: {
            port: 6379,
            host: '127.0.0.1',
        }
    });

    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
}

export const getRedisClient = () => redisClient;

export const setCacheData = async (key, value, expiredInSeconds = 0) => {
    let options = {};

    if (expiredInSeconds) options = { EX: expiredInSeconds }

    await redisClient.set(key, value, options);
}

export const getCacheData = async (key) => await redisClient.get(key);

export const removeCacheData = async (key) => await redisClient.del(key);

export const cacheify = async (redisKey, onExecuteServiceWhenUncached = () => { }, expiredInSeconds = 0) => {
    let isCached = false;
    let cachedData = null;

    const cacheResult = await redisClient.get(redisKey);

    if (cacheResult) {
        isCached = true;
        cachedData = JSON.parse(cacheResult);
    } else {
        const serviceResponse = await onExecuteServiceWhenUncached();
        cachedData = serviceResponse;

        let needToCache = !!serviceResponse;

        if (serviceResponse && Array.isArray(serviceResponse)) needToCache = (serviceResponse.length > 0);

        if (needToCache) await setCacheData(redisKey, JSON.stringify(serviceResponse), expiredInSeconds);
    }

    return { cachedData, isCached };
}
