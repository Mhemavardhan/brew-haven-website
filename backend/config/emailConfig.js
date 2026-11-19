/**
 * Brew Haven Café — Email Configuration Module
 * Manages Nodemailer transporter and Gmail SMTP connectivity.
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

// Validate critical email configuration parameters
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const isConfigured = Boolean(
  emailUser &&
  emailPass &&
  !emailUser.includes('yourcafegmail') &&
  !emailPass.includes('your-16-char')
);

// Create reusable Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT, 10) || 465,
  secure: process.env.EMAIL_SECURE !== 'false', // true for 465, false for other ports
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  pool: true, // Reuse connections for high performance
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000,
});

/**
 * Verifies SMTP connection and credentials
 * Logs status without halting application startup
 */
const verifyEmailConnection = async () => {
  if (!isConfigured) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      '⚠️  [Email Config Notice]: Gmail credentials in .env are using placeholder values. Real emails will fail until EMAIL_USER and EMAIL_PASS (App Password) are configured.'
    );
    return false;
  }

  try {
    await transporter.verify();
    console.log(
      '\x1b[32m%s\x1b[0m',
      '✓  [Email Config]: Gmail SMTP connection verified successfully.'
    );
    return true;
  } catch (error) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      `✕  [Email Config Error]: Failed to authenticate with Gmail SMTP: ${error.message}`
    );
    console.error(
      '\x1b[33m%s\x1b[0m',
      '💡 Tip: Make sure you are using a 16-character Google App Password (not your personal password), with 2-Step Verification enabled.'
    );
    return false;
  }
};

module.exports = {
  transporter,
  verifyEmailConnection,
  isConfigured,
  ownerEmail: process.env.OWNER_EMAIL || emailUser,
  cafeName: process.env.CAFE_NAME || 'Brew Haven Café',
  cafePhone: process.env.CAFE_PHONE || '+91 98765 43210',
  cafeAddress: process.env.CAFE_ADDRESS || '742 Evergreen Terrace, Downtown',
  cafeWebsite: process.env.CAFE_WEBSITE || 'https://mhemavardhan.github.io/brew-haven-website/',
};
