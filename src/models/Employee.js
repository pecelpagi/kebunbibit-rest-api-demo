import { processFindingOneDataBy } from './utils';

export const findOneBy = async (filteredBy = {}) => {
    const result = await processFindingOneDataBy(filteredBy = {}, 'Employees');

    return result
}