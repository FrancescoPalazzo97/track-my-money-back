import z from "zod";
import { codes, CodesSchema, objectIdSchema } from "./";

/**
 * SCHEMI E TIPI PER LE SPESE/ENTRATE
 */
// Schema per input spesa
export const TransactionInputZSchema = z.object({
    title: z.string().trim().min(1).max(50), // Titolo della spesa
    description: z.string().max(100).optional(), // Descrizione opzionale
    transactionDate: z.coerce.date().optional(), // Data della spesa (accetta stringhe ISO e converte in Date)
    amount: z.number().nonnegative(), // Importo
    currency: CodesSchema, // Codice valuta
    category: objectIdSchema, // Riferimento alla categoria
});

// Schema per PATCH spesa (tutti i campi opzionali, esclusi exchangeRateSnapshot e convertedAmount)
export const TransactionInputZSchemaForPatch = TransactionInputZSchema
    .partial()
    .strict();

// Schema spesa completo
const TransactionZSchema = TransactionInputZSchema.extend({
    transactionDate: z.date(), // Data della spesa
    createdAt: z.date(), // Data creazione
    updatedAt: z.date() // Data aggiornamento
});

// Tipi TypeScript
type TTransaction = z.infer<typeof TransactionZSchema>;
export type TGetTransaction = TTransaction & { amountInEUR: number };
type TTransactionInput = z.infer<typeof TransactionInputZSchema>;
type TTransactionInputForPatch = z.infer<typeof TransactionInputZSchemaForPatch>;
export type TransactionDocument = TTransaction & Document;

export const GetTransactionQueryZSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
    baseCurrency: z.enum(codes)
}).strict();