import express from "express";
import { ExpenseInputZSchema, ExpenseModel } from "../models";
import { resultMessage } from "../lib/utility";
import { Types } from "mongoose";

const router = express.Router();

router.post('/', async (req, res) => {
    const result = ExpenseInputZSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json(resultMessage(false, result.error.message));
    } else {
        // Creare middleware per trasformare id_category da stringa a ObjectId per eliminare errore typescript
        const categoryObjectId = new Types.ObjectId(result.data.category);
        await ExpenseModel.insertOne({ ...result.data, category: categoryObjectId });
        res.status(201).json(resultMessage(true, 'Spesa aggiunta!'))
    }
});

export default router;