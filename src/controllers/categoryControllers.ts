import { Request, Response } from "express";
import { CategoryInputZSchema, objectIdZSchema, TSuccess, CategoryInputZSchemaForPatch, TCategoryLean } from "../types";
import { CategoryModel } from "../models";
import { getCategoriesWitTransactions, getSubCategories, validateNewCategory } from "../lib";;

export const getAllCategories = async (req: Request, res: Response) => {
    const group = req.query.group === 'true';
    const withTransactions = req.query.withTransactions === 'true';

    const categories: TCategoryLean[] = await CategoryModel.find().lean();

    if (group && withTransactions) {
        const categoriesWithTransactions = await getCategoriesWitTransactions(categories);
        const mainCategories = categoriesWithTransactions.filter(cat => !cat.parentCategory);
        const filteredCategories = mainCategories.map(mainCat => ({
            ...mainCat,
            subCategories: getSubCategories(categoriesWithTransactions, mainCat)
        }));
        res.status(200).json(filteredCategories);
    } else if (group) {
        const mainCategories = categories.filter(cat => !cat.parentCategory);
        const filteredCategories = mainCategories.map(mainCat => ({
            ...mainCat,
            subCategories: getSubCategories(categories, mainCat)
        }));
        res.status(200).json(filteredCategories);
    } else if (withTransactions) {
        const categoriesWithTransactions = await getCategoriesWitTransactions(categories);
        res.status(200).json(categoriesWithTransactions);
    } else {
        res.status(200).json(categories);
    }
}

export const getCategoryById = async (req: Request, res: Response) => {
    const categoryId = objectIdZSchema.parse(req.params.id);
    const category = await CategoryModel.findById(categoryId);
    res.status(201).json(category);
};

export const addNewCategory = async (req: Request, res: Response<TSuccess>) => {
    const result = CategoryInputZSchema.parse(req.body);

    await validateNewCategory(result);

    await CategoryModel.insertOne(result);
    res.status(201).json({ success: true, message: 'Nuova Categoria aggiunta!' });
}

export const deleteCategory = async (req: Request, res: Response<TSuccess>) => {
    const categoryId = objectIdZSchema.parse(req.params.id);
    const opereationResult = await CategoryModel.deleteOne({ _id: categoryId });
    await CategoryModel.updateMany(
        { parentCategory: categoryId },
        { $unset: { parentCategory: "" } }
    )
    if (opereationResult.deletedCount === 0) throw new Error('Impossibile eliminare la categoria non esiste!');
    res.status(201).json({ success: true, message: 'Categoria Eliminata con successo!' });
}

export const modifyCategory = async (req: Request, res: Response<TSuccess>) => {
    const categoryId = objectIdZSchema.parse(req.params.id);
    const updates = CategoryInputZSchemaForPatch.parse(req.body);
    const opereationResult = await CategoryModel.findByIdAndUpdate(
        categoryId,
        updates,
        { new: true, runValidators: true }
    );
    if (!opereationResult) throw new Error(`Impossibile modificare la categoria non esiste!`);
    res.status(201).json({ success: true, message: 'Categoria modificata con successo!' })
}