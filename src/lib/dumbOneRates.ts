import dayjs from "dayjs";
import { ExchangeRateResponseZSchema } from "../types";
import { ExchangeRateModel } from "../models";
import { currencyClient } from "./";

export default async function (times: number, startDate: dayjs.Dayjs) {
    for (let i = 0; i < times && i < 10; i++) {
        const response = await currencyClient('/historical', {
            params: { date: startDate.format('YYYY-MM-DD') }
        });
        const data = ExchangeRateResponseZSchema.parse(response.data);
        const dataToSave = {
            ...data,
            meta: {
                ...data.meta,
                last_updated_at: new Date(data.meta.last_updated_at)
            }
        };
        await ExchangeRateModel.insertOne(dataToSave);
        console.log('ho salvato nel DB la data: ', dataToSave.meta.last_updated_at);
        startDate = startDate.add(1, 'day');
    }
}