// Custom error class for application errors
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response utility
export const sendErrorResponse = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  // Log error for debugging (in production, use proper logging service)
  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    statusCode,
    url: res.req?.originalUrl,
    method: res.req?.method,
    ip: res.req?.ip,
    userAgent: res.req?.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    success: false,
    status: error.status || "error",
    message,
    ...(isDevelopment && {
      stack: error.stack,
      error: error,
    }),
  });
};

// Async error handler wrapper
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Global error handler middleware
export const globalErrorHandler = (err, req, res, next) => {
  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    return sendErrorResponse(res, new AppError(message, 404));
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    return sendErrorResponse(res, new AppError(message, 400));
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message);
    const message = `Invalid input data: ${errors.join(". ")}`;
    return sendErrorResponse(res, new AppError(message, 400));
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again.";
    return sendErrorResponse(res, new AppError(message, 401));
  }

  if (err.name === "TokenExpiredError") {
    const message = "Your token has expired. Please log in again.";
    return sendErrorResponse(res, new AppError(message, 401));
  }

  // Send operational errors as they are
  if (err.isOperational) {
    return sendErrorResponse(res, err);
  }

  // Programming or other unknown errors: don't leak error details
  console.error("ERROR 💥", err);
  sendErrorResponse(res, new AppError("Something went wrong!", 500));
};
