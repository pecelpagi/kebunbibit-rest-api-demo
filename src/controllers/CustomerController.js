import jwt from 'jsonwebtoken';
import * as customerService from '../services/CustomerService';
import { COOKIE_TYPE, getCustomerIdFromToken, TOKEN_TYPE } from '../utils';

export const login = async (req, res) => {
    try {
        const customer = await customerService.login(req.body);
        const SECRET_KEY = String(process.env.JWT_SECRET_KEY);
        const tokenPayload = {
            data: {
                id: customer.id,
                token_type: TOKEN_TYPE.CUSTOMER,
            }
        }
        const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '17520h' });

        res.cookie(COOKIE_TYPE.CUSTOMER_TOKEN, token, {
            secure: false,
            httpOnly: true,
        });

        res.cookie(COOKIE_TYPE.IS_LOGGED_IN, true);

        res.status(200).json({
            status: true,
            token,
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

export const getCustomerByToken = async (req, res) => {
    try {
        const customerId = getCustomerIdFromToken(req);

        const customer = await customerService.getCustomerById(customerId);
        
        delete customer.passwd;

        res.status(200).json({
            status: true,
            data: customer,
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

export const logout = async (req, res) => {
    try {
        getCustomerIdFromToken(req);

        Object.keys(COOKIE_TYPE).forEach((key) => {
            res.clearCookie(COOKIE_TYPE[key]);
        });

        res.status(200).json({
            status: true,
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}