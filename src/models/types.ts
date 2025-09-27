import { Document, Types, Schema, model } from "mongoose";
import z from "zod";

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

export const CategoryZSchema = z.object({
  name: z.string(),
  type: z.enum(['income', 'expense']),
  description: z.string().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export type CategoryType = z.infer<typeof CategoryZSchema>;
export type CategoryDocument = CategoryType & Document;

export const ExpenseZSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(100).optional(),
  expenseDate: z.iso.datetime(),
  amount: z.number().positive(),
  currency: z.enum(codes),
  convertedAmount: z.array(z.string()),
  category: Types.ObjectId,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export type ExpenseType = z.infer<typeof ExpenseZSchema>;
export type ExpenseDocument = ExpenseType & Document;