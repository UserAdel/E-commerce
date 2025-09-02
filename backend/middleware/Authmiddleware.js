const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token);
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      
      // Get user from the token (excluding password)
      req.user = await User.findById(decoded.user.id).select('-password');
      console.log('User found:', req.user);
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No token in headers:', req.headers);
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  console.log('Admin middleware - User:', req.user);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.log('User role:', req.user?.role);
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };