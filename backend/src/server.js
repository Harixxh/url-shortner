const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const constants = require('./config/constants');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const analyticsController = require('./controllers/analyticsController');

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = Array.isArray(constants.CORS_ORIGIN)
      ? constants.CORS_ORIGIN
      : [constants.CORS_ORIGIN];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS origin denied: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/s/:shortCode', analyticsController.redirectToUrl); // Shortener redirect route

// Documentation route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'URL Shortener API',
    version: '1.0.0',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout'
      },
      urls: {
        shorten: 'POST /api/urls/shorten',
        getAll: 'GET /api/urls',
        getOne: 'GET /api/urls/:id',
        update: 'PUT /api/urls/:id',
        delete: 'DELETE /api/urls/:id'
      },
      analytics: {
        redirect: 'GET /s/:shortCode',
        getAnalytics: 'GET /api/analytics/:urlId',
        dashboardSummary: 'GET /api/analytics/dashboard/summary'
      }
    }
  });
});

// 404 Handler
app.use(notFound);

// Error Handler (must be last)
app.use(errorHandler);

// Start server
const PORT = constants.PORT;
app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API docs: http://localhost:${PORT}/api`);
  console.log(`✓ Environment: ${constants.NODE_ENV}\n`);
});

module.exports = app;
