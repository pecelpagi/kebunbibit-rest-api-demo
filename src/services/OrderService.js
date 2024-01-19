import moment from 'moment';
import * as OrderModel from '../models/Order';
import { ORDER_STATUS_TYPE, reformatDateTime, shortenProducts } from '../utils';

const processCreatingOrderNumber = () => {
    const stringCode = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ12345';
    let codeYear = '',
        codeMonth = '',
        codeDate = '';

    const year = moment().format('YY');
    const numYear1 = year[0] !== '0' ? stringCode[parseInt(year[0], 10) - 1] : '0',
        numYear2 = year[1] !== '0' ? stringCode[parseInt(year[1], 10) - 1] : '0';
    codeYear = numYear1 + numYear2;

    const month = moment().format('MM');
    codeMonth = stringCode[parseInt(month, 10) - 1];

    const date = moment().format('DD');
    codeDate = stringCode[parseInt(date, 10) - 1];

    const codeRandom = Math.random().toString(36).substr(3, 4);

    return ("KBU" + codeYear + codeMonth + codeDate + codeRandom).toUpperCase();
}

const generateOrderNumber = async () => {
    let orderNumber = processCreatingOrderNumber();
    const results = await OrderModel.findBy({ order_number: orderNumber });

    const found = results.length > 0;

    if (found) orderNumber = await generateOrderNumber();

    return orderNumber;
}

const createOrderStatusText = (orderStatus) => {
    let retval = '';

    switch (orderStatus) {
        case ORDER_STATUS_TYPE.NEW:
            retval = 'Menunggu Pembayaran';
            break;
        case ORDER_STATUS_TYPE.PROCESSED:
            retval = 'Sedang Diproses';
            break;
        case ORDER_STATUS_TYPE.SHIPPED:
            retval = 'Proses Pengiriman';
            break;
        case ORDER_STATUS_TYPE.RECEIVED:
            retval = 'Sudah Diterima';
            break;
        case ORDER_STATUS_TYPE.CANCELED:
            retval = 'Dibatalkan';
            break;
        default:
            // do nothing
    }

    return retval;
}

export const createListCustomerOrders = async (customerId) => {
    const data = await OrderModel.findBy({ customer_id: customerId });

    const reformatData = data.map((x) => {
        return {
            ...x,
            order_status_text: createOrderStatusText(x.order_status),
            order_total: Number(x.order_total),
            payment_total: Number(x.payment_total),
            products: JSON.parse(x.products),
            shorten_products: shortenProducts(JSON.parse(x.products)),
            shipping_address: JSON.parse(x.shipping_address),
            created_at: reformatDateTime(x.created_at),
            updated_at: reformatDateTime(x.updated_at),
        }
    })

    return reformatData;
}

export const create = async (data) => {
    const orderTotal = data.products.reduce((total, currVal) => total + (currVal.price * currVal.qty), 0);
    const orderNumber = await generateOrderNumber();

    await OrderModel.createWithTransaction({ ...data, order_number: orderNumber, total: orderTotal });

    return data;
}