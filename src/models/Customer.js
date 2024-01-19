import { processFindingOneDataBy } from './utils';

export const findOneBy = async (filteredBy = {}) => {
    const result = await processFindingOneDataBy(filteredBy, 'Customers');

    return result;
}
