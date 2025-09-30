import dayjs from "dayjs";
import dumpHistoricalrates from "../lib/dumpHistoricalrates";
import { connectToMongo, disconnectToMongo } from "../db/connection";
import { currencyClient } from "../lib/currencyClient";

(async () => {
    await connectToMongo();

    const { data } = await currencyClient('/status');
    const totRequestRemainig = data.quotas.month.remaining - 50;

    const startDateString = process.argv[2];
    const startDate = dayjs(startDateString);
    const today = dayjs(dayjs().format('YYYY-MM-DD'));

    if (!startDate.isValid() || startDate.isAfter(today) || startDate.isSame(today)) {
        console.error('Data non valida!');
        process.exit(1);
    }

    let currentDate = dayjs(startDate.format('YYYY-MM-DD'));
    let totUsedRequest = 0;
    let doneRequestPerMinute = 0;

    while (totUsedRequest < totRequestRemainig) {
        const histirocalRates = await dumpHistoricalrates(currentDate.format('YYYY-MM-DD'));
        if (histirocalRates === null) {
            break;
        }
        if (!histirocalRates.inDB) {
            doneRequestPerMinute++;
            totUsedRequest++;
            if (doneRequestPerMinute === 10) {
                console.log('Ho eseguito 10 richieste quindi aspetto 60 secondi!');
                for (let i = 0; i < 60; i++) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log(`${60 - i}...`)
                }
                doneRequestPerMinute = 0;
            }
        }
        currentDate = currentDate.subtract(1, 'day');
    }

    disconnectToMongo()
})();
