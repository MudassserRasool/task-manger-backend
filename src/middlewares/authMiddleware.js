// File Path: middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { JWT_SECRET_KEY } from '../constants/environment.js';
import messages from '../constants/messages.js';
import ExceptionHandler from '../utils/error.js';

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch {
    throw ExceptionHandler.Unauthorized('Invalid or expired token');
  }
};

const authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(ExceptionHandler.BadRequest('Authorization header is missing'));
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    return next(ExceptionHandler.BadRequest('Token is missing'));
  }

  try {
    const { id } = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return next(ExceptionHandler.NotFound(messages.NOT_FOUND_USER));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticateUser;
