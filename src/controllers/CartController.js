import * as cartService from '../services/CartService';
import * as cartCache from '../cache/CartCache';
import * as cartValidator from '../validator/CartValidator';
import { getCustomerIdFromToken } from '../utils';

export const getProducts = async (req, res) => {
    try {
        const customerId = getCustomerIdFromToken(req);

        const { cachedData, isCached, totalData } = await cartCache.getProducts(customerId);

        res.status(200).json({
            status: true,
            data: cachedData,
            meta: {
                total_data: totalData,
                from_cache: isCached,
            },
            message: 'OK'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: err.message });
    }
}

const handleUpdateCacheCartData = async (customerId) => {
    const cartData = await cartService.getProducts(customerId);
    await cartCache.setCacheCustomerCartData(customerId, cartData);
}

export const addToCart = async (req, res) => {
    try {
        const customerId = getCustomerIdFromToken(req);

        await cartValidator.forSavingData(req.body);

        let payload = {
            customerId,
            productId: req.body.product_id,
            qty: req.body.qty,
        };

        const { product, totalCustomerCartProduct } = await cartService.addToCart(payload);

        await cartCache.setCacheTotalCustomerCartData(customerId, totalCustomerCartProduct);

        await handleUpdateCacheCartData(customerId);

        res.status(200).json({
            status: true,
            data: product,
            meta: {
                total_customer_cart_product: totalCustomerCartProduct,
            },
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}

export const updateQty = async (req, res) => {
    try {
        const customerId = getCustomerIdFromToken(req);

        await cartValidator.forSavingData(req.body);

        const payload = {
            customerId,
            productId: req.body.product_id,
            qty: req.body.qty,
        };

        const { product, totalCustomerCartProduct } = await cartService.updateQty(payload);

        await cartCache.setCacheTotalCustomerCartData(customerId, totalCustomerCartProduct);

        await handleUpdateCacheCartData(customerId);

        res.status(200).json({
            status: true,
            data: product,
            meta: {
                total_customer_cart_product: totalCustomerCartProduct,
            },
            message: 'OK'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: err.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const customerId = getCustomerIdFromToken(req);

        await cartValidator.requireProductID(req.body);

        const payload = {
            customerId,
            productId: req.body.product_id,
        };

        const { product, totalCustomerCartProduct } = await cartService.deleteProduct(payload);

        await cartCache.setCacheTotalCustomerCartData(customerId, totalCustomerCartProduct);

        await handleUpdateCacheCartData(customerId);

        res.status(200).json({
            status: true,
            data: product,
            meta: {
                total_customer_cart_product: totalCustomerCartProduct,
            },
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}