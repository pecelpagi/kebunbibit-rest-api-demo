import moment from 'moment';
import * as Db from "../../db";

export const getDateTimeNow = () => moment().format("YYYY-MM-DD HH:mm:ss");

export const createDatabaseConnection = async () => {
    const connection = await Db.getConnection();

    return connection;
};

export const createInsertQuery = (dataToInsert = {}, tableName = '') => {
    let columns = [];
    let preparedStatements = [];
    let values = [];

    Object.keys(dataToInsert).map((key) => {
        columns = [...columns, key];
        preparedStatements = [...preparedStatements, '?'];
        values = [...values, dataToInsert[key]];

        return key;
    });

    const queryString = `
        INSERT INTO ${tableName} (${columns.join(',')}) 
        VALUES (${preparedStatements.join(',')})
    `;

    return { queryString, values };
}

export const processCreatingData = async (dataToInsert = {}, tableName = '', parentConnection = null) => {
    const { queryString, values } = createInsertQuery(dataToInsert, tableName);

    let connection = parentConnection;

    if (!parentConnection) connection = await createDatabaseConnection();

    const [row] = await connection.execute(queryString, values);

    return row.insertId;
}

export const createMassInsertQuery = (dataToCreate, tableName) => {
    let columns = [];
    let preparedStatements = [];
    let values = [];

    const keyAndValues = dataToCreate[0];

    Object.keys(keyAndValues).map((key) => {
        columns = [...columns, key];

        return key;
    });

    dataToCreate.map((x) => {
        let rowKeyValues = [];

        Object.keys(x).map((key) => {
            rowKeyValues = [...rowKeyValues, x[key]];

            return key;
        });

        preparedStatements = [...preparedStatements, `(?)`];
        values = [...values, rowKeyValues];

        return x;
    })

    const queryColumns = columns.join(', ');
    const queryValues = preparedStatements.join(', ');
    const queryString = `
        INSERT INTO ${tableName} (${queryColumns}) 
        VALUES ${queryValues}
    `;

    return { queryString, values };
}

export const processMassCreatingData = async (dataToCreate = [], tableName = '', parentConnection = null) => {
    const { queryString, values } = createMassInsertQuery(dataToCreate, tableName);
    console.log(queryString);
    let connection = parentConnection;

    if (!parentConnection) connection = await createDatabaseConnection();

    await connection.query(queryString, values);
}

export const createUpdateQuery = (dataToUpdate, filteredBy, tableName) => {
    let preparedStatements = [];
    let values = [];

    Object.keys(dataToUpdate).map((key) => {
        preparedStatements = [...preparedStatements, `${key} = ? `];
        values = [...values, dataToUpdate[key]];

        return key;
    });

    let queryString = `
        UPDATE ${tableName} SET ${preparedStatements.join(',')}
    `;

    Object.keys(filteredBy).map((key, index) => {
        const newValue = filteredBy[key];
        values = [...values, newValue];

        if (index === 0) queryString = `${queryString} WHERE ${key} = ?`;
        if (index > 0) queryString = `${queryString} AND ${key} = ?`;

        return key;
    });

    return { queryString, values };
}

export const processUpdatingData = async (dataToUpdate = {}, filteredBy = {}, tableName = '', parentConnection = null) => {
    const { queryString, values } = createUpdateQuery(dataToUpdate, filteredBy, tableName);

    let connection = parentConnection;

    if (!parentConnection) connection = await createDatabaseConnection();

    await connection.execute(queryString, values);
}

export const createDeleteQuery = (filteredBy = {}, tableName = '') => {
    let values = [];
    let queryString = `DELETE FROM ${tableName}`;

    Object.keys(filteredBy).map((key, index) => {
        const newValue = filteredBy[key];
        values = [...values, newValue];

        if (index === 0) queryString = `${queryString} WHERE ${key} = ?`;
        if (index > 0) queryString = `${queryString} AND ${key} = ?`;

        return key;
    });

    return { queryString, values };
}

export const processRemovingData = async (filteredBy = {}, tableName = '', parentConnection = null) => {
    const { queryString, values } = createDeleteQuery(filteredBy, tableName);

    let connection = parentConnection;

    if (!parentConnection) connection = await createDatabaseConnection();

    await connection.execute(queryString, values);
}

export const createSelectQuery = (filteredBy, tableName) => {
    let values = [];
    let queryString = `
        SELECT * FROM ${tableName}
    `;

    Object.keys(filteredBy).map((key, index) => {
        const newValue = filteredBy[key];
        values = [...values, newValue];

        if (index === 0) queryString = `${queryString} WHERE ${key} = ?`;
        if (index > 0) queryString = `${queryString} AND ${key} = ?`;

        return key;
    });

    return { queryString, values };
}

export const processFindingDataBy = async (filteredBy = {}, tableName = '', parentConnection = null) => {
    const { queryString, values } = createSelectQuery(filteredBy, tableName);

    let connection = parentConnection;

    if (!parentConnection) connection = await createDatabaseConnection();

    const [rows] = await connection.execute(queryString, values);

    return rows;
}

export const processFindingOneDataBy = async (filteredBy = {}, tableName = '', parentConnection = null) => {
    const { queryString: rawQueryString, values } = createSelectQuery(filteredBy, tableName);

    const queryString = `${rawQueryString} LIMIT 1`;

    let connection = parentConnection;

    if (!parentConnection) connection = await createDatabaseConnection();

    const [rows] = await connection.execute(queryString, values);

    return rows[0];
}
