import dayjs from "dayjs";
import { ExpenseDocument } from "../models";
import { HydratedDocument } from "mongoose";

export function round(num: number, decimali: number) {
    return Math.round(num * Math.pow(10, decimali)) / Math.pow(10, decimali);
};

export function validateDate(startDate: string, endDate: string) {
    const [start, end] = [dayjs(startDate), dayjs(endDate)];
    if (!start.isValid() || start.isAfter(end)) {
        throw new Error('Data di inizio non valida!');
    };
    if (!end.isValid()) {
        throw new Error('Data di fine non valida!');
    };
    return [new Date(startDate), new Date(endDate)]
}

type TExpenses = HydratedDocument<ExpenseDocument>[]

export async function convertExpenses(expenses: TExpenses): Promise<TExpenses> {
    for (const exp of expenses) {
        if (exp.currency !== "EUR") {

        }
    }
    return expenses;
}
