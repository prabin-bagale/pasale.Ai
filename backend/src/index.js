const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Connect to database
require('./db');

// Routes
const healthRoute = require('./routes/health');
const authRoute = require('./routes/auth');
const customersRoute = require('./routes/customers');
const transactionsRoute = require('./routes/transactions');
const smsRoute = require('./routes/sms');
const { startJobs } = require('./jobs/scheduler');
const inventoryRoute = require('./routes/inventory');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Use routes
app.use('/api/health', healthRoute);
app.use('/api/auth', authRoute);
app.use('/api/customers', customersRoute);
app.use('/api/transactions', transactionsRoute);
app.use('/api/sms', smsRoute);
app.use('/api/products', inventoryRoute);
startJobs();

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Pasale AI API is running!',
    version: '0.1.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});