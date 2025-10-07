import dayjs from "dayjs";
import { ExchangeRateModel, TExchangeRateResponse } from "../models";
import { currencyClient } from "./";

export default async function (times: number, targetDate: dayjs.Dayjs) {
    for (let i = 0; i < times; i++) {
        const foundData = await ExchangeRateModel.findOne({
            'meta.last_updated_at': targetDate.toDate()
        })
        if (foundData) return;

        const { data } = await currencyClient<TExchangeRateResponse>('/historical', {
            params: { date: targetDate.format('YYYY-MM-DD') }
        });
        const dataToSave = {
            ...data,
            meta: {
                ...data.meta,
                last_updated_at: new Date(data.meta.last_updated_at)
            }
        };

        await ExchangeRateModel.insertOne(dataToSave);
        targetDate = targetDate.subtract(1, 'day');
    }
}