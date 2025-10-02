import { Request, Response } from "express";
import { CategoryInputZSchema, CategoryModel, objectIdSchema, TSuccess, CategoryInputZSchemaForPatch } from "../models";

export const getAllCategories = async (req: Request, res: Response) => {
    const categories = await CategoryModel.find().populate({
        path: 'parentCategory',
        select: 'name type'
    })
    res.status(201).json(categories)
}

export const getCategoryById = async (req: Request, res: Response) => {
    const categoryId = objectIdSchema.parse(req.params.id);
    const category = await CategoryModel.findById(categoryId);
    res.status(201).json(category);
}

export const addNewCategory = async (req: Request, res: Response<TSuccess>) => {
    const result = CategoryInputZSchema.parse(req.body)
    await CategoryModel.insertOne(result);
    res.status(201).json({ success: true, message: 'Nuova Categoria aggiunta!' });
}

export const deleteCategory = async (req: Request, res: Response<TSuccess>) => {
    const categoryId = objectIdSchema.parse(req.params.id);
    const opereationResult = await CategoryModel.deleteOne({ _id: categoryId });
    if (opereationResult.deletedCount === 0) throw new Error('Impossibile eliminare la categoria non esiste!');
    res.status(201).json({ success: true, message: 'Categoria Eliminata con successo!' });
}

export const modifyCategory = async (req: Request, res: Response<TSuccess>) => {
    const categoryId = objectIdSchema.parse(req.params.id);
    const updates = CategoryInputZSchemaForPatch.parse(req.body);
    const opereationResult = await CategoryModel.findByIdAndUpdate(
        categoryId,
        updates,
        { new: true, runValidators: true }
    );
    if (!opereationResult) throw new Error(`Impossibile modificare la categoria non esiste!`);
    res.status(201).json({ success: true, message: 'Categoria modificata con successo!' })
}