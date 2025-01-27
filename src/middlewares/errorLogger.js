// errorLogger.js

import { logger } from '../utils/helper.js';

const errorLogger = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log error with request method, URL, status, and error message
  logger.error(
    `Error occurred - 
      Method: ${req.method},
         URL: ${req.originalUrl},
           Status: ${statusCode},
             Message: ${err.message}, 
                Stack: ${err.stack}`
  );

  next(err); // Pass the error to the next middleware (e.g., your error handler)
};

export default errorLogger;
