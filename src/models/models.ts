import { model } from "mongoose";
import { CategoryDocument, TransactionDocument, ExchangeRateDocument } from "../types";
import { categorySchema, exchangeRateSchema, TransactionSchema } from "../schemas";

// Modelli Mongoose
export const CategoryModel = model<CategoryDocument>('Category', categorySchema);
export const TransactionModel = model<TransactionDocument>('Transaction', TransactionSchema);
export const ExchangeRateModel = model<ExchangeRateDocument>('ExchangeRate', exchangeRateSchema);