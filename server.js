require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');
const { wss } = require('./notifications/websocket');
const swaggerDocs = require('./docs/swagger');

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
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
  console.log(errorObj.log, errorObj);
  return res.status(errorObj.status).json(errorObj.message);
});

// Start server with WebSocket support
const server = app.listen(PORT, () => {
  console.log(`Server listening on Port: ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    ws.userId = request.headers['user-id']; // user-id is sent in headers
    wss.emit('connection', ws, request);
  });
});
