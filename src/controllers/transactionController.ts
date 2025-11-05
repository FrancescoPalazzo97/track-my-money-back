import { Request, Response } from "express";
import { TransactionInputZSchema, TransactionInputZSchemaForPatch, TSuccess, objectIdZSchema, GetTransactionQueryZSchema, TConvertedTransaction, TExchangeRateLean, TTransactionLean } from "../types";
import { TransactionModel } from "../models";
import { convertTransaction, round, validateDate } from '../lib';
import { Types } from "mongoose";

export const getTransactions = async (req: Request, res: Response<TSuccess<TTransactionLean[]>>) => {
    const { startDate, endDate, baseCurrency = 'EUR' } = GetTransactionQueryZSchema.parse(req.query);
    const [start, end] = validateDate(startDate, endDate);
    const transactions = await TransactionModel.find({
        transactionDate: {
            $gte: start,
            $lte: end
        }
    }).populate('category', '_id type')
        .lean()
        .sort({ 'transactionDate': -1 });
    let convertedTransactions: TConvertedTransaction[] = [];
    for (const transaction of transactions) {
        const convertedTransaction = await convertTransaction(transaction, baseCurrency);
        convertedTransactions.push(convertedTransaction)
    }
    res.status(201).json({
        success: true,
        message: 'Elenco delle transazioni',
        data: convertedTransactions
    });
};

const CurrencySchema = GetTransactionQueryZSchema.omit({ startDate: true, endDate: true })

export const getTransactionById = async (req: Request, res: Response<TSuccess<TTransactionLean>>) => {
    const transactionId = objectIdZSchema.parse(req.params.id);
    const { baseCurrency = "EUR" } = CurrencySchema.parse(req.query);
    const transaction = await TransactionModel.findById(transactionId).populate('category', '_id type').lean();
    if (!transaction) {
        throw new Error(`Transazione con ID: ${transactionId} non trovata!`);
    };
    const convertedTransaction: TConvertedTransaction = await convertTransaction(transaction, baseCurrency)
    console.log('converted della get: ', convertedTransaction)
    res.status(201).json({
        success: true,
        message: 'Elenco delle transazioni',
        data: convertedTransaction
    });
};

export const addNewTransaction = async (req: Request, res: Response<TSuccess<TTransactionLean>>) => {
    const result = TransactionInputZSchema.parse(req.body);
    result.amount = round(result.amount, 2);
    const newTransaction = await TransactionModel.insertOne(result);
    const newTransactionLean: TTransactionLean = newTransaction.toObject();
    //IMPORTANTE: C'è ancora da sistemare la questione del settaggio della base currency
    const convertedTransaction = await convertTransaction(newTransactionLean, 'EUR')
    res.status(201).json({
        success: true,
        message: 'Transazione aggiunta!',
        data: convertedTransaction
    });
};

export const deleteTransaction = async (req: Request, res: Response<TSuccess<Types.ObjectId>>) => {
    const transactionId = objectIdZSchema.parse(req.params.id);
    const opereationResult = await TransactionModel.deleteOne({ _id: transactionId });
    if (opereationResult.deletedCount === 0) throw new Error('Impossibile eliminare la transazione non è stata trovata!');
    res.status(200).json({
        success: true,
        message: "transazione eliminata con successo",
        data: transactionId
    });
};

export const modifyTransaction = async (req: Request, res: Response<TSuccess<TTransactionLean>>) => {
    const transactionId = objectIdZSchema.parse(req.params.id);
    const updates = TransactionInputZSchemaForPatch.parse(req.body);
    const operationResult = await TransactionModel.findByIdAndUpdate(
        transactionId,
        updates,
        { new: true, runValidators: true }
    );
    if (!operationResult) throw new Error('Impossibile modificare la transazione non è stata trovata!');
    const newTransaction = operationResult.toObject()
    const convertedTransaction = await convertTransaction(newTransaction, 'EUR')
    res.status(200).json({
        success: true,
        message: "Transazione modificata con successo!",
        data: convertedTransaction
    })
}