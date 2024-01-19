import {
    getDateTimeNow, createDatabaseConnection,
    processCreatingData, processUpdatingData,
    processMassCreatingData, processFindingOneDataBy,
    processRemovingData,
} from './utils';

export const findOneBy = async (filteredBy = {}) => {
    const result = await processFindingOneDataBy(filteredBy, 'Products');

    return result;
}

export const findAll = async (limit = 0, offset = 0, search = '', categoryId = null) => {
    const params = [];
    let queryString = `SELECT p.id, p.id_category, c.name AS category_name, p.name, p.slug, p.price, p.created_at, p.updated_at FROM Products p 
                       INNER JOIN Categories c ON p.id_category = c.id`;

    const filters = [];

    if (search) {
        filters.push('LOWER(CONCAT(p.name, c.name)) LIKE LOWER(?)');
        params.push(`%${search}%`);
    }

    if (!!categoryId) {
        filters.push(`id_category = ?`);
        params.push(categoryId);
    }

    filters.map((x, i) => {
        if (i === 0) queryString = `${queryString} WHERE ${x}`;
        if (i > 0) queryString = `${queryString} AND ${x}`;

        return x;
    });

    if (limit) {
        queryString = `${queryString} LIMIT ?`;
        params.push(limit);
    };

    if (offset) {
        queryString = `${queryString} OFFSET ?`;
        params.push(offset);
    }

    const connection = await createDatabaseConnection();
    const [results] = await connection.execute(queryString, params);

    return results;
}

export const getTotalData = async (search, categoryId = null) => {
    const params = [];
    let queryString = 'SELECT COUNT(*) AS total_data FROM Products p INNER JOIN Categories c ON p.id_category = c.id';

    const filters = [];

    if (search) {
        filters.push('LOWER(CONCAT(p.name, c.name)) LIKE LOWER(?)');
        params.push(`%${search}%`);
    }

    if (!!categoryId) {
        filters.push(`id_category = ?`);
        params.push(categoryId);
    }

    filters.map((x, i) => {
        if (i === 0) queryString = `${queryString} WHERE ${x}`;
        if (i > 0) queryString = `${queryString} AND ${x}`;

        return x;
    });

    const connection = await createDatabaseConnection();
    const [rows] = await connection.execute(queryString, params);

    const row = rows[0];

    return row.total_data;
}

export const create = async (dataToInsert = {}) => {
    const dateNow = getDateTimeNow();

    let data = {
        ...dataToInsert,
        created_at: dateNow,
        updated_at: dateNow,
    }

    const result = await processCreatingData(data, 'Products');

    return result;
}

export const update = async (dataToUpdate = {}, id = '') => {
    const dateNow = getDateTimeNow();

    let data = {
        ...dataToUpdate,
        updated_at: dateNow,
    }

    const result = await processUpdatingData(data, id, 'Products');

    return result;
}

export const deleteProduct = async (id) => {
    await processRemovingData({ id }, 'Products');
}

export const createDataAndImages = async (product = {}, images = []) => {
    const connection = await createDatabaseConnection();
    await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

    await connection.beginTransaction();

    try {
        const dateNow = getDateTimeNow();

        let dataToInsert = {
            ...product,
            created_at: dateNow,
            updated_at: dateNow,
        }

        const productId = await processCreatingData(dataToInsert, 'Products', connection);

        dataToInsert = images.map(x => ({
            tablename: 'Products',
            filename: x,
            id_reference: productId,
            created_at: dateNow,
            updated_at: dateNow,
        }));
    
        await processMassCreatingData(dataToInsert, 'Files', connection);

        await connection.commit();

        return productId;
    } catch (e) {
        connection.rollback();
        throw e;
    }
}