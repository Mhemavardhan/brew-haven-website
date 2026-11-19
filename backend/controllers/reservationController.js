/**
 * Brew Haven Café — Reservation Controller
 * Handles booking requests, generates reference codes, triggers automated emails,
 * and delivers structured JSON responses.
 */

const emailService = require('../services/emailService');
const { isConfigured, ownerEmail, cafeName } = require('../config/emailConfig');

/**
 * Generate a unique and memorable booking reference code
 * Example: "BH-784291"
 */
function generateBookingReference() {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `BH-${randomDigits}`;
}

/**
 * POST /api/reservations
 * Creates a new reservation and triggers automated notifications
 */
const createReservation = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      resDate,
      resTime,
      guests,
      seatingArea,
      specialRequests,
    } = req.body;

    // Generate unique booking reference
    const bookingReference = generateBookingReference();
    const createdAt = new Date().toISOString();

    const reservationData = {
      bookingReference,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      resDate: resDate.trim(),
      resTime: resTime.trim(),
      guests: guests.trim(),
      seatingArea: seatingArea ? seatingArea.trim() : 'Standard',
      specialRequests: specialRequests ? specialRequests.trim() : '',
      createdAt,
    };

    console.log(`\n🛎️  [New Reservation Request]: ${bookingReference} for ${reservationData.fullName} on ${reservationData.resDate} at ${reservationData.resTime}`);

    // If SMTP credentials are not yet configured (e.g. fresh clone with placeholders),
    // provide an informative warning response instead of failing silently
    if (!isConfigured) {
      console.warn(
        `⚠️  [Reservation Warning]: Email service is not fully configured with live Gmail credentials in .env. Simulating reservation ${bookingReference} for test purposes.`
      );

      return res.status(201).json({
        success: true,
        message: 'Table reservation received successfully! (Note: Running in test mode - configure live Gmail credentials in .env to receive real emails).',
        bookingReference,
        data: reservationData,
        emailStatus: {
          ownerEmailSent: false,
          customerEmailSent: false,
          note: 'SMTP credentials pending configuration in .env',
        },
      });
    }

    // Dispatch automated emails to owner and customer concurrently
    const emailResults = await emailService.sendReservationEmails(reservationData);

    // If both emails failed due to SMTP connection/auth issues
    if (!emailResults.ownerEmailSent && !emailResults.customerEmailSent) {
      return res.status(500).json({
        success: false,
        message: 'Your reservation was received, but we encountered an issue delivering your confirmation emails. Please reach out to the café directly at ' + ownerEmail,
        bookingReference,
        data: reservationData,
        errors: emailResults.errors,
      });
    }

    // Success response (HTTP 201 Created)
    return res.status(201).json({
      success: true,
      message: 'Your table reservation is confirmed! Confirmation emails have been sent to your registered email and the café owner.',
      bookingReference,
      data: reservationData,
      emailStatus: {
        ownerEmailSent: emailResults.ownerEmailSent,
        customerEmailSent: emailResults.customerEmailSent,
        ownerRecipient: ownerEmail,
        customerRecipient: reservationData.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/health
 * Public health check and service status diagnostic endpoint
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'online',
    service: `${cafeName} Reservation Backend`,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    emailConfigured: isConfigured,
  });
};

module.exports = {
  createReservation,
  getHealth,
};
