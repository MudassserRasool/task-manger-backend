import { environment } from '../constants/environment.js';
import ExceptionHandler from '../utils/error.js';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Default to 500 if no status code.
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    stack: environment === 'production' ? null : err.stack,
  });
};

export default errorHandler;

const notFoundMiddleware = (req, res, next) => {
  ExceptionHandler.NotFound(
    `The route ${req.originalUrl} does not exist. Please check the API documentation.`
  );
};
export { notFoundMiddleware };
