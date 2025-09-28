import { Request, Response } from "express";
import { CategoryInputZSchema, CategoryModel, TSuccess } from "../models";

export const getAllCategories = async (req: Request, res: Response) => {
    const categories = await CategoryModel.find().populate('parentCategory')
    res.json(categories)
}

export const addNewCategory = async (req: Request, res: Response<TSuccess>) => {
    const result = CategoryInputZSchema.parse(req.body)
    await CategoryModel.insertOne(result);
    res.status(201).json({ success: true, message: 'Nuova Categoria aggiunta!' });
}

