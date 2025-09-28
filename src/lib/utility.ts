import { TResponse, ZodErrorSchema } from "../models";

export function formatZodMessage(message: string): string {
    const result = ZodErrorSchema.safeParse(JSON.parse(message));
    if (!result.success) {
        return message;
    } else {
        return result.data.map(m => `${m.path.join('.')}: ${m.message}`).join(', ');
    }
};

export function resultMessage(success: boolean, message: string): TResponse {
    if (!success) {
        return {
            success,
            message: formatZodMessage(message)
        };
    };
    return {
        success,
        message
    };
};