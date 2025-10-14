import { Request, Response } from "express";
import { TransactionInputZSchema, TransactionInputZSchemaForPatch, TSuccess, objectIdZSchema, GetTransactionQueryZSchema, TConvertedTransaction, TExchangeRateLean, TTransactionLean } from "../types";
import { TransactionModel } from "../models";
import { convertTransaction, validateDate } from '../lib';
import { Types } from "mongoose";

export const getTransactions = async (req: Request, res: Response<TSuccess<TTransactionLean[]>>) => {
    const { startDate, endDate, baseCurrency = 'EUR' } = GetTransactionQueryZSchema.parse(req.query);
    const [start, end] = validateDate(startDate, endDate);
    const transactions = await TransactionModel.find({
        transactionDate: {
            $gte: start,
            $lte: end
        }
    }).populate('category')
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
    const transaction = await TransactionModel.findById(transactionId).lean();
    if (!transaction) {
        throw new Error(`Transazione con ID: ${transactionId} non trovata!`);
    };
    const convertedTransaction: TConvertedTransaction = await convertTransaction(transaction, baseCurrency)
    res.status(201).json({
        success: true,
        message: 'Elenco delle transazioni',
        data: convertedTransaction
    });
};

export const addNewTransaction = async (req: Request, res: Response<TSuccess<TTransactionLean>>) => {
    const result = TransactionInputZSchema.parse(req.body);
    const newTransaction: TTransactionLean = await TransactionModel.insertOne(result);
    res.status(201).json({
        success: true,
        message: 'Transazione aggiunta!',
        data: newTransaction
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
    const operationResult: TTransactionLean | null = await TransactionModel.findByIdAndUpdate(
        transactionId,
        updates,
        { new: true, runValidators: true }
    );
    if (!operationResult) throw new Error('Impossibile modificare la transazione non è stata trovata!');
    res.status(200).json({
        success: true,
        message: "Transazione modificata con successo!",
        data: operationResult
    })
}