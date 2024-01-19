import * as FileModel from '../models/File';

export const findProductImagesByIds = async (productIds) => {
    const data = await FileModel.findProductImagesByIds(productIds);

    return data;
}

export const createProductImages = async (images, productId) => {
    if (!images) return;
    if (images.length === 0) return;

    const files = images.map(x => ({ tablename: 'Products', filename: x, id_reference: productId }));
    await FileModel.bulkCreate(files);
}