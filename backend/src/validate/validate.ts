import { ZodType,  } from "zod";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler";

export const validate =
  (schema: ZodType<unknown>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      throw new AppError(
        err.errors?.[0]?.message ?? "Invalid request body",
        400
      );
    }
  };
