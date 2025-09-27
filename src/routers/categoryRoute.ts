import express from "express";
import { addNewCategory, getAllCategories } from "../controllers/categoryControllers";

const router = express.Router();

router.get('/', getAllCategories)

router.post('/', addNewCategory)

export default router;