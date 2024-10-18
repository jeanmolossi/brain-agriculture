import type { Request, Response, NextFunction } from "express";
import ApiError from "../errors/error";

export default function errorHandler(
  err: Error,
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  if (!err) {
    next();
    return;
  }

  const message = err.message;
  if (err instanceof ApiError) {
    response.status(err.statusCode).json({
      status_code: err.statusCode,
      error: err.message,
      errors: err.errors,
    });
    return;
  }

  response.status(500).json({
    status_code: 500,
    error: message,
  });
  return;
}
