# Brew Haven Café — Backend Reservation API

Production-ready Node.js and Express backend service with automated Gmail SMTP notifications for the [Brew Haven Café Website](https://mhemavardhan.github.io/brew-haven-website/).

---

## ☕ Key Capabilities

1. **Automated Owner Notification:** Whenever a customer books a table, full reservation details (guest name, email, phone, date, time, party size, seating zone, and special notes) are emailed to the café owner's Gmail.
2. **Customer Booking Confirmation:** Customers receive a confirmation email with a unique booking reference number (`BH-XXXXXX`), table details, and grace period guidelines.
3. **Robust Input Validation:** Enforces strict sanitization and validation on all inputs (names, dates, future time slots, 10–15 digit phone numbers, and emails) using `express-validator`.
4. **Security & Protection:** Equipped with `helmet` HTTP security headers, CORS origin protection (configured for GitHub Pages), and rate limiting (`express-rate-limit`) to prevent spam.
5. **Zero UI Disruption:** Integrates with the existing Brew Haven frontend without changing existing design, styling, or responsive layouts.

---

## 📁 Project Directory Structure

```
backend/
├── server.js                        # Main Express server entry point & CORS configuration
├── package.json                     # Dependencies, metadata, and scripts
├── .env                             # Local environment secrets (not committed to Git)
├── .env.example                     # Environment template for Render and deployment
├── config/
│   └── emailConfig.js               # Nodemailer transporter & Gmail SMTP configuration
├── controllers/
│   └── reservationController.js     # Booking logic, reference generator, and response handling
├── routes/
│   └── reservationRoutes.js         # API endpoints & middleware routing
├── services/
│   └── emailService.js              # Café-branded responsive HTML & text email templates
└── middleware/
    ├── validator.js                 # Input validation & future-date enforcement rules
    ├── rateLimiter.js               # Anti-spam request throttling
    └── errorHandler.js              # Centralized 404 & global exception handler
```

---

## 🚀 API Endpoints

### 1. Submit Table Reservation
* **Endpoint:** `POST /api/reservations`
* **Content-Type:** `application/json`
* **Payload Example:**
  ```json
  {
    "fullName": "Alex Morgan",
    "email": "alex.morgan@example.com",
    "phone": "9876543210",
    "resDate": "2026-11-25",
    "resTime": "06:30 PM",
    "guests": "2 Guests",
    "seatingArea": "Window View",
    "specialRequests": "Near power outlet if possible"
  }
  ```
* **Success Response (HTTP 201 Created):**
  ```json
  {
    "success": true,
    "message": "Your table reservation is confirmed! Confirmation emails have been sent to your registered email and the café owner.",
    "bookingReference": "BH-481920",
    "data": { ... },
    "emailStatus": {
      "ownerEmailSent": true,
      "customerEmailSent": true,
      "ownerRecipient": "brewhaven.reservations@gmail.com",
      "customerRecipient": "alex.morgan@example.com"
    }
  }
  ```

### 2. Health & Diagnostic Check
* **Endpoint:** `GET /api/health`
* **Response (HTTP 200 OK):**
  ```json
  {
    "status": "ok",
    "uptime": 124.5,
    "timestamp": "2026-11-19T12:00:00.000Z",
    "emailReady": true
  }
  ```

---

## 🛠️ Local Development on macOS

### 1. Install Node.js (If not already installed)
Download and install Node.js LTS (version 18 or 20+) from [nodejs.org](https://nodejs.org/), or via Homebrew:
```bash
brew install node
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in:
* `EMAIL_USER`: Your Gmail address
* `EMAIL_PASS`: Your 16-character Google App Password (see instructions below)
* `OWNER_EMAIL`: The recipient Gmail address for reservation notices

### 4. Start the Server
* **Standard Start:**
  ```bash
  npm start
  ```
* **Development Mode (Auto-reload on file changes):**
  ```bash
  npm run dev
  ```
The server will start at `http://localhost:5000`.

---

## 🔑 Generating a Google Gmail App Password

Google requires an **App Password** for third-party SMTP access rather than your main Google account password:

1. Sign in to your Google Account at [myaccount.google.com](https://myaccount.google.com/).
2. On the left navigation panel, select **Security**.
3. Under *"How you sign in to Google"*, make sure **2-Step Verification** is turned **ON**.
4. In the search bar at the top of Google Account, type **"App Passwords"** and click on it (or navigate to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
5. Under **App name**, enter `Brew Haven Backend` and click **Create**.
6. Google will generate a **16-character code** (e.g. `abcd efgh ijkl mnop`).
7. Copy this 16-character code (without spaces) and paste it into `EMAIL_PASS` in your `.env` file or Render Environment Variables.

---

## ☁️ Deploying to Render (Free Web Service)

1. Create a free account at [render.com](https://render.com/).
2. Click **New +** &rarr; select **Web Service**.
3. Connect your GitHub repository: `https://github.com/Mhemavardhan/brew-haven-website`.
4. Configure the service settings:
   * **Name:** `brew-haven-backend`
   * **Region:** Choose the region closest to you (e.g., Oregon or Singapore)
   * **Branch:** `main`
   * **Root Directory:** `backend`
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node server.js`
   * **Instance Type:** `Free`
5. In the **Environment Variables** section, add:
   * `NODE_ENV`: `production`
   * `CLIENT_ORIGIN`: `https://mhemavardhan.github.io`
   * `EMAIL_SERVICE`: `gmail`
   * `EMAIL_HOST`: `smtp.gmail.com`
   * `EMAIL_PORT`: `465`
   * `EMAIL_SECURE`: `true`
   * `EMAIL_USER`: `yourcafegmail@gmail.com`
   * `EMAIL_PASS`: `your-16-char-app-password`
   * `OWNER_EMAIL`: `yourcafegmail@gmail.com`
6. Click **Create Web Service**.
7. Once deployment finishes, Render provides your live backend URL (e.g., `https://brew-haven-backend.onrender.com`).
8. Update `API_BASE_URL` in `script.js` with this Render URL!
