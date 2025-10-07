import express from "express";
import {
    addNewTransaction,
    getTransactions,
    deleteTransaction,
    getTransactionById,
    modifyTransaction
} from "../controllers/transactionController";

const router = express.Router();

router.get('/', getTransactions);

router.get('/:id', getTransactionById)

router.post('/', addNewTransaction);

router.patch('/:id', modifyTransaction)

router.delete('/:id', deleteTransaction);

export default router;