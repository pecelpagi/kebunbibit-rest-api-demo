import jwt from 'jsonwebtoken';
import moment from 'moment';

const SECRET_KEY = String(process.env.JWT_SECRET_KEY);

export const TOKEN_TYPE = {
    CUSTOMER: 'CUSTOMER',
    EMPLOYEE: 'EMPLOYEE',
};

export const COOKIE_TYPE = {
    IS_LOGGED_IN: 'IS_LOGGED_IN',
    CUSTOMER_TOKEN: 'CUSTOMER_TOKEN',
  };

export const ORDER_STATUS_TYPE = {
    NEW: 1,
    PROCESSED: 2,
    SHIPPED: 3,
    RECEIVED: 4,
    CANCELED: 5,
}

export const getTokenFromRequest = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.CUSTOMER_TOKEN) {
        return req.cookies && req.cookies.CUSTOMER_TOKEN;
    }

    return null;
}

export const decodeToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
}

export const getCustomerIdFromToken = (req) => {
    const token = getTokenFromRequest(req);
    const { data } = decodeToken(token);

    if (data.token_type !== TOKEN_TYPE.CUSTOMER) throw new Error('CUSTOMER_ONLY');

    return data.id;
}

export const getEmployeeIdFromToken = (req) => {
    const token = getTokenFromRequest(req);
    const { data } = decodeToken(token);

    if (data.token_type !== TOKEN_TYPE.EMPLOYEE) throw new Error('EMPLOYEE_ONLY');

    return data.id;
}

export const reformatDateTime = (datetime) => moment(datetime, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY HH:mm:ss');

export const shortenProducts = (products) => {
    let retval = products.filter((x, i) => (i < 2)).map(x => (x.name)).join(", ");

    if (products.length > 2) retval = `${retval}, dan ${products.length - 2} Item lainnya`;

    return retval;
}

export const slugify = (val) => {
    return val
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
}
