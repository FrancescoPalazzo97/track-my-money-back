import { Schema, model } from "mongoose";
import type { CategoryDocument, ExpenseDocument } from "./types";

/**
 * Schema Mongoose per le categorie
 * Supporta categorie di tipo income e expense con struttura gerarchica
 */
const categorySchema = new Schema<CategoryDocument>({
    // Nome della categoria
    name: {
        type: String,
        required: true
    },
    // Tipo: income o expense
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    // Descrizione opzionale
    description: {
        type: String
    },
    // Riferimento alla categoria padre per struttura gerarchica
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    }
}, {
    // Timestamp automatici
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

/**
 * Schema Mongoose per le spese/entrate
 * Include informazioni su importo, valuta e categoria di appartenenza
 */
const expenseSchema = new Schema<ExpenseDocument>({
    // Titolo della spesa
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    // Descrizione opzionale
    description: {
        type: String,
        minlength: 1,
        maxlength: 100
    },
    // Data della spesa
    expenseDate: {
        type: Date,
        default: Date.now
    },
    // Importo della spesa
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    // Codice valuta
    currency: {
        type: String,
        required: true
    },
    // Importi convertiti in altre valute
    convertedAmount: [{ type: String }],
    // Riferimento alla categoria
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {
    // Timestamp automatici
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Modelli Mongoose
export const CategoryModel = model<CategoryDocument>('Category', categorySchema);
export const ExpenseModel = model<ExpenseDocument>('Expense', expenseSchema);
