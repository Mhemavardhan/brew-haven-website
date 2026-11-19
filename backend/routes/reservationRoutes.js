/**
 * Brew Haven Café — Reservation Routes
 * Defines API routing, input validation chains, rate limiting, and controller mappings.
 */

const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');
const {
  reservationValidationRules,
  validateReservation,
} = require('../middleware/validator');
const {
  reservationRateLimiter,
  generalApiLimiter,
} = require('../middleware/rateLimiter');

/**
 * @route   POST /api/reservations
 * @desc    Submit a new table reservation and trigger automated email notifications
 * @access  Public
 */
router.post(
  '/',
  reservationRateLimiter,
  reservationValidationRules,
  validateReservation,
  reservationController.createReservation
);

/**
 * @route   GET /api/reservations/health
 * @desc    Check reservation service status
 * @access  Public
 */
router.get('/health', generalApiLimiter, reservationController.getHealth);

module.exports = router;
