import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error";
import { isProduction } from "../config/env";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      message: "Validation failed",
      errors: err.flatten().fieldErrors
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details
    });
  }

  const message = err instanceof Error ? err.message : "Unexpected server error";
  return res.status(500).json({
    message: isProduction ? "Unexpected server error" : message
  });
}
