# Brew Haven — Artisanal Coffee & Online Table Reservation System

> **Software Engineering and System Design (SESD) — Assignment 3**  
> **Course Code:** 24CS301PC311 | **Department:** Computer Science and Engineering  
> **Institution:** SR University  

---

## ☕ Project Overview

**Brew Haven** is a modern, responsive single-page web application developed for a specialty coffee shop. It showcases handcrafted espresso drinks, artisan cold brews, fresh in-house bakery treats, and an interactive client-side **Online Table Reservation System**.

The project demonstrates professional frontend design principles alongside industry-standard **Git version control and GitHub Pages static deployment workflows**.

---

## ✨ Key Features

- **Responsive Hero Landing:** Engaging brand identity, promotional tagline, real-time café highlights, and dual call-to-actions.
- **Categorized Menu Filter:** Interactive filtering for *All Selections*, *Hot Brews*, *Cold Specialties*, and *Bakery & Bites*.
- **Interactive Table Reservation System:** Real-time form validation (name, email, phone, dining date, time slot, party size, seating zone), input sanitization, past-date disabling, and dynamic instant booking confirmation modal with unique reference codes.
- **Location & Café Hours:** Transparent operational schedules, contact channels, and physical address details.
- **Fully Responsive Architecture:** Optimized across mobile smartphones, tablets, laptops, and ultra-wide desktop viewports with a collapsible navigation drawer.
- **Client-Side Simulation:** Clear architecture noting that table bookings are verified client-side for demonstration without external server dependencies.

---

## 🛠️ Technologies Used

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Semantic UI, responsive coffee theme, dynamic menu filtering, client-side validation |
| **Backend** | Node.js, Express.js | REST API server, routing, JSON payload parsing, centralized error handling |
| **Email Engine** | Nodemailer, Gmail SMTP | Automated dual email dispatch (Café Owner notification + Customer confirmation) |
| **Security** | Helmet, CORS, Express-Rate-Limit, Express-Validator | Security headers, origin whitelisting, anti-spam rate limiting, input sanitization |
| **Config** | Dotenv (`.env`) | Safe environment credential management (Gmail App Password) |
| **Hosting** | GitHub Pages & Render | Static frontend on GitHub Pages, Node.js backend Web Service on Render |

---

## 📁 Project Directory Structure

```text
BrewHaven/
├── index.html                       # Frontend website & reservation form
├── style.css                        # Responsive styles, theme & interactive states
├── script.js                        # Frontend UI logic & backend API integration
├── assets/
│   └── images/                      # Optimized SVG coffee art, logos and icons
│       ├── logo.svg
│       ├── hero-coffee.svg
│       ├── espresso.svg
│       ├── cappuccino.svg
│       ├── coldbrew.svg
│       └── pastry.svg
├── backend/
│   ├── server.js                    # Express application entry point & CORS
│   ├── package.json                 # Backend dependencies, metadata & scripts
│   ├── .env                         # Local environment secrets (ignored by Git)
│   ├── .env.example                 # Environment configuration template
│   ├── README.md                    # Dedicated backend documentation
│   ├── config/
│   │   └── emailConfig.js           # Nodemailer Gmail SMTP transporter setup
│   ├── controllers/
│   │   └── reservationController.js # Reservation business logic & response handling
│   ├── routes/
│   │   └── reservationRoutes.js     # /api/reservations route mappings
│   ├── services/
│   │   └── emailService.js          # Branded HTML email templates for owner & customer
│   └── middleware/
│       ├── validator.js             # Input validation & future-date checks
│       ├── rateLimiter.js           # Anti-spam request throttling
│       └── errorHandler.js          # 404 & global exception handler
├── README.md                        # Master project documentation
└── .gitignore                       # Ignored files (node_modules, .env, OS files)
```

---

## 📧 Automated Dual-Email System

Whenever a customer submits a table reservation:

1. **Owner Notification Email:**
   - **Subject:** `New Table Reservation – Brew Haven Café`
   - **Recipient:** Café owner's Gmail address (`OWNER_EMAIL`)
   - **Content:** Customer name, email, phone, reservation date, time slot, party size, seating zone, special requests, unique booking reference, and direct contact action buttons.

2. **Customer Confirmation Email:**
   - **Subject:** `Your Table Reservation is Confirmed – Brew Haven Café`
   - **Recipient:** Customer's registered email address
   - **Content:** Personalized greeting, unique booking reference code (`BH-XXXXXX`), reservation summary table, arrival guidelines (15-minute grace period), cancellation instructions, and café contact details.

