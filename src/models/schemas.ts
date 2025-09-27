import { Schema, model } from "mongoose";
import type { CategoryDocument, ExpenseDocument } from "./types";

const categorySchema = new Schema<CategoryDocument>({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    description: {
        type: String
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

const expenseSchema = new Schema<ExpenseDocument>({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    description: {
        type: String,
        minlength: 1,
        maxlength: 100
    },
    expenseDate: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        required: true
    },
    convertedAmount: [{ type: String }],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export const Category = model<CategoryDocument>('Category', categorySchema);
export const Expense = model<ExpenseDocument>('Expense', expenseSchema);
