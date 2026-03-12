const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const compression = require('compression');
const path       = require('path');
const rateLimit  = require('express-rate-limit');

const authRoutes        = require('./routes/auth');
const tourRoutes        = require('./routes/tours');
const destinationRoutes = require('./routes/destinations');
const bookingRoutes     = require('./routes/bookings');
const reviewRoutes      = require('./routes/reviews');
const userRoutes        = require('./routes/users');
const packageRoutes     = require('./routes/packages');
const adminRoutes       = require('./routes/admin');
const guideRoutes       = require('./routes/guides');
const communityRoutes   = require('./routes/community');
const newsletterRoutes  = require('./routes/newsletter');
const paymentRoutes     = require('./routes/payments');
const aiRoutes          = require('./routes/ai');
const hotelRoutes       = require('./routes/hotels');

const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts, try again in 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'WildSmiles API is running', timestamp: new Date() });
});

// Routes
app.use('/api/auth',         authRoutes);
app.use('/api/tours',        tourRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/bookings',     bookingRoutes);
app.use('/api/reviews',      reviewRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/packages',     packageRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/guides',       guideRoutes);
app.use('/api/community',    communityRoutes);
app.use('/api/newsletter',   newsletterRoutes);
app.use('/api/payments',     paymentRoutes);
app.use('/api/ai',           aiRoutes);
app.use('/api/hotels',       hotelRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