---

## 🚀 Running Locally on MacBook M4

### Step 1: Install Node.js (If not already installed)
Check if Node.js is installed:
```bash
node -v
```
If not installed, install it using Homebrew:
```bash
brew install node
```
*Or download the macOS installer directly from [nodejs.org](https://nodejs.org/).*

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables
Create your local `.env` file from the template:
```bash
cp .env.example .env
```
Open `.env` and set your Gmail address and 16-character Google App Password:
```env
EMAIL_USER=yourcafegmail@gmail.com
EMAIL_PASS=your-16-character-app-password
OWNER_EMAIL=yourcafegmail@gmail.com
```

### Step 4: Start the Backend Server
```bash
npm start
```
The server will start at: `http://localhost:5000`

### Step 5: Open the Frontend Website
In a new terminal window, navigate back to the root `BrewHaven` folder and start a local HTTP server:
```bash
cd ..
python3 -m http.server 8000
```
Open your browser and visit: `http://localhost:8000`  
The frontend will automatically connect to `http://localhost:5000` when running locally!

---

## ☁️ Deploying Backend to Render & Connecting Frontend

### 1. Generate Google App Password
1. Sign in to your Google Account at [myaccount.google.com](https://myaccount.google.com/).
2. Go to **Security** &rarr; Ensure **2-Step Verification** is **ON**.
3. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
4. Enter App name: `Brew Haven Backend` &rarr; Click **Create**.
5. Copy the generated 16-character password.

### 2. Deploy to Render
1. Go to [render.com](https://render.com/) and create a free account.
2. Click **New +** &rarr; **Web Service**.
3. Select your repository: `https://github.com/Mhemavardhan/brew-haven-website`.
4. Configure service details:
   - **Name:** `brew-haven-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
5. Add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `CLIENT_ORIGIN`: `https://mhemavardhan.github.io`
   - `EMAIL_SERVICE`: `gmail`
   - `EMAIL_HOST`: `smtp.gmail.com`
   - `EMAIL_PORT`: `465`
   - `EMAIL_SECURE`: `true`
   - `EMAIL_USER`: your Gmail address
   - `EMAIL_PASS`: your 16-character App Password
   - `OWNER_EMAIL`: your Gmail address
6. Click **Deploy Web Service**.
7. Copy your deployed Render URL (e.g., `https://brew-haven-backend.onrender.com`).

### 3. Connect Frontend to Render Backend
In `script.js` (line 12), update `API_BASE_URL` with your Render backend URL:
```javascript
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : 'https://YOUR-APP-NAME.onrender.com';
```
Commit and push your changes to GitHub `main` branch. GitHub Pages will update automatically!

---

## 🔄 Git Workflow Summary

This repository was constructed and version-controlled following the official SESD Lab 3 guidelines:

1. **Repository Initialization:**
   `git init` to initialize the local version control tracking.
2. **User Configuration:**
   Configured global/local identity using `git config user.name` and `git config user.email`.
3. **Staging & Commit Milestones:**
   Staged changes incrementally with `git add .` and committed using descriptive messages.
4. **Branching & Feature Isolation:**
   Created isolated feature branches (`feature/responsive-design` and `feature/reservation-validation`) to build and test improvements independently before merging into `main`.
5. **Controlled Conflict Resolution:**
   Demonstrated branch conflict identification, inspected diff markers (`<<<<<<<`, `=======`, `>>>>>>>`), and cleanly resolved content overlap.
6. **GitHub Synchronization & Pages Deployment:**
   Linked to GitHub via `git remote add origin` and deployed live using **GitHub Pages** from the `main` branch root.

---

## 🌐 Live Deployment & Repository Links

- **GitHub Repository:** [https://github.com/Mhemavardhan/brew-haven-website](https://github.com/Mhemavardhan/brew-haven-website)
- **Live GitHub Pages URL:** [https://mhemavardhan.github.io/brew-haven-website/](https://mhemavardhan.github.io/brew-haven-website/)

---

## 👥 Student & Academic Credentials

- **Course:** Software Engineering and System Design (24CS301PC311)
- **Institution:** SR University, Warangal / Hyderabad
- **Department:** Computer Science and Engineering (School of CS & AI)
- **Assignment:** SESD Lab Assignment 03/12
