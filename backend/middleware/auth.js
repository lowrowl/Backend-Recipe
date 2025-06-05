const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const header = req.headers['authorization'] || req.headers['Authorization'];

    if (!header) {
      return res.status(401).json({ error: 'No hay token, acceso denegado' });
    }

    const token = header.startsWith('Bearer ') ? header.replace('Bearer ', '') : header;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');

    req.user = decoded.user; // Como tu payload es { user: { id: user.id } }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Token no válido' });
  }
};

module.exports = auth;
