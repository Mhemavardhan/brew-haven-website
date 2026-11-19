/**
 * Brew Haven Café — Email Notification Service
 * Generates café-branded HTML & plain-text email templates and sends them via Gmail SMTP.
 */

const {
  transporter,
  ownerEmail,
  cafeName,
  cafePhone,
  cafeAddress,
  cafeWebsite,
} = require('../config/emailConfig');

/**
 * Format date string into human-friendly format (e.g. "Friday, November 20, 2026")
 */
function formatDate(dateStr) {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return dateStr;
  } catch (err) {
    return dateStr;
  }
}

/**
 * Generate HTML template for the Café Owner Notification Email
 */
function generateOwnerEmailTemplate(reservation) {
  const {
    bookingReference,
    fullName,
    email,
    phone,
    resDate,
    resTime,
    guests,
    seatingArea,
    specialRequests,
    createdAt,
  } = reservation;

  const formattedDate = formatDate(resDate);
  const formattedCreated = new Date(createdAt || Date.now()).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Table Reservation – ${cafeName}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F7F3EE;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2D241E;
      line-height: 1.6;
    }
    .wrapper {
      width: 100%;
      background-color: #F7F3EE;
      padding: 30px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(43, 24, 16, 0.08);
      border: 1px solid #EADBCC;
    }
    .header {
      background: linear-gradient(135deg, #2B1810 0%, #43281C 100%);
      padding: 32px 24px;
      text-align: center;
      color: #FAF5EE;
    }
    .header-tag {
      display: inline-block;
      background-color: #D4A373;
      color: #2B1810;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 10px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #FAF5EE;
    }
    .header p {
      margin: 8px 0 0;
      font-size: 14px;
      color: #E6CCB2;
    }
    .content {
      padding: 30px 24px;
    }
    .ref-badge {
      background-color: #FAF6F0;
      border-left: 4px solid #D4A373;
      padding: 14px 18px;
      border-radius: 6px;
      margin-bottom: 24px;
    }
    .ref-badge p {
      margin: 0;
      font-size: 13px;
      color: #7F5539;
    }
    .ref-badge strong {
      font-size: 18px;
      color: #2B1810;
      letter-spacing: 1px;
    }
    .table-details {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .table-details th, .table-details td {
      padding: 12px 14px;
      text-align: left;
      border-bottom: 1px solid #F0E6DC;
      font-size: 14px;
    }
    .table-details th {
      width: 36%;
      color: #7F5539;
      font-weight: 600;
      background-color: #FAF7F2;
    }
    .table-details td {
      color: #2B1810;
      font-weight: 500;
    }
    .special-notes-box {
      background-color: #FFF9F2;
      border: 1px dashed #D4A373;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 24px;
    }
    .special-notes-box h4 {
      margin: 0 0 6px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #9C6644;
    }
    .special-notes-box p {
      margin: 0;
      font-size: 14px;
      color: #43281C;
      font-style: italic;
    }
    .action-buttons {
      text-align: center;
      padding: 10px 0 20px;
    }
    .btn {
      display: inline-block;
      padding: 12px 22px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      margin: 0 6px 10px;
    }
    .btn-primary {
      background-color: #D4A373;
      color: #2B1810 !important;
    }
    .btn-secondary {
      background-color: #FAF6F0;
      color: #43281C !important;
      border: 1px solid #D4A373;
    }
    .footer {
      background-color: #FAF5EE;
      padding: 20px 24px;
      text-align: center;
      border-top: 1px solid #EADBCC;
      font-size: 12px;
      color: #7F5539;
    }
    .footer p {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <span class="header-tag">Admin Booking Alert</span>
        <h1>BREW HAVEN CAFÉ</h1>
        <p>NEW TABLE RESERVATION RECEIVED</p>
      </div>

      <div class="content">
        <div class="ref-badge">
          <p>Booking Reference Number:</p>
          <strong>${bookingReference}</strong>
        </div>

        <table class="table-details">
          <tr>
            <th>Customer Name:</th>
            <td><strong>${fullName}</strong></td>
          </tr>
          <tr>
            <th>Customer Email:</th>
            <td><a href="mailto:${email}" style="color: #9C6644; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <th>Phone Number:</th>
            <td><a href="tel:${phone}" style="color: #9C6644; text-decoration: none;">${phone}</a></td>
          </tr>
          <tr>
            <th>Reservation Date:</th>
            <td><strong>${formattedDate}</strong> (${resDate})</td>
          </tr>
          <tr>
            <th>Reservation Time:</th>
            <td><strong>${resTime}</strong></td>
          </tr>
          <tr>
            <th>Number of Guests:</th>
            <td>${guests}</td>
          </tr>
          <tr>
            <th>Seating Preference:</th>
            <td>${seatingArea || 'Standard / No Preference'}</td>
          </tr>
          <tr>
            <th>Booking Received:</th>
            <td>${formattedCreated}</td>
          </tr>
        </table>

        ${
          specialRequests
            ? `
        <div class="special-notes-box">
          <h4>Special Requests / Notes:</h4>
          <p>"${specialRequests}"</p>
        </div>`
            : `
        <div class="special-notes-box" style="border-style: solid; border-color: #EADBCC; background-color: #FAF7F2;">
          <h4>Special Requests:</h4>
          <p style="color: #8C786A; font-style: normal;">None specified.</p>
        </div>`
        }

        <div class="action-buttons">
          <a href="mailto:${email}?subject=Regarding%20Your%20Reservation%20at%20Brew%20Haven%20Café%20(${bookingReference})" class="btn btn-primary">✉️ Email Customer</a>
          <a href="tel:${phone}" class="btn btn-secondary">📞 Call Customer</a>
        </div>
      </div>

      <div class="footer">
        <p><strong>${cafeName} Management Dashboard</strong></p>
        <p>${cafeAddress} • Phone: ${cafePhone}</p>
        <p style="color: #A68A78; font-size: 11px;">This automated reservation notification was generated via ${cafeName} Online Booking System.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate plain-text version for Owner Notification
 */
function generateOwnerPlainText(reservation) {
  const {
    bookingReference,
    fullName,
    email,
    phone,
    resDate,
    resTime,
    guests,
    seatingArea,
    specialRequests,
  } = reservation;

  return `
========================================
BREW HAVEN CAFÉ
NEW TABLE RESERVATION
========================================

Booking Reference: ${bookingReference}

Customer Name:      ${fullName}
Customer Email:     ${email}
Phone Number:       ${phone}
Reservation Date:   ${formatDate(resDate)} (${resDate})
Reservation Time:   ${resTime}
Number of Guests:   ${guests}
Seating Preference: ${seatingArea || 'No Preference'}
Special Requests:   ${specialRequests || 'None'}

----------------------------------------
Please prepare the table accordingly.
${cafeName} Online Reservation Engine
========================================
  `.trim();
}

/**
 * Generate HTML template for Customer Confirmation Email
 */
function generateCustomerEmailTemplate(reservation) {
  const {
    bookingReference,
    fullName,
    resDate,
    resTime,
    guests,
    seatingArea,
    specialRequests,
  } = reservation;

  const formattedDate = formatDate(resDate);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Table Reservation is Confirmed – ${cafeName}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F7F3EE;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2D241E;
      line-height: 1.6;
    }
    .wrapper {
      width: 100%;
      background-color: #F7F3EE;
      padding: 30px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(43, 24, 16, 0.08);
      border: 1px solid #EADBCC;
    }
    .header {
      background: linear-gradient(135deg, #2B1810 0%, #43281C 100%);
      padding: 36px 24px;
      text-align: center;
      color: #FAF5EE;
    }
    .header-badge {
      display: inline-block;
      background-color: #2ECC71;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 20px;
      margin-bottom: 12px;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      color: #FAF5EE;
    }
    .header p {
      margin: 8px 0 0;
      font-size: 14px;
      color: #E6CCB2;
    }
    .content {
      padding: 32px 26px;
    }
    .greeting {
      font-size: 17px;
      color: #2B1810;
      margin-bottom: 18px;
    }
    .intro-text {
      font-size: 14px;
      color: #5C4A3E;
      margin-bottom: 24px;
    }
    .booking-card {
      background: linear-gradient(135deg, #FFFDF9 0%, #FAF6F0 100%);
      border: 2px solid #D4A373;
      border-radius: 10px;
      padding: 22px;
      margin-bottom: 26px;
      text-align: center;
    }
    .booking-card .ref-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #7F5539;
      margin: 0 0 6px;
      font-weight: 600;
    }
    .booking-card .ref-code {
      font-size: 26px;
      font-weight: 800;
      color: #2B1810;
      letter-spacing: 2px;
      font-family: 'Courier New', Courier, monospace;
      margin: 0;
    }
    .booking-card .ref-hint {
      font-size: 12px;
      color: #9C6644;
      margin: 8px 0 0;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 26px;
    }
    .details-table th, .details-table td {
      padding: 12px 14px;
      text-align: left;
      border-bottom: 1px solid #F0E6DC;
      font-size: 14px;
    }
    .details-table th {
      width: 40%;
      color: #7F5539;
      font-weight: 600;
      background-color: #FAF7F2;
    }
    .details-table td {
      color: #2B1810;
      font-weight: 500;
    }
    .info-box {
      background-color: #F8F9FA;
      border-left: 4px solid #D4A373;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 26px;
      font-size: 13px;
      color: #555555;
    }
    .info-box ul {
      margin: 6px 0 0;
      padding-left: 20px;
    }
    .info-box li {
      margin-bottom: 4px;
    }
    .cta-container {
      text-align: center;
      margin: 28px 0 10px;
    }
    .cta-btn {
      display: inline-block;
      background-color: #2B1810;
      color: #FAF5EE !important;
      text-decoration: none;
      padding: 13px 28px;
      border-radius: 30px;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.5px;
    }
    .footer {
      background-color: #FAF5EE;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #EADBCC;
      font-size: 12px;
      color: #7F5539;
    }
    .footer p {
      margin: 4px 0;
    }
    .social-links {
      margin: 12px 0 6px;
    }
    .social-links a {
      color: #D4A373;
      text-decoration: none;
      margin: 0 8px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <span class="header-badge">✓ Confirmed</span>
        <h1>${cafeName}</h1>
        <p>YOUR COZY SPOT IS WAITING FOR YOU</p>
      </div>

      <div class="content">
        <p class="greeting">Dear <strong>${fullName}</strong>,</p>

        <p class="intro-text">
          Thank you for choosing <strong>${cafeName}</strong>! We are delighted to confirm that your table reservation has been successfully booked. Our team is ready to welcome you with our freshly roasted single-origin brews, handcrafted beverages, and artisanal treats.
        </p>

        <div class="booking-card">
          <p class="ref-label">Booking Reference Number</p>
          <p class="ref-code">${bookingReference}</p>
          <p class="ref-hint">Please present this reference number upon your arrival.</p>
        </div>

        <table class="details-table">
          <tr>
            <th>Guest Name:</th>
            <td><strong>${fullName}</strong></td>
          </tr>
          <tr>
            <th>Reservation Date:</th>
            <td><strong>${formattedDate}</strong></td>
          </tr>
          <tr>
            <th>Reservation Time:</th>
            <td><strong>${resTime}</strong></td>
          </tr>
          <tr>
            <th>Party Size:</th>
            <td>${guests}</td>
          </tr>
          <tr>
            <th>Seating Zone:</th>
            <td>${seatingArea || 'Standard'}</td>
          </tr>
          ${
            specialRequests
              ? `
          <tr>
            <th>Special Notes:</th>
            <td>${specialRequests}</td>
          </tr>`
              : ''
          }
        </table>

        <div class="info-box">
          <strong>Important Reservation Policies:</strong>
          <ul>
            <li><strong>Grace Period:</strong> Your reserved table will be held for up to <strong>15 minutes</strong> past your scheduled arrival time.</li>
            <li><strong>Modifications or Cancellations:</strong> Need to reschedule or cancel? Simply reply to this email or call us at <a href="tel:${cafePhone}" style="color: #9C6644; font-weight: 600;">${cafePhone}</a> at least 1 hour in advance.</li>
            <li><strong>Ambiance:</strong> Free high-speed Wi-Fi and power outlets are available in designated work zones.</li>
          </ul>
        </div>

        <div class="cta-container">
          <a href="${cafeWebsite}#menu" class="cta-btn">☕ Explore Our Coffee Menu</a>
        </div>
      </div>

      <div class="footer">
        <p><strong>${cafeName}</strong></p>
        <p>${cafeAddress} • Phone: ${cafePhone}</p>
        <div class="social-links">
          <a href="${cafeWebsite}">Website</a> •
          <a href="${cafeWebsite}#location">Directions</a> •
          <a href="${cafeWebsite}#contact">Contact</a>
        </div>
        <p style="color: #A68A78; font-size: 11px; margin-top: 12px;">© 2026 ${cafeName}. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate plain-text version for Customer Confirmation
 */
function generateCustomerPlainText(reservation) {
  const {
    bookingReference,
    fullName,
    resDate,
    resTime,
    guests,
    seatingArea,
    specialRequests,
  } = reservation;

  return `
========================================
${cafeName.toUpperCase()}
TABLE RESERVATION CONFIRMED
========================================

Dear ${fullName},

Thank you for choosing ${cafeName}! Your table reservation has been successfully confirmed.

RESERVATION DETAILS:
----------------------------------------
Booking Reference:   ${bookingReference}
Date:                ${formatDate(resDate)} (${resDate})
Time:                ${resTime}
Party Size:          ${guests}
Seating Preference:  ${seatingArea || 'Standard'}
${specialRequests ? `Special Requests:    ${specialRequests}\n` : ''}
IMPORTANT NOTES:
- Tables are held for 15 minutes past scheduled time.
- To cancel or modify, please call us at ${cafePhone}.

Café Address: ${cafeAddress}
Phone: ${cafePhone}
Website: ${cafeWebsite}

We look forward to serving you!
Warm regards,
The ${cafeName} Team
========================================
  `.trim();
}

/**
 * Send owner notification email
 */
async function sendOwnerNotification(reservation) {
  const mailOptions = {
    from: `"${cafeName} Bookings" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    subject: `New Table Reservation – ${cafeName}`,
    text: generateOwnerPlainText(reservation),
    html: generateOwnerEmailTemplate(reservation),
    replyTo: reservation.email,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send customer confirmation email
 */
async function sendCustomerConfirmation(reservation) {
  const mailOptions = {
    from: `"${cafeName}" <${process.env.EMAIL_USER}>`,
    to: reservation.email,
    subject: `Your Table Reservation is Confirmed – ${cafeName}`,
    text: generateCustomerPlainText(reservation),
    html: generateCustomerEmailTemplate(reservation),
    replyTo: ownerEmail,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Coordinates sending both owner and customer emails concurrently.
 * Returns results object detailing delivery status.
 */
async function sendReservationEmails(reservation) {
  const results = {
    ownerEmailSent: false,
    customerEmailSent: false,
    errors: [],
  };

  // Run both email dispatches concurrently
  const [ownerResult, customerResult] = await Promise.allSettled([
    sendOwnerNotification(reservation),
    sendCustomerConfirmation(reservation),
  ]);

  if (ownerResult.status === 'fulfilled') {
    results.ownerEmailSent = true;
    console.log(`✓ [Owner Email]: Delivered to ${ownerEmail} for booking ${reservation.bookingReference}`);
  } else {
    const errMsg = `Failed to send owner notification: ${ownerResult.reason.message}`;
    console.error(`✕ [Owner Email Error]:`, errMsg);
    results.errors.push(errMsg);
  }

  if (customerResult.status === 'fulfilled') {
    results.customerEmailSent = true;
    console.log(`✓ [Customer Email]: Delivered to ${reservation.email} for booking ${reservation.bookingReference}`);
  } else {
    const errMsg = `Failed to send customer confirmation: ${customerResult.reason.message}`;
    console.error(`✕ [Customer Email Error]:`, errMsg);
    results.errors.push(errMsg);
  }

  return results;
}

module.exports = {
  sendReservationEmails,
  sendOwnerNotification,
  sendCustomerConfirmation,
  formatDate,
};
