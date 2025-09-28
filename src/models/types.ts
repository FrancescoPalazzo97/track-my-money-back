import { Document, Types } from "mongoose";
import z from "zod";

/**
 * Codici di valuta supportati
 * Include valute fiat e criptovalute
 */
export const codes = [
  'ADA', 'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARB', 'ARS', 'AUD', 'AVAX', 'AWG', 'AZN',
  'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BNB', 'BND', 'BOB', 'BRL', 'BSD', 'BTC', 'BTN', 'BWP', 'BYN', 'BYR', 'BZD',
  'CAD', 'CDF', 'CHF', 'CLF', 'CLP', 'CNY', 'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK',
  'DAI', 'DJF', 'DKK', 'DOP', 'DOT', 'DZD',
  'EGP', 'ERN', 'ETB', 'ETH', 'EUR',
  'FJD', 'FKP',
  'GBP', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD',
  'HKD', 'HNL', 'HRK', 'HTG', 'HUF',
  'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK',
  'JEP', 'JMD', 'JOD', 'JPY',
  'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT',
  'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTC', 'LTL', 'LVL', 'LYD',
  'MAD', 'MATIC', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN',
  'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD',
  'OMR', 'OP',
  'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG',
  'QAR',
  'RON', 'RSD', 'RUB', 'RWF',
  'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SLL', 'SOL', 'SOS', 'SRD', 'STD', 'STN', 'SVC', 'SYP', 'SZL',
  'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRX', 'TRY', 'TTD', 'TWD', 'TZS',
  'UAH', 'UGX', 'USD', 'USDC', 'USDT', 'UYU', 'UZS',
  'VEF', 'VES', 'VND', 'VUV',
  'WST',
  'XAF', 'XAG', 'XAU', 'XCD', 'XCG', 'XDR', 'XOF', 'XPD', 'XPF', 'XPT', 'XRP',
  'YER',
  'ZAR', 'ZMK', 'ZMW', 'ZWG', 'ZWL'
] as const;

/**
 * SCHEMI E TIPI PER LE CATEGORIE
 */

const createObjectIdSchema = () => z
  .union([
    z.string().refine(
      (val) => Types.ObjectId.isValid(val),
      { message: "ObjectId non valido!" }
    ),
    z.instanceof(Types.ObjectId)
  ])
  .transform((val) =>
    typeof val === 'string' ? new Types.ObjectId(val) : val
  );

const objectIdSchema = createObjectIdSchema();

// Schema per input categoria
export const CategoryInputZSchema = z.object({
  name: z.string(), // Nome della categoria
  type: z.enum(['income', 'expense']), // Tipo: income o expense
  description: z.string().optional(), // Descrizione opzionale
  parentCategory: objectIdSchema.optional() // ID categoria padre
});

// Schema categoria completo
export const CategoryZSchema = CategoryInputZSchema.extend({
  createdAt: z.iso.datetime(), // Data creazione
  updatedAt: z.iso.datetime() // Data aggiornamento
})

// Tipi TypeScript
export type CategoryType = z.infer<typeof CategoryZSchema>;
export type CategoryInputType = z.infer<typeof CategoryInputZSchema>;
export type CategoryDocument = CategoryType & Document;

/**
 * SCHEMI E TIPI PER LE SPESE/ENTRATE
 */

// Schema per input spesa
export const ExpenseInputZSchema = z.object({
  title: z.string().min(1).max(50), // Titolo della spesa
  description: z.string().min(1).max(100).optional(), // Descrizione opzionale
  expenseDate: z.date().optional(), // Data della spesa
  amount: z.number().positive(), // Importo
  currency: z.enum(codes), // Codice valuta
  convertedAmount: z.array(z.string()), // Importi convertiti
  category: objectIdSchema // Riferimento alla categoria
});

// Schema spesa completo
export const ExpenseZSchema = ExpenseInputZSchema.extend({
  expenseDate: z.date(), // Data della spesa
  createdAt: z.date(), // Data creazione
  updatedAt: z.date() // Data aggiornamento
});

// Tipi TypeScript
export type ExpenseType = z.infer<typeof ExpenseZSchema>;
export type ExpenseInputType = z.infer<typeof ExpenseInputZSchema>;
export type ExpenseDocument = ExpenseType & Document;

/**
 * SCHEMI PER LE RISPOSTE API
 */

// Schema per messaggi di successo
export const SuccessSchema = z.object({
  success: z.boolean(), // Successo operazione
  message: z.string() // Messaggio descrittivo
});

export type TSuccess = z.infer<typeof SuccessSchema>;

// Schema per errori di validazione
export const ZodErrorSchema = z.array(z.object({
  expected: z.string(), // Tipo atteso
  code: z.string(), // Codice errore
  path: z.array(z.string()), // Percorso campo
  message: z.string() // Messaggio errore
}));