import * as CategoryModel from '../models/Category';
import { reformatDateTime, slugify } from '../utils';

const getTotalPages = async ({ search, limit }) => {
    if (!limit) return 1;

    const totalData = await CategoryModel.getTotalData(search);
    const totalPages = Math.ceil(totalData / limit);

    return totalPages;
}

export const getTotalData = async () => await CategoryModel.getTotalData();

export const createListCategories = async ({ limit = 0, page = 1, search }) => {
    const offset = limit * (page - 1);
    const categories = await CategoryModel.findAll(limit, offset, search);

    const pageCount = await getTotalPages({ search, limit });
    const totalData = await CategoryModel.getTotalData(search);

    const reformatData = categories.map((x) => ({
        ...x,
        created_at: reformatDateTime(x.created_at),
        updated_at: reformatDateTime(x.updated_at),
    }));

    return {
        data: reformatData,
        pageCount,
        totalData,
    };
}

export const findById = async (id) => {
    const data = await CategoryModel.findOneBy({ id });

    if (!data) return null;

    return data;
}

export const findBySlug = async (slug) => {
    const data = await CategoryModel.findOneBy({ slug });

    if (!data) return null;

    const reformatData = {
        ...data,
        created_at: reformatDateTime(data.created_at),
        updated_at: reformatDateTime(data.updated_at),
    }

    return reformatData;
}

export const create = async (name) => {
    const lastInsertId = await CategoryModel.create({
        name,
        slug: slugify(name),
        is_active: 1
    });

    const addedData = await CategoryModel.findOneBy({ id: lastInsertId });
    const totalData = await CategoryModel.getTotalData();

    return { addedData, totalData };
}

export const update = async (name, id) => {
    let category = await CategoryModel.findOneBy({ id });

    if (!category) throw new Error("Data tidak ditemukan");

    await CategoryModel.update({
        name,
        slug: slugify(name),
    }, id);

    category = await CategoryModel.findOneBy({ id });

    const totalData = await CategoryModel.getTotalData();

    return { updatedData: category, totalData };
}

export const deleteCategory = async (id) => {
    const category = await CategoryModel.findOneBy({ id });

    if (!category) throw new Error("Data tidak ditemukan");

    await CategoryModel.deleteCategory(id);

    const totalData = await CategoryModel.getTotalData();

    return { removedData: category, totalData };
}