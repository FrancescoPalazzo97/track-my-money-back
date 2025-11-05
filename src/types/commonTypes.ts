import { Types } from "mongoose";
import z from "zod";

/**
 * Codici di valuta supportati
 * Include valute fiat e criptovalute
 */
export const codes = [
    'ADA', 'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARB', 'ARS', 'AUD', 'AVAX', 'AWG', 'AZN',
    'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BNB', 'BND', 'BOB', 'BRL', 'BSD', 'BTC', 'BTN', 'BWP', 'BYN', 'BYR', 'BZD',
    'CAD', 'CDF', 'CHF', 'CLF', 'CLP', 'CNY', 'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK',
    'DAI', 'DJF', 'DKK', 'DOP', 'DZD',
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

export const CodesSchema = z.enum(codes);
export type TCodes = z.infer<typeof CodesSchema>;

const createObjectIdZSchema = () => z
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

export const objectIdZSchema = createObjectIdZSchema();

// Schema per messaggi di successo
const SuccessSchema = z.object({
    success: z.boolean(), // Successo operazione
    message: z.string() // Messaggio descrittivo
});

export type TSuccess<T> = {
    success: boolean,
    message: string,
    data: T
}