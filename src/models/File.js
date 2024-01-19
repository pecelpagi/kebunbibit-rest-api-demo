import { createDatabaseConnection, getDateTimeNow, processFindingOneDataBy, processMassCreatingData, processRemovingData } from './utils';

export const findOneBy = async (filteredBy = {}) => {
    const result = await processFindingOneDataBy(filteredBy, 'Files');

    return result;
}

export const findProductImagesByIds = async (productIds = []) => {
    if (productIds.length === 0) return [];

    const ids = productIds.toString();

    const queryString = `
        SELECT * FROM Files WHERE id_reference IN (${ids}) AND tablename = 'Products'
    `;

    const connection = await createDatabaseConnection();
    const [rows] = await connection.query(queryString, []);

    return rows;
}

export const bulkCreate = async (dataToCreate = []) => {
    const dateNow = getDateTimeNow();

    const reformatDataToCreate = dataToCreate.map(x => ({
        ...x,
        created_at: dateNow,
        updated_at: dateNow,
    }));

    const result = await processMassCreatingData(reformatDataToCreate, 'Files');

    return result;
}

export const deleteByReference = async ({ referenceId, tableName }) => {
    await processRemovingData({ 'id_reference': referenceId, 'tablename': tableName }, 'Files');
}