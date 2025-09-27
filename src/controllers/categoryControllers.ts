import { Request, Response } from "express";
import { CategoryInputZSchema, CategoryModel, TSuccess } from "../models";
import { resultMessage } from "../lib/utility";

export const getAllCategories = async (req: Request, res: Response) => {
    const categories = await CategoryModel.find().populate('parentCategory')
    res.json(categories)
}

export const addNewCategory = async (req: Request, res: Response<TSuccess>) => {
    const result = CategoryInputZSchema.safeParse(req.body)
    if (!result.success) {
        res.status(400).json(resultMessage(false, result.error.message));
    } else {
        await CategoryModel.insertOne(result.data);
        res.status(201).json(resultMessage(true, 'Nuova Categoria aggiunta!'));
    }
}

