import * as fileService from '../services/FileService';
import * as productService from '../services/ProductService';
import * as categoryService from '../services/CategoryService';
import * as productValidator from '../validator/ProductValidator';
import { getCustomerIdFromToken, getEmployeeIdFromToken, getTokenFromRequest } from '../utils';

export const listProducts = async (req, res) => {
    try {
        const payload = {
            limit: req.query.limit ? +req.query.limit : 0,
            page: req.query.page ? +req.query.page : 1,
            search: req.query.search ? req.query.search : '',
            categoryId: req.query.category_id ? req.query.category_id : '',
        }

        let data = [],
            pageCount = 0;

        ({ data, pageCount } = await productService.createListProducts(payload));

        res.status(200).json({
            status: true, 
            data,
            meta: {
                current_page: payload.page,
                page_count: pageCount
            },
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

export const getProduct = async (req, res) => {
    try {
        const withToken = !!getTokenFromRequest(req);
        let customerId = false;

        if (withToken) customerId = getCustomerIdFromToken(req);
        
        const { id } = req.params;
        const { product, isFavorited } = await productService.getProductDetail(id, customerId);

        const category = await categoryService.findById(product.id_category);

        let images = await fileService.findProductImagesByIds([id]);
        images = images.map(x => (x.filename))

        res.status(200).json({
            status: true, 
            data: { ...product, category, is_favorited: isFavorited, images },
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

export const create = async (req, res) => {
    try {
        const employeeId = getEmployeeIdFromToken(req);

        await productValidator.forSavingData(req.body, 'create');

        const { addedData, totalData } = await productService.create(req.body);

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

export const deleteProduct = async (req, res) => {
    try {
        const employeeId = getEmployeeIdFromToken(req);

        await productValidator.requireID(req.body);

        const { id } = req.body;

        const { removedData, totalData } = await productService.deleteProduct(id);

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