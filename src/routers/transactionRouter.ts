import express from "express";
import { addNewTransaction, getTransaction, deleteTransaction, getTransactionById, modifyTransaction } from "../controllers/transactionController";
const router = express.Router();

router.get('/', getTransaction);

router.get('/:id', getTransactionById)

router.post('/', addNewTransaction);

router.patch('/:id', modifyTransaction)

router.delete('/:id', deleteTransaction);

export default router;