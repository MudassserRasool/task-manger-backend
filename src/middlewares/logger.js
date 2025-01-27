import morgan from 'morgan';
import { logger } from '../utils/helper.js';

// Morgan middleware for request logging
const loggerMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time[3] s',
  {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  }
);

export { loggerMiddleware };
