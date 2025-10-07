import { Schema } from "mongoose";
import { CategoryDocument } from "../types";

/**
 * Schema Mongoose per le categorie
 * Supporta categorie di tipo income e expense con struttura gerarchica
 */
export const categorySchema = new Schema<CategoryDocument>({
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