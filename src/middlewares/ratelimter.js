import { rateLimit } from 'express-rate-limit';
import { maxRequests, windowMs } from '../constants/index.js';

const rateLimiter = rateLimit({
  windowMs,
  limit: maxRequests,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export default rateLimiter;
