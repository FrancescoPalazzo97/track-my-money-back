import express from "express";
import { addNewExpense, getExpenses, deleteExpense, getExpensesById } from "../controllers/expenseController";
const router = express.Router();

router.get('/', getExpenses);

router.get('/:id', getExpensesById)

router.post('/', addNewExpense);

router.delete('/:id', deleteExpense);

export default router;