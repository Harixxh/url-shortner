const mongoose = require('mongoose');
const constants = require('./constants');

const connectDB = async () => {
  try {
    await mongoose.connect(constants.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
