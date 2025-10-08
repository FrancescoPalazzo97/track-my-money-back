/**
 * SCHEMI PER LE API DI EXCHANGE RATE
 */

import z from "zod";
import { codes } from "./";
import { Types } from "mongoose";

// Schema per una singola valuta
const CurrencyRateSchema = z.object({
    code: z.enum(codes), // Codice valuta
    value: z.number() // Valore di cambio
});

// Schema per i metadati della risposta
const ExchangeRateMetaZSchema = z.object({
    last_updated_at: z.string() // Data ultimo aggiornamento in formato ISO string
});

// Schema per la risposta completa dell'API exchange rate
export const ExchangeRateResponseZSchema = z.object({
    meta: ExchangeRateMetaZSchema, // Metadati
    data: z.record(z.enum(codes), CurrencyRateSchema) // Oggetto con codici valuta come chiavi
        .transform((obj) => new Map(Object.entries(obj))) // Converte in Map per compatibilità con Mongoose
});

const ExchangeRateZSchema = z.object({
    meta: ExchangeRateMetaZSchema,
    data: z.record(z.enum(codes), CurrencyRateSchema)
})

// Tipi TypeScript
type TCurrencyRate = z.infer<typeof CurrencyRateSchema>;
type TExchangeRateMeta = z.infer<typeof ExchangeRateMetaZSchema>;
export type TExchangeRateResponse = z.infer<typeof ExchangeRateResponseZSchema>;
export type ExchangeRateDocument = TExchangeRateResponse & Document;

export type TExchangeRateLean = z.infer<typeof ExchangeRateZSchema> & { _id: Types.ObjectId };
/**
 * SCHEMI PER LE QUOTE API
 */

// Schema per una quota (month o grace)
export const QuotaSchema = z.object({
    total: z.number(),
    used: z.number(),
    remaining: z.number()
});

// Schema per le quote complete
export const QuotasSchema = z.object({
    month: QuotaSchema,
    grace: QuotaSchema
});

// Schema per la risposta delle quote API
export const ApiQuotasResponseSchema = z.object({
    account_id: z.number(),
    quotas: QuotasSchema
});

// Tipi TypeScript
export type TQuota = z.infer<typeof QuotaSchema>;
export type TQuotas = z.infer<typeof QuotasSchema>;
export type TApiQuotasResponse = z.infer<typeof ApiQuotasResponseSchema>;
