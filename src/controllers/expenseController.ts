import { Request, Response } from "express";
import { ExpenseInputZSchema, ExpenseModel, TResponse } from "../models";

export const addNewExpense = async (req: Request, res: Response<TResponse>) => {
    const result = ExpenseInputZSchema.parse(req.body);
    await ExpenseModel.insertOne(result);
    res.status(201).json({ success: true, message: 'Spesa aggiunta!' });
}