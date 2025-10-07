import dayjs from "dayjs";
import { CategoryModel, TCategoryInput } from "../models";

export async function validateNewCategory(input: TCategoryInput) {
    if (input.parentCategory) {
        const categoryExist = await CategoryModel.findOne({
            _id: input.parentCategory
        });

        if (!categoryExist) {
            throw new Error(`La categoria padre non esiste!\nSi prega di inserire una categoria esistente`);
        };

        if (categoryExist.type !== input.type) {
            throw new Error(`Non puoi mettere come categoria padre una categoria di un tipo diverso!`);
        };
    };

    const categoryWithSameName = await CategoryModel.findOne({
        name: input.name
    })

    if (categoryWithSameName) {
        throw new Error(`Esiste già una categoria con questo nome!`);
    };
};

export function validateDate(startDate: string, endDate: string) {
    const [start, end] = [dayjs(startDate), dayjs(endDate)];
    if (!start.isValid() || start.isAfter(end)) {
        throw new Error('Data di inizio non valida!');
    };
    if (!end.isValid()) {
        throw new Error('Data di fine non valida!');
    };
    return [new Date(startDate), new Date(endDate)];
};