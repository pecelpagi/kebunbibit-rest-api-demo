import * as CartModel from '../models/Cart';
import * as ProductModel from '../models/Product';
import * as FileModel from '../models/File';
import { reformatDateTime } from '../utils';

export const getProduct = async ({ customerId, productId }) => {
    const data = await CartModel.findOneBy({
        'customer_id': customerId,
        'product_id': productId,
    });

    return data;
}

export const getProducts = async (customerId) => {
    const products = await CartModel.getProducts(customerId);
    const productIds = products.map(x => (x.id));
    const images = await FileModel.findProductImagesByIds(productIds);

    const reformatData = products.map((x) => {
        const imageData = images.find(img => (String(img.id_reference) === String(x.id)));
        const newProduct = {
            ...x,
            price: Number(x.price),
            qty: Number(x.qty),
            thumbnail_image: imageData ? imageData.filename : '',
            created_at: reformatDateTime(x.created_at),
            updated_at: reformatDateTime(x.updated_at),
        };

        delete newProduct.description;

        return newProduct;
    });

    return reformatData;
}

export const addToCart = async ({ productId, customerId, qty }) => {
    const product = await ProductModel.findOneBy({ id: productId });

    if (!product) throw new Error("Produk tidak ditemukan");

    const cartProduct = await getProduct({ customerId, productId });
    const isProductExist = !!cartProduct;

    if (!isProductExist) { await CartModel.create({ customer_id: customerId, product_id: productId, qty }); }
    if (isProductExist) {
        const newQty = Number(cartProduct.qty) + Number(qty);
        await CartModel.updateQty({ productId, customerId, qty: newQty });
    }

    const addedProduct = await ProductModel.findOneBy({ id: productId });
    const totalCustomerCartProduct = await CartModel.getTotalCustomerCartProduct(customerId);

    return { product: addedProduct, totalCustomerCartProduct };
}

export const updateQty = async ({ productId, customerId, qty }) => {
    const product = await ProductModel.findOneBy({ id: productId });

    if (!product) throw new Error("Produk tidak ditemukan");

    const cartProduct = await getProduct({ customerId, productId });
    const isProductExist = !!cartProduct;

    if (!isProductExist) throw new Error("Produk tidak ditemukan di keranjang belanja");
    if (isProductExist) { await CartModel.updateQty({ productId, customerId, qty }); }

    const updatedProduct = await ProductModel.findOneBy({ id: productId });
    const totalCustomerCartProduct = await CartModel.getTotalCustomerCartProduct(customerId);

    return { product: updatedProduct, totalCustomerCartProduct };
}

export const deleteProduct = async ({ customerId, productId }) => {
    const product = await ProductModel.findOneBy({ id: productId });

    if (!product) throw new Error("Produk tidak ditemukan");

    const cartProduct = await getProduct({ customerId, productId });
    const isProductExist = !!cartProduct;

    if (!isProductExist) throw new Error("Produk tidak ditemukan di keranjang belanja");
    if (isProductExist) { await CartModel.deleteProduct({ customerId, productId }); }

    const totalCustomerCartProduct = await CartModel.getTotalCustomerCartProduct(customerId);

    return { product, totalCustomerCartProduct };
}

export const getTotalCustomerCartProduct = async (customerId) => await CartModel.getTotalCustomerCartProduct(customerId);
