/**
 * Brew Haven Café — Main Backend Server
 * Production-ready Express application powering online table reservations
 * with automated Gmail SMTP notifications.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const reservationRoutes = require('./routes/reservationRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');
const { verifyEmailConnection, isConfigured } = require('./config/emailConfig');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// -----------------------------------------------------------------------------
// 1. Security & Middleware Configuration
// -----------------------------------------------------------------------------

// Security HTTP headers
app.use(helmet());

// Allowed origins for Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  'https://mhemavardhan.github.io',
  process.env.CLIENT_ORIGIN,
  // Local development environments
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:5000',
  'http://127.0.0.1:8080',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests or tools like Postman/curl (where origin is undefined)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) => {
      // Support trailing slashes or subpaths
      return origin === allowed || origin.startsWith(allowed);
    });

    if (isAllowed || NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error(`CORS origin blocked: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parsing with strict payload size limits to prevent DOS
app.use(express.json({ limit: '15kb' }));
app.use(express.urlencoded({ extended: true, limit: '15kb' }));

// Request logging in development
if (NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    next();
  });
}

// -----------------------------------------------------------------------------
// 2. API Routes
// -----------------------------------------------------------------------------

// Root endpoint — Service Welcome & Documentation
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'Brew Haven Café Reservation API',
    status: 'operational',
    version: '1.0.0',
    documentation: {
      healthCheck: 'GET /api/health',
      submitReservation: 'POST /api/reservations',
    },
    clientWebsite: 'https://mhemavardhan.github.io/brew-haven-website/',
    timestamp: new Date().toISOString(),
  });
});

// Quick health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    emailReady: isConfigured,
  });
});

// Main reservation endpoints
app.use('/api/reservations', reservationRoutes);

// -----------------------------------------------------------------------------
// 3. Error Handling Middleware
// -----------------------------------------------------------------------------

// 404 handler for unknown routes
app.use(notFoundHandler);

// Centralized error handler
app.use(globalErrorHandler);

// -----------------------------------------------------------------------------
// 4. Server Initialization & SMTP Verification
// -----------------------------------------------------------------------------

const server = app.listen(PORT, async () => {
  console.log('\n=============================================================');
  console.log(`☕  BREW HAVEN CAFÉ — RESERVATION ENGINE ACTIVE`);
  console.log('=============================================================');
  console.log(`📡  Server Port:      http://localhost:${PORT}`);
  console.log(`🌍  Environment:      ${NODE_ENV}`);
  console.log(`🔒  CORS Allowed:     ${allowedOrigins.join(', ')}`);
  console.log(`📧  Gmail SMTP:       ${isConfigured ? 'Configured' : 'Pending Credentials in .env'}`);
  console.log('=============================================================\n');

  // Verify SMTP connection asynchronously
  await verifyEmailConnection();
});

// Graceful shutdown handling
const handleGracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down Brew Haven backend gracefully...`);
  server.close(() => {
    console.log('✓ HTTP server closed. Process exiting.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

module.exports = app;
