const jwt = require('jsonwebtoken');
const constants = require('../config/constants');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, constants.JWT_SECRET, {
    expiresIn: constants.JWT_EXPIRE
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, constants.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Decode JWT token (without verification)
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
