import dayjs from "dayjs";
import { ExchangeRateModel, ExpenseDocument, TCodes, TGetExpense } from "../models";
import { HydratedDocument, FlattenMaps } from "mongoose";

export function round(num: number, decimali: number) {
    return Math.round(num * Math.pow(10, decimali)) / Math.pow(10, decimali);
};

export function validateDate(startDate: string, endDate: string) {
    const [start, end] = [dayjs(startDate), dayjs(endDate)];
    if (!start.isValid() || start.isAfter(end)) {
        throw new Error('Data di inizio non valida!');
    };
    if (!end.isValid()) {
        throw new Error('Data di fine non valida!');
    };
    return [new Date(startDate), new Date(endDate)];
};

type TExpense = (FlattenMaps<ExpenseDocument> & { _id: any, __v: number });

export async function convertExpense(expense: TExpense, baseCurrency: TCodes): Promise<TGetExpense> {
    const newExpense = { ...expense, amountInEUR: expense.amount };
    if (expense.currency !== "EUR") {
        const exchangeRate = await ExchangeRateModel.findOne({
            'meta.last_updated_at': {
                $lte: expense.expenseDate
            }
        }).sort({ 'meta.last_updated_at': -1 });

        if (!exchangeRate) {
            throw new Error(`Exchange rate per la data ${dayjs(expense.expenseDate).format('DD-MM-YYYY')} non trovato`)
        };

        const currencyData = exchangeRate.data.get(baseCurrency)
            ?? (() => { throw new Error(`La valuta ${baseCurrency} non è stata trovata!`) })();
        const expenseCurrencyData = exchangeRate.data.get(expense.currency)
            ?? (() => { throw new Error(`La valuta ${expense.currency} non è stata trovata!`) })();

        const amountInEUR = round((expense.amount / expenseCurrencyData.value) * currencyData.value, 2);
        newExpense.amountInEUR = amountInEUR;
    };
    return newExpense;
};