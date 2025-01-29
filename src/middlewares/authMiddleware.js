// File Path: middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { JWT_SECRET_KEY } from '../constants/environment.js';

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch {
    throw new Error('Invalid token');
  }
};

const authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);

  if (!authorization) {
    throw new Error('Authorization header is missing');
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    throw new Error('Token is missing');
  }

  try {
    const { id } = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticateUser;
