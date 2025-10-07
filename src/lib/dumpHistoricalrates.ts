import dayjs from "dayjs";
import { ExchangeRateModel, TExchangeRateResponse } from "../models";
import { currencyClient } from ".";

export default async function (dateString: string) {
    const date = dayjs(dateString);
    const today = dayjs(dayjs().format('YYYY-MM-DD'));
    if (!date.isValid || date.isAfter(today) || date.isSame(today)) {
        return null;
    };
    const targetDate = new Date(`${date.format('YYYY-MM-DD')}T23:59:59Z`);
    const foundData = await ExchangeRateModel.findOne({
        'meta.last_updated_at': targetDate
    });
    if (foundData) {
        return { ...foundData.toObject(), inDB: true };
    };
    const { data } = await currencyClient<TExchangeRateResponse>('/historical', {
        params: { date: date.format('YYYY-MM-DD') }
    });

    const dataToSave = {
        ...data,
        meta: {
            ...data.meta,
            last_updated_at: new Date(data.meta.last_updated_at)
        }
    };

    await ExchangeRateModel.insertOne(dataToSave);
    return { ...dataToSave, inDB: false };
}