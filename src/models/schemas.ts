import { Schema, model } from "mongoose";
import type { CategoryDocument, ExpenseDocument } from "./types";

/**
 * Schema per le categorie di spese e entrate
 * Supporta la creazione di una struttura gerarchica tramite parentCategory
 */
const categorySchema = new Schema<CategoryDocument>({
    // Nome della categoria (es. "Alimentari", "Stipendio")
    name: {
        type: String,
        required: true
    },
    // Tipo di categoria: income per entrate, expense per spese
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    // Descrizione opzionale della categoria
    description: {
        type: String
    },
    // Riferimento alla categoria padre per creare una gerarchia
    // Es. "Alimentari" -> "Supermercato", "Ristoranti"
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    }
}, {
    // Aggiunge automaticamente i campi createdAt e updatedAt
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

/**
 * Schema per le spese/entrate effettive
 * Ogni spesa è collegata a una categoria e contiene informazioni sulla valuta
 */
const expenseSchema = new Schema<ExpenseDocument>({
    // Titolo breve della spesa (1-50 caratteri)
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    // Descrizione dettagliata opzionale (1-100 caratteri)
    description: {
        type: String,
        minlength: 1,
        maxlength: 100
    },
    // Data della spesa - default alla data corrente se non specificata
    expenseDate: {
        type: Date,
        default: Date.now
    },
    // Importo della spesa nella valuta originale (deve essere positivo)
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    // Codice valuta (es. EUR, USD, BTC) - deve essere uno dei codici supportati
    currency: {
        type: String,
        required: true
    },
    // Array di importi convertiti in altre valute (formato stringa)
    convertedAmount: [{ type: String }],
    // Riferimento alla categoria di appartenenza
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {
    // Aggiunge automaticamente i campi createdAt e updatedAt
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Esportazione dei modelli Mongoose per l'interazione con il database
export const CategoryModel = model<CategoryDocument>('Category', categorySchema);
export const ExpenseModel = model<ExpenseDocument>('Expense', expenseSchema);
