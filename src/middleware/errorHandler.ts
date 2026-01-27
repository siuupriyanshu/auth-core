import type { Response, Request, NextFunction } from "express"

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        console.error({
            message: err.message,
            statusCode: err.statusCode,
            stack: err.stack
        })
    }

    console.error('Unexpected error:', err);

    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: 'Router not Found'
    })
};