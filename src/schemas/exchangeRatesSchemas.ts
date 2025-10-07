import { Schema } from "mongoose";
import { ExchangeRateDocument, codes } from "../types";
/**
 * Schema Mongoose per i dati dei tassi di cambio
 * Memorizza i tassi di cambio per tutte le valute supportate
 */
const currencyRateSchema = new Schema({
    // Codice valuta
    code: {
        type: String,
        required: true,
        enum: codes
    },
    // Valore del tasso di cambio
    value: {
        type: Number,
        required: true
    }
}, { _id: false });

export const exchangeRateSchema = new Schema<ExchangeRateDocument>({
    // Metadati del tasso di cambio
    meta: {
        // Data ultimo aggiornamento
        last_updated_at: {
            type: Date,
            required: true
        }
    },
    // Mappa dei tassi di cambio per valuta
    data: {
        type: Map,
        of: currencyRateSchema,
        required: true
    }
});

exchangeRateSchema.index({ 'meta.last_updated_at': -1 });