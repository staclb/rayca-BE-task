require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');
const swaggerDocs = require('./docs/swagger');
const logger = require('./config/logger');
const messageRoutes = require('./routes/message');

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/message', messageRoutes);

// swagger
swaggerDocs(app);

app.get('/', (req, res) => {
  res.send('Hello from server');
});

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Error caught in global handler',
    status: 500,
    message: { err: 'An unknown error occurred' },
  };
  const errorObj = { ...defaultErr, ...err };
  logger.error(errorObj.log, errorObj);
  return res.status(errorObj.status).json(errorObj.message);
});

const server = app.listen(PORT, () => {
  logger.info(`Server listening on Port: ${PORT}`);
});
