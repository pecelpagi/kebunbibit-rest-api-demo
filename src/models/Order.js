import { ORDER_STATUS_TYPE } from '../utils';
import { createDatabaseConnection, getDateTimeNow, processCreatingData, processFindingDataBy, processRemovingData } from './utils';

export const findBy = async (filteredBy = {}) => {
    const results = await processFindingDataBy(filteredBy, 'Orders');

    return results;
}

export const createWithTransaction = async (data) => {
    const connection = await createDatabaseConnection();
    await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

    await connection.beginTransaction();

    try {
        const {
            customer_id, order_number,
            total, shipping_address, products
        } = data;

        const dateNow = getDateTimeNow();

        let dataToInsert = {
            customer_id,
            order_number,
            payment_method: 1,
            order_status: ORDER_STATUS_TYPE.NEW,
            order_total: total,
            payment_total: total,
            shipping_address: JSON.stringify(shipping_address),
            products: JSON.stringify(products),
            created_at: dateNow,
            updated_at: dateNow,
        }

        const orderId = await processCreatingData(dataToInsert, 'Orders', connection);

        await processRemovingData({ customer_id }, 'Carts');

        await connection.commit();

        return orderId;
    } catch (e) {
        connection.rollback();
        throw e;
    }
}