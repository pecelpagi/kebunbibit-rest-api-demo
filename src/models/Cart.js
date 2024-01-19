import {
    createDatabaseConnection, getDateTimeNow,
    processCreatingData, processFindingOneDataBy,
    processRemovingData, processUpdatingData
} from './utils';

export const findOneBy = async (filteredBy = {}) => {
    const result = await processFindingOneDataBy(filteredBy, 'Carts');

    return result;
}

export const getProducts = async (customerId) => {
    const queryString = `
        SELECT p.*, c.qty FROM Products p
        JOIN Carts c ON c.product_id = p.id
        WHERE c.customer_id = ?
    `;

    const connection = await createDatabaseConnection();
    const [rows] = await connection.execute(queryString, [customerId]);

    return rows;
}

export const create = async (dataToInsert = {}) => {
    const dateNow = getDateTimeNow();

    let data = {
        ...dataToInsert,
        created_at: dateNow,
        updated_at: dateNow,
    }

    const result = await processCreatingData(data, 'Carts');

    return result
}

export const updateQty = async ({ customerId, productId, qty }) => {
    const dateNow = getDateTimeNow();

    const dataToUpdate = {
        qty,
        updated_at: dateNow,
    }

   await processUpdatingData(dataToUpdate, { customer_id: customerId, product_id: productId }, 'Carts');
}

export const deleteProduct = async ({ customerId, productId }) => {
    await processRemovingData({ customer_id: customerId, product_id: productId }, 'Carts');
}

export const getTotalCustomerCartProduct = async (customerId) => {
    const queryString = `
        SELECT SUM(qty) AS total_data 
        FROM Carts
        WHERE customer_id = ?
    `;

    const connection = await createDatabaseConnection();
    const [rows] = await connection.execute(queryString, [customerId]);

    return Number(rows[0].total_data);
}