import { createDatabaseConnection } from "./utils";

export const findAllByCustomerId = async (customerId, search = '') => {
    let queryString = `
        SELECT sa.id, sa.customer_id, sa.province_id, p.name AS province_name, 
        sa.city_id, r.name AS city_name,
        sa.subdistrict_id, d.name AS subdistrict_name,
        sa.village_id, v.name AS village_name,
        sa.postal_code, sa.address, sa.address_label, sa.receiver_name, sa.phone, sa.is_default
        FROM ShippingAddresses sa 
        JOIN db_region.provinces p ON p.id = sa.province_id
        JOIN db_region.regencies r ON r.id = sa.city_id
        JOIN db_region.districts d ON d.id = sa.subdistrict_id
        JOIN db_region.villages v ON v.id = sa.village_id
    `;

    const filters = ['sa.customer_id = ?'];
    let params = [customerId];

    if (search) {
        filters.push('LOWER(CONCAT(sa.receiver_name, sa.address_label, sa.phone, sa.address, r.name)) LIKE LOWER(?)');
        params = [...params, `%${search}%`];
    }

    filters.map((x, i) => {
        if (i === 0) queryString = `${queryString} WHERE ${x}`;
        if (i > 0) queryString = `${queryString} AND ${x}`;

        return x;
    });

    queryString = `${queryString} ORDER BY is_default DESC`;

    const connection = await createDatabaseConnection();
    const [results] = await connection.execute(queryString, params);

    return results;
}