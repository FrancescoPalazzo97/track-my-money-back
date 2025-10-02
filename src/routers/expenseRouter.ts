import express from "express";
import { addNewExpense, getExpenses, deleteExpense } from "../controllers/expenseController";
const router = express.Router();

router.get('/', getExpenses);

router.post('/', addNewExpense);

router.delete('/:id', deleteExpense);

export default router;