import {
    createDatabaseConnection, getDateTimeNow,
    processCreatingData, processFindingOneDataBy,
    processRemovingData, processUpdatingData
} from './utils';

export const findAll = async (limit = 0, offset = 0, search = '') => {
    const params = [];
    let queryString = `SELECT * FROM Categories`;

    if (search) {
        queryString = `${queryString} WHERE LOWER(CONCAT(name, slug)) LIKE LOWER(?)`;
        params.push(`%${search}%`);
    }

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

export const getTotalData = async (search) => {
    const params = [];
    let queryString = 'SELECT COUNT(*) AS total_data FROM Categories';

    if (search) {
        queryString = `${queryString} WHERE LOWER(CONCAT(name, slug)) LIKE LOWER(?)`;
        params.push(`%${search}%`);
    }

    const connection = await createDatabaseConnection();
    const [rows] = await connection.execute(queryString, params);

    const row = rows[0];

    return row.total_data;
}

export const findOneBy = async (filteredBy = {}) => {
    const result = await processFindingOneDataBy(filteredBy, 'Categories');

    return result;
}

export const create = async (dataToInsert = {}) => {
    const dateNow = getDateTimeNow();

    let data = {
        ...dataToInsert,
        created_at: dateNow,
        updated_at: dateNow,
    }

    const result = await processCreatingData(data, 'Categories');

    return result;
}

export const update = async (dataToUpdate = {}, id = '') => {
    const dateNow = getDateTimeNow();

    const data = {
        ...dataToUpdate,
        updated_at: dateNow,
    }

   await processUpdatingData(data, { id }, 'Categories');
}

export const deleteCategory = async (id) => {
    await processRemovingData({ id }, 'Categories');
}