import { Request, Response } from "express";
import {
    ExpenseInputZSchema,
    ExpenseModel,
    TSuccess,
    objectIdSchema,
    ExpenseInputZSchemaForPatch,
    GetExpensesQueryZSchema,
    TGetExpense
} from "../models";
import { convertExpense, validateDate } from "../lib/utility";

export const getExpenses = async (req: Request, res: Response) => {
    const { startDate, endDate, baseCurrency = 'EUR' } = GetExpensesQueryZSchema.parse(req.query);
    const [start, end] = validateDate(startDate, endDate);
    const expenses = await ExpenseModel.find({
        expenseDate: {
            $gte: start,
            $lte: end
        }
    }).populate('category', '_id').lean();
    let convertedExpenses: TGetExpense[] = [];
    for (const exp of expenses) {
        const convertedExpense = await convertExpense(exp, baseCurrency);
        convertedExpenses.push(convertedExpense)
    }
    res.status(201).json(convertedExpenses);
};

const CurrencySchema = GetExpensesQueryZSchema.omit({ startDate: true, endDate: true })

export const getExpensesById = async (req: Request, res: Response) => {
    const expenseId = objectIdSchema.parse(req.params.id);
    const { baseCurrency = "EUR" } = CurrencySchema.parse(req.query);
    const expense = await ExpenseModel.findById(expenseId).lean();
    if (!expense) {
        throw new Error(`Spesa con ID: ${expenseId} non trovata!`);
    };
    const convertedExpense: TGetExpense = await convertExpense(expense, baseCurrency)
    res.status(201).json(convertedExpense);
};

export const addNewExpense = async (req: Request, res: Response<TSuccess>) => {
    const result = ExpenseInputZSchema.parse(req.body);
    await ExpenseModel.insertOne(result);
    res.status(201).json({ success: true, message: 'Spesa aggiunta!' });
};

export const deleteExpense = async (req: Request, res: Response<TSuccess>) => {
    const expenseId = objectIdSchema.parse(req.params.id);
    const opereationResult = await ExpenseModel.deleteOne({ _id: expenseId });
    if (opereationResult.deletedCount === 0) throw new Error('Impossibile eliminare la spesa non è stata trovata!');
    res.status(200).json({ success: true, message: "Spesa eliminata con successo" });
};

export const modifyExpense = async (req: Request, res: Response<TSuccess>) => {
    const expenseId = objectIdSchema.parse(req.params.id);
    const updates = ExpenseInputZSchemaForPatch.parse(req.body);
    const opereationResult = await ExpenseModel.findByIdAndUpdate(
        expenseId,
        updates,
        { new: true, runValidators: true }
    );
    if (!opereationResult) throw new Error('Impossibile modificare la spesa non è stata trovata!');
    res.status(200).json({ success: true, message: "Spesa modificata con successo!" })
}