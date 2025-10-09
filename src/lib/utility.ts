import dayjs from "dayjs";
import { TCodes, TTransactionLean, TCategoryLean, TCategoryWithSubCategories, TConvertedTransaction } from "../types";
import { ExchangeRateModel, TransactionModel } from "../models";

export function round(num: number, decimali: number) {
    return Math.round(num * Math.pow(10, decimali)) / Math.pow(10, decimali);
};

export async function convertTransaction(transaction: TTransactionLean, baseCurrency: TCodes): Promise<TConvertedTransaction> {
    const newTransaction = { ...transaction, amountInEUR: transaction.amount };

    if (transaction.currency !== "EUR") {
        const exchangeRate = await ExchangeRateModel.findOne({
            'meta.last_updated_at': {
                $lte: transaction.transactionDate
            }
        }).sort({ 'meta.last_updated_at': -1 })
            .lean();

        if (!exchangeRate) {
            throw new Error(`Exchange rate per la data ${dayjs(transaction.transactionDate).format('DD-MM-YYYY')} non trovato`)
        };

        const currencyData = exchangeRate.data[baseCurrency]
            ?? (() => { throw new Error(`La valuta ${baseCurrency} non è stata trovata!`) })();
        const transactionCurrencyData = exchangeRate.data[transaction.currency]
            ?? (() => { throw new Error(`La valuta ${transaction.currency} non è stata trovata!`) })();

        const amountInEUR = round((transaction.amount / transactionCurrencyData.value) * currencyData.value, 2);
        newTransaction.amountInEUR = amountInEUR;
    };
    return newTransaction;
};

export function getSubCategories(categories: TCategoryLean[], category: TCategoryLean): TCategoryWithSubCategories[] {
    return categories
        .filter(subCat =>
            subCat.parentCategory?.toString() === category._id.toString()
        )
        .map(subCat => ({
            ...subCat,
            subCategories: getSubCategories(categories, subCat)
        }));
};

export async function getCategoriesWitTransactions(categories: TCategoryLean[]) {
    const transactions: TTransactionLean[] = await TransactionModel
        .find()
        .lean()
        .sort({ 'transactionDate': -1 });

    return categories.map(cat => {
        const transactionsWithSameId = transactions
            .filter(t => t.category.toString() === cat._id.toString());
        return { ...cat, transactions: transactionsWithSameId };
    })
}