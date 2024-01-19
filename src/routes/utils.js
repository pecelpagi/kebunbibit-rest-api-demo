const PREFIX = '/api';

export const addPrefix = (url = '') => {
    if (url) return `${PREFIX}${url}`;

    return PREFIX;
}