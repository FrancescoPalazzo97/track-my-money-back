import dayjs from "dayjs";
import { ExchangeRateModel, ExpenseDocument, TCodes } from "../models";
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
    return [new Date(startDate), new Date(endDate)]
}

type TExpense =
    | HydratedDocument<ExpenseDocument>
    | (FlattenMaps<ExpenseDocument> & { _id: any, __v: number });

export async function convertExpenses(expenses: TExpense[], baseCurrency: TCodes): Promise<TExpense[]> {
    for (const exp of expenses) {
        if (exp.currency !== "EUR") {
            const exchangeRate = await ExchangeRateModel.findOne({
                'meta.last_updated_at': {
                    $lte: exp.expenseDate
                }
            }).sort({ 'meta.last_updated_at': -1 });;

            if (!exchangeRate) throw new Error(`Exchange rate per la data ${dayjs(exp.expenseDate).format('DD-MM-YYYY')} non trovato`);
            const currencyData = exchangeRate.data.get(baseCurrency)
                ?? (() => { throw new Error(`La valuta ${baseCurrency} non è stata trovata!`) })();
            const expenseCurrencyData = exchangeRate.data.get(exp.currency)
                ?? (() => { throw new Error(`La valuta ${exp.currency} non è stata trovata!`) })();

            const amountInEUR = (exp.amount / expenseCurrencyData.value) * currencyData.value;
            exp.amount = round(amountInEUR, 2);
        }
    }
    return expenses;
}

export function createSlug(string: string): string {
    return string
        .split(' ').
        filter(item => item !== '')
        .map(w => w.toLowerCase())
        .join('-');
}
