import {
    createDatabaseConnection,
    processCreatingData, processFindingOneDataBy,
    processRemovingData
} from './utils';

export const findOneBy = async (filteredBy = {}) => {
    const result = await processFindingOneDataBy(filteredBy, 'Wishlists');

    return result;
}

export const create = async (dataToInsert = {}) => {
    const result = await processCreatingData(dataToInsert, 'Wishlists');

    return result
}

export const deleteData = async (data) => {
    await processRemovingData(data, 'Wishlists');
}

export const getProducts = async (customerId) => {
    const queryString = `
        SELECT p.* FROM Products p
        INNER JOIN Wishlists w ON w.product_id = p.id
        WHERE w.customer_id = ?
    `;

    const connection = await createDatabaseConnection();
    const [rows] = await connection.execute(queryString, [customerId]);

    return rows;
}

export const getTotalCustomerWishlistProduct = async (customerId) => {
    const queryString = `
        SELECT COUNT(*) AS total_data FROM Products p
        INNER JOIN Wishlists w ON w.product_id = p.id
        WHERE w.customer_id = ?
    `;

    const connection = await createDatabaseConnection();
    const [rows] = await connection.execute(queryString, [customerId]);

    return Number(rows[0].total_data);
}