import express from "express";
import { addNewExpense, getExpenses } from "../controllers/expenseController";
const router = express.Router();

router.get('/', getExpenses)

router.post('/', addNewExpense);

export default router;