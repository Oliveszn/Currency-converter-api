import type { Request, Response, NextFunction } from "express";
import { ApiError, ValidationError, UnauthorizedError } from "../utils/errors";
import logger from "../utils/logger";
import type { ApiErrorResponse } from "../types";

interface ExtendedError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  errors?: any;
  code?: string;
  detail?: string;
  column?: string;
}

const handleApiError = (service: string, error: any) => {
  if (error.code === "ECONNABORTED") {
    return new ApiError(`${service} timeout - took too long to respond`, 504);
  } else if (error.response) {
    return new ApiError(
      `${service} error: ${error.response.status} - ${
        error.response.data?.["error-type"] || error.response.statusText
      }`,
      error.response.status
    );
  } else if (error.request) {
    return new ApiError(`Unable to reach ${service} - network error`, 503);
  } else {
    return new ApiError(`${service} service error: ${error.message}`, 500);
  }
};

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
    const apiError: ApiErrorResponse = {
      success: false,
      message: error.message || "An error occurred",
      error: error.name || "Error",
      timestamp: new Date().toISOString(),
      statusCode,
    };

    return res.status(statusCode).json(apiError);
  } else {
    const apiError: ApiErrorResponse = {
      success: false,
      message: "Something went wrong on our end. Please try again later.",
      error: "InternalServerError",
      timestamp: new Date().toISOString(),
      statusCode: 500,
    };

    return res.status(500).json(apiError);
  }
};

const asyncHandler = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export { handleApiError, errorHandler, asyncHandler };
