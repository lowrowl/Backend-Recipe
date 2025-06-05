// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No hay token, acceso denegado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Token no válido' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token no válido' });
  }
};

module.exports = auth;