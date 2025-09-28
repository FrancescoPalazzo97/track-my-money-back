import { Request, Response } from "express";
import { ExpenseInputZSchema, ExpenseModel, TSuccess } from "../models";

export const getExpenses = async (req: Request, res: Response) => {
    const expenses = await ExpenseModel.find().populate('category');
    res.status(201).json(expenses)
};

export const addNewExpense = async (req: Request, res: Response<TSuccess>) => {
    const result = ExpenseInputZSchema.parse(req.body);
    await ExpenseModel.insertOne(result);
    res.status(201).json({ success: true, message: 'Spesa aggiunta!' });
};