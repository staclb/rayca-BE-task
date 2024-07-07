const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB connected...');
  } catch (err) {
    logger.error('Error connecting to MongoDB: %o', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
