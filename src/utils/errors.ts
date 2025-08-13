export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  status: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class ValidationError extends ApiError {
  errors: unknown;
  constructor(message: string, errors = null) {
    super(message, 400);
    this.errors = errors;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409);
  }
}
