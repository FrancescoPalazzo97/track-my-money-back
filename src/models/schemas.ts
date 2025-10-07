import { Schema, model } from "mongoose";
import type { CategoryDocument, TransactionDocument, ExchangeRateDocument } from "./types";
import { codes } from "./types";

/**
 * Schema Mongoose per le categorie
 * Supporta categorie di tipo income e expense con struttura gerarchica
 */
const categorySchema = new Schema<CategoryDocument>({
    // Nome della categoria
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
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
const TransactionSchema = new Schema<TransactionDocument>({
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
    transactionDate: {
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
        required: true,
        enum: codes
    },
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

TransactionSchema.index({ 'transactionDate': -1 });

/**
 * Schema Mongoose per i dati dei tassi di cambio
 * Memorizza i tassi di cambio per tutte le valute supportate
 */
const currencyRateSchema = new Schema({
    // Codice valuta
    code: {
        type: String,
        required: true,
        enum: codes
    },
    // Valore del tasso di cambio
    value: {
        type: Number,
        required: true
    }
}, { _id: false });

const exchangeRateSchema = new Schema<ExchangeRateDocument>({
    // Metadati del tasso di cambio
    meta: {
        // Data ultimo aggiornamento
        last_updated_at: {
            type: Date,
            required: true
        }
    },
    // Mappa dei tassi di cambio per valuta
    data: {
        type: Map,
        of: currencyRateSchema,
        required: true
    }
});

exchangeRateSchema.index({ 'meta.last_updated_at': -1 });

// Modelli Mongoose
export const CategoryModel = model<CategoryDocument>('Category', categorySchema);
export const TransactionModel = model<TransactionDocument>('Transaction', TransactionSchema);
export const ExchangeRateModel = model<ExchangeRateDocument>('ExchangeRate', exchangeRateSchema);
