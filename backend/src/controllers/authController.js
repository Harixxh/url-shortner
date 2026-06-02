const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 */
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // Create new user
  user = new User({
    name,
    email,
    password
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.toJSON(),
      token
    }
  });
});

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and get token
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated'
    });
  }

  // Compare passwords
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toJSON(),
      token
    }
  });
});

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: { user }
  });
});

/**
 * @route PUT /api/auth/me
 * @desc Update current user profile
 * @access Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = req.user;

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already in use'
      });
    }
    user.email = email;
  }

  if (name) {
    user.name = name;
  }

  if (password) {
    user.password = password;
  }

  user.updatedAt = new Date();
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.toJSON()
    }
  });
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user (frontend should delete token)
 * @access Private
 */
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = {
  signup,
  login,
  me,
  updateProfile,
  logout
};
