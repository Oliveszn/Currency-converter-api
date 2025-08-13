import type { Request, Response, NextFunction } from "express";
import {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ConflictError,
} from "../utils/errors";
import logger from "../utils/logger";

interface ExtendedError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  errors?: any;
  code?: string;
  detail?: string;
  column?: string;
}

const errorHandler = (
  err: ExtendedError | undefined,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default to 500 if no status code set

  if (!err) {
    err = new ApiError("Unknown error occurred", 500);
  }

  // Create a working copy of the error
  let error: ExtendedError = err;

  // Log the error for debugging (consider using a logger like Winston)

  logger.error("ERROR 💥:", {
    timestamp: new Date().toISOString(),
    method: req?.method || "UNKNOWN",
    url: req?.originalUrl || "UNKNOWN",
    ip: req?.ip || "UNKNOWN",
    userAgent: req?.get?.("User-Agent") || "UNKNOWN",
    error: {
      name: err.name || "Error",
      message: err.message || "Unknown error",
      stack: err.stack || "No stack trace",
      statusCode: err.statusCode || 500,
      code: err.code || null,
    },
  });

  // Handle PostgreSQL specific errors
  if (err.code) {
    switch (err.code) {
      // Unique violation (duplicate key)
      case "23505":
        const field = err.detail?.match(/Key \((.+?)\)=/)?.[1] || "field";
        error = new ConflictError(`${field} already exists`);
        break;

      // Not null violation
      case "23502":
        const column = err.column || "required field";
        error = new ValidationError(`${column} is required`);
        break;

      // Foreign key violation
      case "23503":
        error = new ValidationError("Referenced record does not exist");
        break;

      // Check constraint violation
      case "23514":
        error = new ValidationError("Data violates database constraints");
        break;

      // Invalid input syntax
      case "22P02":
        error = new ValidationError("Invalid data format");
        break;

      // Connection errors
      case "ECONNREFUSED":
      case "ENOTFOUND":
      case "ETIMEDOUT":
        error = new ApiError("Database connection failed", 500);
        error.isOperational = false;
        break;
    }
  }

  // Special handling for common error types
  if (err.name === "ValidationError") {
    error = new ValidationError("Validation failed", err.errors);
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    error = new UnauthorizedError("Invalid token. Please log in again");
  }
  if (err.name === "TokenExpiredError") {
    error = new UnauthorizedError("Token expired. Please log in again");
  }

  const statusCode = error.statusCode || 500;
  // Determine the response based on environment
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      error: {
        name: error.name || err.name || "Error",
        message: error.message || err.message || "Unknown error",
        statusCode: statusCode,
        stack: error.stack || err.stack,
        ...(error.errors && { errors: error.errors }),
        ...(err.code && { code: err.code }),
      },
      request: {
        method: req?.method || "UNKNOWN",
        url: req?.originalUrl || "UNKNOWN",
      },
    });
  }

  // Production mode
  if (error.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message: error.message || "An error occurred",
      ...(error.errors && { errors: error.errors }),
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again later.",
    });
  }
};

const asyncHandler = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export { errorHandler, asyncHandler };
