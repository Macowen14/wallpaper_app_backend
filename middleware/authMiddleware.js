import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('[Auth] No token provided');
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Auth] Decoded Token:', decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('[Auth] User not found by ID:', decoded.id);
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    req.user = { userId: user._id }; // Explicit and clear
    next();

  } catch (error) {
    console.error('[Auth] Authentication error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    res.status(401).json({ success: false, error: 'Please authenticate' });
  }
};
