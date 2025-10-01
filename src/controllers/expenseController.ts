import { Request, Response } from "express";
import dayjs from "dayjs";
import { ExchangeRateModel, ExpenseInputZSchema, ExpenseModel, TSuccess } from "../models";
import { round } from "../lib/utility";

export const getExpenses = async (req: Request, res: Response) => {
    const expenses = await ExpenseModel.find().populate('category');
    res.status(201).json(expenses)
};

export const addNewExpense = async (req: Request, res: Response<TSuccess>) => {
    const result = ExpenseInputZSchema.parse(req.body);

    const expenseDate = dayjs(result.expenseDate || new Date());
    const queryDate = expenseDate.format('YYYY-MM-DD') + 'T23:59:59Z';
    const exchangeRate = await ExchangeRateModel.findOne({
        'meta.last_updated_at': {
            $lte: queryDate
        }
    }).sort({ 'meta.last_updated_at': -1 });

    if (!exchangeRate) {
        throw new Error('Tassi di cambio non disponibili per la data specificata!')
    };

    console.log(exchangeRate.meta)

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