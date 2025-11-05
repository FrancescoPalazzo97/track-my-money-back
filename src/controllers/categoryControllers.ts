import { Request, Response } from "express";
import { CategoryInputZSchema, objectIdZSchema, TSuccess, CategoryInputZSchemaForPatch, TCategoryLean, TCategoryWithSubCategories, TTransactionLean } from "../types";
import { CategoryModel } from "../models";
import { getCategoriesWitTransactions, getSubCategories, validateNewCategory } from "../lib";
import { Types } from "mongoose";

type TCategoryGroupedWithTransactions = TCategoryLean & { subCategories: TCategoryWithSubCategories[], transactions: TCategoryLean[] }

type TCategoryGrouped = TCategoryLean & { subCategories: TCategoryWithSubCategories[] };

type TCategoryWithTransactions = TCategoryLean & { transactions: TTransactionLean[] };

type CategoriesResponse =
    | TCategoryLean[]
    | TCategoryWithTransactions[]
    | TCategoryGrouped[]
    | TCategoryGroupedWithTransactions[]

export const getAllCategories = async (req: Request, res: Response<TSuccess<CategoriesResponse>>) => {
    const group = req.query.group === 'true';
    const withTransactions = req.query.withTransactions === 'true';

    const categories: TCategoryLean[] = await CategoryModel.find().lean();

    if (group && withTransactions) {
        const categoriesWithTransactions = await getCategoriesWitTransactions(categories);
        const mainCategories = categoriesWithTransactions.filter(cat => !cat.parentCategory);
        const groupedCategoriesWithTransactions = mainCategories.map(mainCat => ({
            ...mainCat,
            subCategories: getSubCategories(categoriesWithTransactions, mainCat)
        }));
        res.status(200).json({
            success: true,
            message: 'Elenco categorie ragruppate con transazioni',
            data: groupedCategoriesWithTransactions
        });
    } else if (group) {
        const mainCategories = categories.filter(cat => !cat.parentCategory);
        const groupedCategories = mainCategories.map(mainCat => ({
            ...mainCat,
            subCategories: getSubCategories(categories, mainCat)
        }));
        res.status(200).json({
            success: true,
            message: 'Elenco categorie ragruppate',
            data: groupedCategories
        });
    } else if (withTransactions) {
        const categoriesWithTransactions = await getCategoriesWitTransactions(categories);
        res.status(200).json({
            success: true,
            message: 'Elenco categorie con transazioni',
            data: categoriesWithTransactions
        });
    } else {
        res.status(200).json({
            success: true,
            message: 'Elenco categorie',
            data: categories.sort((a, b) => a.name.localeCompare(b.name))
        });
    }
}

export const getCategoryById = async (req: Request, res: Response<TSuccess<TCategoryLean>>) => {
    const categoryId = objectIdZSchema.parse(req.params.id);
    const data: TCategoryLean | null = await CategoryModel.findById(categoryId);
    if (!data) {
        throw new Error(`Categoria con id "${categoryId}" non trovata!`);
    }
    res.status(201).json({ success: true, message: `Categoria con id "${categoryId}"`, data });
};

export const addNewCategory = async (req: Request, res: Response<TSuccess<TCategoryLean>>) => {
    const result = CategoryInputZSchema.parse(req.body);

    await validateNewCategory(result);

    const data: TCategoryLean = await CategoryModel.insertOne(result);

    res.status(201).json({ success: true, message: 'Nuova Categoria aggiunta!', data });
}

export const deleteCategory = async (req: Request, res: Response<TSuccess<Types.ObjectId>>) => {
    const categoryId = objectIdZSchema.parse(req.params.id);
    const deletedCategory: TCategoryLean | null = await CategoryModel.findByIdAndDelete(categoryId);
    if (!deletedCategory) throw new Error('Impossibile eliminare la categoria non esiste!');

    if (deletedCategory.parentCategory) {
        // Se aveva un genitore, le figlie ereditano quel genitore
        await CategoryModel.updateMany(
            { parentCategory: categoryId },
            { $set: { parentCategory: deletedCategory.parentCategory } }
        );
    } else {
        // Se era di primo livello, le figlie diventano di primo livello
        await CategoryModel.updateMany(
            { parentCategory: categoryId },
            { $unset: { parentCategory: "" } }
        );
    }

    res.status(201).json({
        success: true,
        message: `Categoria ${deletedCategory.name} Eliminata con successo!`,
        data: categoryId
    });
}

export const modifyCategory = async (req: Request, res: Response<TSuccess<TCategoryLean>>) => {
    const categoryId = objectIdZSchema.parse(req.params.id);
    const updates = CategoryInputZSchemaForPatch.parse(req.body);
    if (categoryId.toString() == updates.parentCategory?.toString()) {
        throw new Error(`Le categorie non possono essere figlie di loro stesse!`);
    }

    // Se parentCategory non è presente nel body, la rimuoviamo dal database
    const updateOperation: {
        $set: typeof updates; $unset?: { parentCategory: "" }
    } = { $set: updates };
    if (!('parentCategory' in req.body) && Object.keys(updates).length > 0) {
        updateOperation.$unset = { parentCategory: "" };
    }

    const opereationResult: TCategoryLean | null = await CategoryModel.findByIdAndUpdate(
        categoryId,
        updateOperation,
        { new: true, runValidators: true }
    );
    if (!opereationResult) throw new Error(`Impossibile modificare la categoria non esiste!`);
    res.status(201).json({
        success: true,
        message: 'Categoria modificata con successo!',
        data: opereationResult
    })
}