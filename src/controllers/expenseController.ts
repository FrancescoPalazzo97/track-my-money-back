import { Request, Response } from "express";
import dayjs from "dayjs";
import { ExchangeRateModel, ExpenseInputZSchema, ExpenseModel, TSuccess, objectIdSchema, ExpenseInputZSchemaForPatch } from "../models";
import { round } from "../lib/utility";

export const getExpenses = async (req: Request, res: Response) => {
    const expenses = await ExpenseModel.find().populate('category');
    res.status(201).json(expenses)
};

export const getExpensesById = async (req: Request, res: Response) => {
    const expenseId = objectIdSchema.parse(req.params.id);

    const expense = await ExpenseModel.findById(expenseId);

    res.status(201).json(expense);
};

export const addNewExpense = async (req: Request, res: Response<TSuccess>) => {
    const result = ExpenseInputZSchema.parse(req.body);

    const expenseDate = dayjs(result.expenseDate || new Date());
    const exchangeRate = await ExchangeRateModel.findOne({
        'meta.last_updated_at': {
            $lte: expenseDate.toDate()
        }
    }).sort({ 'meta.last_updated_at': -1 });

    if (!exchangeRate) {
        throw new Error('Tassi di cambio non disponibili per la data specificata!')
    };

    const euroData = exchangeRate.data.get("EUR");
    if (!euroData) {
        throw new Error('Tasso EUR non trovato!!');
    };

    if (result.currency === 'EUR') {
        result.convertedAmount = result.amount;
        result.exchangeRateSnapshot = 1;
    } else {
        const currencyData = exchangeRate.data.get(result.currency);
        if (!currencyData) {
            throw new Error(`Tasso di cambio per ${result.currency} non trovato!`);
        };
        const rateToEuro = euroData.value / currencyData.value;
        result.exchangeRateSnapshot = rateToEuro;
        result.convertedAmount = round(result.amount * rateToEuro, 2);
    }

    await ExpenseModel.insertOne(result);
    res.status(201).json({ success: true, message: 'Spesa aggiunta!' });
};

export const deleteExpense = async (req: Request, res: Response<TSuccess>) => {
    const expenseId = objectIdSchema.parse(req.params.id);

    await ExpenseModel.deleteOne({ _id: expenseId });

    res.status(200).json({ success: true, message: "Spesa eliminata con successo" });
};

export const modifyExpense = async (req: Request, res: Response<TSuccess>) => {
    const expenseId = objectIdSchema.parse(req.params.id);

    const updates = ExpenseInputZSchemaForPatch.parse(req.body);

    await ExpenseModel.findByIdAndUpdate(
        expenseId,
        updates,
        { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Spesa modificata con successo!" })
}