import type { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred!' });
}           

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: 'Resource not found' });
}