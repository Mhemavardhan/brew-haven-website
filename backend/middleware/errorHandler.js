/**
 * Brew Haven Café — Centralized Error Handling Middleware
 * Manages 404 Route Not Found errors and unhandled exceptions gracefully.
 */

/**
 * 404 Route Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Global Error Handler
 */
const globalErrorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const statusCode = err.status || err.statusCode || 500;

  console.error(`✕ [Server Error ${statusCode}]:`, err.message);
  if (isDev && err.stack) {
    console.error(err.stack);
  }

  // Handle CORS Origin Not Allowed errors
  if (err.message && err.message.includes('CORS origin blocked')) {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: Request origin is not permitted by CORS policy.',
    });
  }

  // Handle JSON parsing syntax errors in body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload provided.',
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred. Please try again later.',
    ...(isDev && { errorStack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
