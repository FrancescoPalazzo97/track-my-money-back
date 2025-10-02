import express from "express";
import { addNewCategory, deleteCategory, getAllCategories, getCategoryById, modifyCategory } from "../controllers/categoryControllers";

const router = express.Router();

router.get('/', getAllCategories);

router.get('/:id', getCategoryById);

router.post('/', addNewCategory);

router.delete('/:id', deleteCategory);

router.patch('/:id', modifyCategory);

export default router;