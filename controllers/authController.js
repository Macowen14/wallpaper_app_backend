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

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email already in use. Please use a different email.' 
      });
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
      { expiresIn: '2d' }
    );

    // Return response without password hash
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle duplicate key error separately
    if (err.code === 11000) {
      return res.status(409).json({ 
        error: 'Email already in use. Please use a different email.' 
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }

    res.status(500).json({ 
      error: 'An error occurred during registration. Please try again.' 
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user (including password field which is normally excluded)
    const user = await User.findOne({ email }).select('+password');
    
    // Generic message for security (don't reveal if user exists)
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials. Please check your email and password.' 
      });
    }

    // Compare passwords
    const match = await compare(password, user.password);
    if (!match) {
      return res.status(401).json({ 
        error: 'Invalid credentials. Please check your email and password.' 
      });
    }

    // Generate token
    const token = sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Return response without password hash
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ 
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      error: 'An error occurred during login. Please try again.' 
    });
  }
}