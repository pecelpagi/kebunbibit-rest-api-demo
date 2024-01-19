import * as categoryCache from '../cache/CategoryCache';
import * as categoryService from '../services/CategoryService';
import * as categoryValidator from '../validator/CategoryValidator';
import { getEmployeeIdFromToken } from '../utils';

export const listCategories = async (req, res) => {
    try {
        const payload = {
            limit: req.query.limit ? +req.query.limit : 0,
            page: req.query.page ? +req.query.page : 1,
            search: req.query.search ? req.query.search : '',
        }

        let data = [],
            totalData = 0,
            pageCount = 0;

        ({ data, pageCount, totalData } = await categoryService.createListCategories(payload));

        res.status(200).json({
            status: true,
            data,
            meta: {
                current_page: payload.page,
                page_count: pageCount,
                total_data: totalData,
            },
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

export const getCategoryBySlug = async (req, res) => {
    try {
        await categoryValidator.requireSlug(req.params);

        const { slug } = req.params;
        const { cachedData, isCached } = await categoryCache.getCategoryBySlug(slug);

        res.status(200).json({
            status: true,
            data: cachedData,
            meta: {
                from_cache: isCached,
            },
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

export const create = async (req, res) => {
    try {
        const employeeId = getEmployeeIdFromToken(req);

        await categoryValidator.forSavingData(req.body);

        const { name } = req.body;

        const { addedData, totalData } = await categoryService.create(name);

        await categoryCache.setCacheCategoryDataBySlug(addedData.slug, addedData);

        res.status(200).json({
            status: true,
            data: addedData,
            meta: {
                total_data: totalData,
                created_by: employeeId,
            },
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

export const update = async (req, res) => {
    try {
        const employeeId = getEmployeeIdFromToken(req);

        await categoryValidator.forSavingData(req.body, 'update');

        const { name, id } = req.body;

        const { updatedData, totalData } = await categoryService.update(name, id);

        await categoryCache.setCacheCategoryDataBySlug(updatedData.slug, updatedData);

        res.status(200).json({
            status: true,
            data: updatedData,
            meta: {
                total_data: totalData,
                updated_by: employeeId,
            },
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const employeeId = getEmployeeIdFromToken(req);

        await categoryValidator.requireID(req.body);

        const { id } = req.body;

        const { removedData, totalData } = await categoryService.deleteCategory(id);

        await categoryCache.removeCacheCategoryDataBySlug(removedData.slug);

        res.status(200).json({
            status: true,
            data: removedData,
            meta: {
                total_data: totalData,
                deleted_by: employeeId,
            },
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}