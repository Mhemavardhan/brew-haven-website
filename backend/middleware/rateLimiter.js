/**
 * Brew Haven Café — Rate Limiting Middleware
 * Protects endpoints from abuse, denial-of-service, and spam reservation requests.
 */

const rateLimit = require('express-rate-limit');

/**
 * Strict rate limiter for POST /api/reservations
 * Allows up to 15 reservation submissions per 15 minutes per IP address.
 */
const reservationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many reservation requests submitted from your network. Please wait a few minutes before trying again.',
      retryAfterSeconds: Math.ceil(15 * 60),
    });
  },
});

/**
 * General API rate limiter for health checks and status queries
 */
const generalApiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // 100 requests per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  reservationRateLimiter,
  generalApiLimiter,
};
