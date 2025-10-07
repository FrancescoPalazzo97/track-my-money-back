import { Request, Response } from "express";
import { CategoryInputZSchema, objectIdZSchema, TSuccess, CategoryInputZSchemaForPatch, CategoryLean } from "../types";
import { CategoryModel } from "../models";
import { validateNewCategory } from "../lib";

export const getAllCategories = async (req: Request, res: Response) => {
    const group = req.query.group === 'true';
    if (group) {
        const categories: CategoryLean[] = await CategoryModel.find().lean();
        const mainCategories = categories.filter(cat => !cat.parentCategory);

        const getSubCategories = (category: CategoryLean): CategoryLean[] => {
            return categories
                .filter(subCat =>
                    subCat.parentCategory?.toString() === category._id.toString()
                )
                .map(subCat => ({
                    ...subCat,
                    subCategories: getSubCategories(subCat)
                }));
        };

        const filteredCategories = mainCategories.map(mainCat => ({
            ...mainCat,
            subCategories: getSubCategories(mainCat)
        }));

        res.status(200).json(filteredCategories);
    } else {
        const categories = await CategoryModel.find();
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