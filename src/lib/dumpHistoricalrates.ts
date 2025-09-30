import dayjs from "dayjs";
import { ExchangeRateModel, TExchangeRateResponse } from "../models";
import { currencyClient } from "./currencyClient";

export default async function (dateString: string) {
    const date = dayjs(dateString);
    const today = dayjs(dayjs().format('YYYY-MM-DD'));
    if (!date.isValid || date.isAfter(today) || date.isSame(today)) {
        return null;
    };
    const foundData = await ExchangeRateModel.findOne({
        'meta.last_updated_at': {
            $regex: `^${date.format('YYYY-MM-DD')}`
        }
    });
    if (foundData) {
        return { ...foundData, inDB: true };
    };
    const { data } = await currencyClient<TExchangeRateResponse>('/historical', {
        params: { date: date.format('YYYY-MM-DD') }
    });
    await ExchangeRateModel.insertOne(data);
    return { ...data, inDB: false };
}