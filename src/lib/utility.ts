import dayjs from "dayjs";
import { ExchangeRateModel, TransactionDocument, TCodes, TGetTransaction } from "../models";
import { FlattenMaps } from "mongoose";

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

type TTransaction = (FlattenMaps<TransactionDocument> & { _id: any, __v: number });

export async function convertTransaction(transaction: TTransaction, baseCurrency: TCodes): Promise<TGetTransaction> {
    const newTransaction = { ...transaction, amountInEUR: transaction.amount };
    if (transaction.currency !== "EUR") {
        const exchangeRate = await ExchangeRateModel.findOne({
            'meta.last_updated_at': {
                $lte: transaction.transactionDate
            }
        }).sort({ 'meta.last_updated_at': -1 });

        if (!exchangeRate) {
            throw new Error(`Exchange rate per la data ${dayjs(transaction.transactionDate).format('DD-MM-YYYY')} non trovato`)
        };

        const currencyData = exchangeRate.data.get(baseCurrency)
            ?? (() => { throw new Error(`La valuta ${baseCurrency} non è stata trovata!`) })();
        const transactionCurrencyData = exchangeRate.data.get(transaction.currency)
            ?? (() => { throw new Error(`La valuta ${transaction.currency} non è stata trovata!`) })();

        const amountInEUR = round((transaction.amount / transactionCurrencyData.value) * currencyData.value, 2);
        newTransaction.amountInEUR = amountInEUR;
    };
    return newTransaction;
};