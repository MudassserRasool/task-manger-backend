import { JWT_SECRET_KEY } from '../constants/environment.js';
import ExceptionHandler from '../utils/error.js';

const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    if (decoded.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Access forbidden. Admin role required.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    ExceptionHandler.Forbidden('Invalid token');
  }
};

export default authenticateAdmin;
