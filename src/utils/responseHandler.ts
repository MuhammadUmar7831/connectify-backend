import { NextFunction, Request, Response } from "express";

interface ErrorResponse extends Error {
  statusCode?: number;
}

// Just to standardize the response
export function response(data: any, message?: string) {
  return {
    success: true,
    data,
    message,
  };
}

export const errorResponse = (statusCode: number, message: string) => {
  const error: ErrorResponse = new Error();
  error.statusCode = statusCode;
  error.message = message;
  throw error;
};

export function tryCatch(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function errorResponseHandler(
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.statusCode || 500;

  // Default error handler
  const message = err.message || "Internal Server Error";
  res.status(status).json({ success: false, message });
}
