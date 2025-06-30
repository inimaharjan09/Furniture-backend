import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const userCheck = async (req, res, next) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.decode(token, 'secret');
  if (decodedToken) {
    req.userId = decodedToken.id;
    req.role = decodedToken.id;
    req.role = decodedToken.role;
    next();
  } else {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

export const adminCheck = async (req, res, next) => {
  if (req.role === 'Admin') {
    next();
  } else {
    return res.status(401).json({
      message: 'Unauthorized..',
    });
  }
};
