/**
 * Brew Haven Café — Reservation Input Validation Middleware
 * Uses express-validator to sanitize and enforce business rules on booking payloads.
 */

const { body, validationResult } = require('express-validator');

/**
 * Helper to parse a time string like "08:00 AM" or "06:30 PM" into hours and minutes (24h format)
 */
function parseTimeString(timeStr) {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3] ? match[3].toUpperCase() : null;

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
}

/**
 * Validation rules for reservation creation
 */
const reservationValidationRules = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ min: 3, max: 100 }).withMessage('Full name must be between 3 and 100 characters.')
    .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Full name can only contain letters, spaces, dots, hyphens, and apostrophes.')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail({ gmail_remove_dots: false }),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .custom((value) => {
      // Strip all non-digit characters except leading '+'
      const cleaned = value.replace(/[^\d+]/g, '');
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        throw new Error('Phone number must contain between 10 and 15 digits.');
      }
      return true;
    }),

  body('resDate')
    .trim()
    .notEmpty().withMessage('Reservation date is required.')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Reservation date must follow the YYYY-MM-DD format.')
    .custom((value) => {
      const parts = value.split('-');
      const resDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (isNaN(resDate.getTime())) {
        throw new Error('Invalid reservation date.');
      }

      if (resDate < today) {
        throw new Error('Reservation date cannot be in the past. Please select today or a future date.');
      }

      // Maximum 60 days advance booking
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 60);
      if (resDate > maxDate) {
        throw new Error('Reservations can only be made up to 60 days in advance.');
      }

      return true;
    }),

  body('resTime')
    .trim()
    .notEmpty().withMessage('Preferred reservation time is required.')
    .custom((timeValue, { req }) => {
      const parsed = parseTimeString(timeValue);
      if (!parsed) {
        throw new Error('Invalid time format. Please select a valid dining time slot.');
      }

      // Check if reservation is for today, then time must be at least 30 minutes in the future
      const dateStr = req.body.resDate;
      if (dateStr) {
        const parts = dateStr.split('-');
        const now = new Date();
        const resYear = parseInt(parts[0], 10);
        const resMonth = parseInt(parts[1], 10) - 1;
        const resDay = parseInt(parts[2], 10);

        if (
          resYear === now.getFullYear() &&
          resMonth === now.getMonth() &&
          resDay === now.getDate()
        ) {
          const resDateTime = new Date(resYear, resMonth, resDay, parsed.hours, parsed.minutes);
          const minAllowedTime = new Date(now.getTime() + 15 * 60 * 1000); // at least 15 min buffer
          if (resDateTime < minAllowedTime) {
            throw new Error('Selected time slot has already passed or is too soon. Please select a slot at least 15 minutes in advance.');
          }
        }
      }

      return true;
    }),

  body('guests')
    .trim()
    .notEmpty().withMessage('Number of guests is required.')
    .isLength({ min: 1, max: 50 }).withMessage('Invalid guest selection.')
    .escape(),

  body('seatingArea')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Seating preference must not exceed 100 characters.')
    .escape(),

  body('specialRequests')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Special requests must not exceed 500 characters.')
    .escape(),
];

/**
 * Middleware to check validation results and return formatted error messages
 */
const validateReservation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: formattedErrors[0].message, // Top user-friendly message
      errors: formattedErrors,
    });
  }
  next();
};

module.exports = {
  reservationValidationRules,
  validateReservation,
};
