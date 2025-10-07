import { Schema } from "mongoose";
import { codes, TransactionDocument } from "../types";

/**
 * Schema Mongoose per le spese/entrate
 * Include informazioni su importo, valuta e categoria di appartenenza
 */
export const TransactionSchema = new Schema<TransactionDocument>({
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