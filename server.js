import express from 'express'
import jwt from 'express-jwt';
import cookieParser from 'cookie-parser';
import routes from './src/routes';
import { connectToRedis } from './redis.util';
import { getTokenFromRequest } from './src/utils';

const SECRET_KEY = String(process.env.JWT_SECRET_KEY);

const app = express();
const PORT = 3300;

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser());

app.use(
    jwt({
        secret: SECRET_KEY,
        getToken: getTokenFromRequest,
    }).unless({
        path: [
            '/',
            '/api/customer-login',
            '/api/employee-login',
            '/api/category',
            /^\/api\/category-by-slug\/.*/,
            /^\/api\/product\/.*/,
            '/api/product',
        ],
    }),
);

routes(app);

app.use(function (req, res, next) {
    res.status(404);
    res.json({
        status: false,
        message: '404 Not Found'
    });
});

app.use(function (err, req, res, next) {
    const message = err.message;

    res.status(err.status || 500);
    res.json({
        status: false,
        error: err,
        message: message
    });
});

app.listen(PORT, () => {
    connectToRedis();
    console.log('App listening on port %s, in environment %s!', PORT, String(process.env.NODE_ENV || '').toUpperCase());
})

module.exports = app