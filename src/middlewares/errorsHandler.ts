import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { TSuccess } from '../types';

export const errorsHandler = (
    error: unknown,
    req: Request,
    res: Response<TSuccess<null>>,
    next: NextFunction
) => {
    // Gestione errori Zod
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: error.issues.map(issue =>
                `ZodError: ${issue.path.join('.')}: ${issue.message}`
            ).join(', '),
            data: null
        });
    }

    // Errori standard
    if (error instanceof Error) {
        return res.status(400).json({
            success: false,
            message: `Error: ${error.message}`,
            data: null
        });
    }

    // Errori sconosciuti
    return res.status(400).json({
        success: false,
        message: "Errore sconosciuto",
        data: null
    });
}