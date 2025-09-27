import { Document, Schema, Types } from "mongoose";
import z from "zod";

/**
 * Lista completa dei codici di valuta supportati
 * Include valute fiat tradizionali e criptovalute
 * Formato basato su ISO 4217 per valute fiat e codici standard per crypto
 */
const codes = [
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

// Schema di validazione per l'input di una nuova categoria
export const CategoryInputZSchema = z.object({
  name: z.string(), // Nome della categoria
  type: z.enum(['income', 'expense']), // Tipo: entrata o spesa
  description: z.string().optional(), // Descrizione opzionale
  parentCategory: z.string().optional() // ID della categoria padre (per gerarchia)
});

// Schema completo della categoria con timestamp
export const CategoryZSchema = CategoryInputZSchema.extend({
  createdAt: z.iso.datetime(), // Data di creazione
  updatedAt: z.iso.datetime() // Data di ultimo aggiornamento
})

// Tipi TypeScript derivati dagli schemi Zod
export type CategoryType = z.infer<typeof CategoryZSchema>;
export type CategoryInputType = z.infer<typeof CategoryInputZSchema>;
export type CategoryDocument = CategoryType & Document;

/**
 * SCHEMI E TIPI PER LE SPESE/ENTRATE
 */

// Schema di validazione per l'input di una nuova spesa
export const ExpenseInputZSchema = z.object({
  title: z.string().min(1).max(50), // Titolo della spesa (1-50 caratteri)
  description: z.string().min(1).max(100).optional(), // Descrizione opzionale (1-100 caratteri)
  expenseDate: z.date().optional(), // Data della spesa - opzionale, default alla data corrente
  amount: z.number().positive(), // Importo (deve essere positivo)
  currency: z.enum(codes), // Codice valuta (deve essere uno dei codici supportati)
  convertedAmount: z.array(z.string()), // Array di importi convertiti in altre valute
  category: z.string() // Riferimento alla categoria di appartenenza
});

// Schema completo della spesa con timestamp
export const ExpenseZSchema = ExpenseInputZSchema.extend({
  expenseDate: z.date(), // Data della spesa (richiesta nello schema completo)
  createdAt: z.date(), // Data di creazione
  updatedAt: z.date() // Data di ultimo aggiornamento
})

// Tipi TypeScript derivati dagli schemi Zod
export type ExpenseType = z.infer<typeof ExpenseZSchema>;
export type ExpenseInputType = z.infer<typeof ExpenseInputZSchema>;
export type ExpenseDocument = ExpenseType & Document;

/**
 * SCHEMI PER LE RISPOSTE API
 */

// Schema per messaggi di successo delle operazioni
export const SuccessSchema = z.object({
  success: z.boolean(), // Indica se l'operazione è riuscita
  message: z.string() // Messaggio descrittivo del risultato
})

export type TSuccess = z.infer<typeof SuccessSchema>

// Schema per gli errori di validazione Zod
export const ZodErrorSchema = z.array(z.object({
  expected: z.string(), // Tipo di dato atteso
  code: z.string(), // Codice dell'errore
  path: z.array(z.string()), // Percorso del campo che ha generato l'errore
  message: z.string() // Messaggio descrittivo dell'errore
}));