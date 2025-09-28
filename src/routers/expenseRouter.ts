import express from "express";
import { addNewExpense } from "../controllers/expenseController";

const router = express.Router();

router.post('/', addNewExpense);

export default router;