import * as ProductModel from '../models/Product';
import * as WishlistModel from '../models/Wishlist';
import * as FileModel from '../models/File';
import { reformatDateTime, slugify } from '../utils';

export const createListProducts = async ({ limit = 0, page = 1, search = '', categoryId = '' }) => {
    const offset = limit * (page - 1);
    const products = await ProductModel.findAll(limit, offset, search, categoryId);
    const productIds = products.map(x => (x.id));

    const totalData = await ProductModel.getTotalData(search, categoryId);

    const images = await FileModel.findProductImagesByIds(productIds);

    const reformatData = products.map((x) => {
        const imageData = images.find(img => (String(img.id_reference) === String(x.id)));

        return {
            ...x,
            price: Number(x.price),
            thumbnail_image: imageData ? imageData.filename : '',
            created_at: reformatDateTime(x.created_at),
            updated_at: reformatDateTime(x.updated_at),
        };
    });

    return {
        data: reformatData,
        pageCount: limit ? Math.ceil(totalData / limit) : 1,
     };
}

export const getProductDetail = async (productId, customerId) => {
    const imageData = await FileModel.findOneBy({ tablename: 'Products', id_reference: productId });
    const product = await ProductModel.findOneBy({ id: productId });

    let isFavorited = false;

    if (customerId) {
        const customerWishlist = await WishlistModel.findOneBy({ customer_id: customerId, product_id: productId });
        isFavorited = !!customerWishlist;
    }

    const formattedProduct = {
        ...product,
        price: Number(product.price),
        thumbnail_image: imageData ? imageData.filename : '',
    }

    return {
        product: formattedProduct,
        isFavorited,
    }
}

export const create = async (data) => {
    const { 
        id_category: categoryId, name,
        price, description, images: rawImages
    } = data;
    const productToInsert = {
        id_category: categoryId,
        name,
        slug: slugify(name),
        price,
        description,
        is_active: 1
    }

    let images = [];

    if (rawImages) images = JSON.parse(rawImages);

    const lastInsertId = await ProductModel.createDataAndImages(productToInsert, images);

    const addedData = await ProductModel.findOneBy({ id: lastInsertId });
    const totalData = await ProductModel.getTotalData();

    return {
        addedData: {
            ...addedData,
            price: Number(addedData.price),
            created_at: reformatDateTime(addedData.created_at),
            updated_at: reformatDateTime(addedData.updated_at),
        },
        totalData
    };
}

export const deleteProduct = async (id) => {
    const product = await ProductModel.findOneBy({ id });

    if (!product) throw new Error("Data tidak ditemukan");

    await ProductModel.deleteProduct(id);
    await FileModel.deleteByReference({ referenceId: id, tableName: 'Products' });

    const totalData = await ProductModel.getTotalData();

    return { removedData: product, totalData };
}