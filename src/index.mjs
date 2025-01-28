'user strict';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import connectDb from './config/db.js';
import { PORT } from './constants/environment.js';
import { apiVersion, requestTimeoutDuration } from './constants/index.js';
import errorHandler, {
  notFoundMiddleware,
} from './middlewares/errorHandler.js';
import errorLogger from './middlewares/errorLogger.js';
import { loggerMiddleware } from './middlewares/logger.js';
import rateLimiter from './middlewares/ratelimter.js';
import timeout from './middlewares/timeout.js';

import apiRoutes from './constants/apiRoutes.js';
const app = express();

app.use(express.json());
app.use(cors());
app.use(rateLimiter);
app.use(helmet());

app.use(timeout(requestTimeoutDuration));

app.use(loggerMiddleware);

app.get(`/`, async (req, res) => {
  res.send('Hello world, Server is running');
});

apiRoutes.forEach(({ baseResource, router, middlewares = [] }) => {
  app.use(`/api/${apiVersion}/${baseResource}`, ...middlewares, router);
});

app.use(notFoundMiddleware);
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDb(PORT);
});
