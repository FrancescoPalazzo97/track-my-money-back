import { Request, Response } from "express";
import { ExpenseInputZSchema, ExpenseModel } from "../models";
import { resultMessage } from "../lib/utility";
import { Types } from "mongoose";

export const addNewExpense = async (req: Request, res: Response) => {
    const result = ExpenseInputZSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json(resultMessage(false, result.error.message));
    } else {
        const categoryObjectId = new Types.ObjectId(result.data.category);
        await ExpenseModel.insertOne({ ...result.data, category: categoryObjectId });
        res.status(201).json(resultMessage(true, 'Spesa aggiunta!'))
    }
}