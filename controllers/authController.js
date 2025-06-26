import User from '../models/User.js';
import { hash as _hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

// Validation helpers
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const getErrorResponse = (status, message, details = {}) => {
  return {
    success: false,
    error: {
      status,
      message,
      ...details
    }
  };
};

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json(
        getErrorResponse(400, 'Email and password are required')
      );
    }

    if (!validateEmail(email)) {
      return res.status(400).json(
        getErrorResponse(400, 'Invalid email format', {
          field: 'email',
          suggestion: 'Please provide a valid email address'
        })
      );
    }

    if (!validatePassword(password)) {
      return res.status(400).json(
        getErrorResponse(400, 'Password too short', {
          field: 'password',
          requirement: 'Must be at least 8 characters long'
        })
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(
        getErrorResponse(409, 'Email already in use', {
          resolution: 'Please use a different email or try logging in'
        })
      );
    }

    // Hash password and create user
    const hash = await _hash(password, 10);
    const user = await User.create({ 
      username,
      email, 
      password: hash 
    });

    // Generate token
    const token = sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15d' }
    );

    // Return response without password hash
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(409).json(
        getErrorResponse(409, 'Email already in use', {
          resolution: 'Please use a different email'
        })
      );
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }));
      
      return res.status(400).json(
        getErrorResponse(400, 'Validation failed', { errors })
      );
    }

    res.status(500).json(
      getErrorResponse(500, 'Internal server error', {
        action: 'Please try again later'
      })
    );
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json(
        getErrorResponse(400, 'Missing credentials', {
          fields: ['email', 'password'],
          message: 'Both email and password are required'
        })
      );
    }

    // Find user (including password field which is normally excluded)
    const user = await User.findOne({ email }).select('+password');
    
    // Generic message for security
    if (!user) {
      return res.status(401).json(
        getErrorResponse(401, 'Authentication failed', {
          resolution: 'Please check your credentials'
        })
      );
    }

    // Compare passwords
    const match = await compare(password, user.password);
    if (!match) {
      return res.status(401).json(
        getErrorResponse(401, 'Authentication failed', {
          resolution: 'Please check your credentials'
        })
      );
    }

    // Generate token
    const token = sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15d' }
    );

    // Return response without password hash
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ 
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json(
      getErrorResponse(500, 'Internal server error', {
        action: 'Please try again later'
      })
    );
  }
}