import dayjs from "dayjs";
import { TExchangeRateLean } from "../types";
import { ExchangeRateModel } from "../models";
import { dumbOneRates } from "../lib";
import { RequestHandler } from "express";

export const verifyExchangeRates: RequestHandler = async (req, res, next) => {
    const today = dayjs().format('YYYY-MM-DD');
    let exchangeRate: TExchangeRateLean | null = await ExchangeRateModel.findOne({
        'meta.last_updated_at': {
            $lte: new Date(today)
        }
    }).sort({ 'meta.last_updated_at': -1 })
        .lean();
    if (!exchangeRate) {
        throw new Error(`Exchange rates non trovati!`);
    };
    const mostRecentDateString = dayjs(exchangeRate.meta.last_updated_at).format('YYYY-MM-DD');
    const diff = dayjs(mostRecentDateString).diff(dayjs(today), 'day');
    console.log(`${dayjs(mostRecentDateString).format('YYYY-MM-DD')} - ${dayjs(today).format('YYYY-MM-DD')} = ${diff}`)
    if (diff < 0) {
        console.log('Eseguo dumbOneRates')
        await dumbOneRates(Math.abs(diff), dayjs(mostRecentDateString));
    }

    next();
}