import z from "zod";
import { objectIdSchema } from "./";

/**
 * SCHEMI E TIPI PER LE CATEGORIE
 */
// Schema per input categoria
export const CategoryInputZSchema = z.object({
    name: z.string().trim().min(1).max(50), // Nome della categoria
    type: z.enum(['income', 'expense']), // Tipo: income o expense
    description: z.string().max(200).optional(), // Descrizione opzionale
    parentCategory: objectIdSchema.optional() // ID categoria padre
});

// Schema categoria completo
const CategoryZSchema = CategoryInputZSchema.extend({
    createdAt: z.date(), // Data creazione
    updatedAt: z.date() // Data aggiornamento
});

export const CategoryInputZSchemaForPatch = CategoryInputZSchema
    .partial()
    .strict();

// Tipi TypeScript
type TCategory = z.infer<typeof CategoryZSchema>;
export type TCategoryInput = z.infer<typeof CategoryInputZSchema>;
export type CategoryDocument = TCategory & Document;