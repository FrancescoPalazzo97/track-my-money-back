import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { TResponse } from '../models';

export const errorsHandler = (
    error: unknown,
    req: Request,
    res: Response<TResponse>,
    next: NextFunction
) => {
    // Gestione errori Zod
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: error.issues.map(issue =>
                `${issue.path.join('.')}: ${issue.message}`
            ).join(', ')
        });
    }

    // Errori standard
    if (error instanceof Error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    // Errori sconosciuti
    return res.status(500).json({
        success: false,
        message: "Errore sconosciuto"
    });
}