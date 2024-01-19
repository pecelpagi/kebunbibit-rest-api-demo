import * as WishlistModel from '../models/Wishlist';
import * as FileModel from '../models/File';
import { reformatDateTime } from '../utils';

export const toggleData = async (data) => {
    const product = await WishlistModel.findOneBy(data);
    const added = !!product;

    if (added) {
        await WishlistModel.deleteData(data);
        return 'REMOVED';
    }

    await WishlistModel.create(data);

    return 'ADDED';
}

export const getTotalData = async (customerId) => {
    const totalData = await WishlistModel.getTotalCustomerWishlistProduct(customerId);

    return totalData;
}

export const deleteData = async (id) => { await WishlistModel.deleteData(id); }

export const getProducts = async (customerId) => {
    const products = await WishlistModel.getProducts(customerId);
    const productIds = products.map(x => (x.id));
    const images = await FileModel.findProductImagesByIds(productIds);

    const reformatData = products.map((x) => {
        const imageData = images.find(img => (String(img.id_reference) === String(x.id)));
        const newProduct = {
            ...x,
            price: Number(x.price),
            thumbnail_image: imageData ? imageData.filename : '',
            created_at: reformatDateTime(x.created_at),
            updated_at: reformatDateTime(x.updated_at),
        };

        delete newProduct.description;

        return newProduct;
    });

    return reformatData;
}
