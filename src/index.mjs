'user strict';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import connectDb from './config/db.js';
import initializeSocketIo from './config/socket.js';
import uploadConfig from './config/uploadConfig.js';
import { PORT } from './constants/environment.js';
import { apiVersion, requestTimeoutDuration } from './constants/index.js';
import utilityController from './controllers/utilityController.js';
import errorHandler, {
  notFoundMiddleware,
} from './middlewares/errorHandler.js';
import errorLogger from './middlewares/errorLogger.js';
import { loggerMiddleware } from './middlewares/logger.js';
import rateLimiter from './middlewares/ratelimter.js';
import timeout from './middlewares/timeout.js';
import uploadMiddleware from './middlewares/uploadMiddleware.js';

import apiRoutes from './constants/apiRoutes.js';
const app = express();
// Attach socket.io to the server
const { io, server } = initializeSocketIo(app);

app.use(express.json());
// allow cos to all
app.use(cors());
app.use(rateLimiter);
app.use(helmet());

app.use(timeout(requestTimeoutDuration));

const __dirname = path.resolve();
app.use(express.static(__dirname + '/public'));
app.use(loggerMiddleware);

app.get(`/`, async (req, res) => {
  res.send('Hello world, Server is running');
});

apiRoutes.forEach(({ baseResource, router, middlewares = [] }) => {
  app.use(`/api/${apiVersion}/${baseResource}`, ...middlewares, router);
});

app.post(
  `/api/${apiVersion}/upload`,
  uploadMiddleware,
  uploadConfig.single('file'),
  utilityController.uploadImage
);

app.use(notFoundMiddleware);
app.use(errorLogger);
app.use(errorHandler);

server.listen(PORT, async () => {
  await connectDb(PORT);
});
export { io };
