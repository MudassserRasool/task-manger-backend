import bcrypt from 'bcryptjs';
import os from 'os';
import { PORT } from './environment.js';

const emailService = 'gmail';
const emailHost = 'smtp.gmail.com';
const emailPort = 587;
const oneMonthsInSeconds = Math.floor(1 * 30.44 * 24 * 60 * 60);
const sixMonthsInSeconds = Math.floor(6 * 30.44 * 24 * 60 * 60);
const tokenExpirationDuration = oneMonthsInSeconds;
const longTokenExpirationDuration = sixMonthsInSeconds;

// const otp = 1234;
const salt = await bcrypt.genSalt(10);
const trackingId = Math.floor(Math.random() * 1000000000);

const windowMs = 15 * 60 * 1000;
const maxRequests = 100;
const apiVersion = 'v1.0';
const requestTimeoutDuration = 50000;
const dummyPersonImage =
  'https://res.cloudinary.com/dx9n8tsyu/image/upload/v1620343907/person-1_t9yv1a.jpg';
const dummyProductImage =
  'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';
const ROLES = {
  admin: 'admin',
  employee: 'employee',
};
const ipAddress = () => {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress;

  for (const interfaceName in networkInterfaces) {
    const networks = networkInterfaces[interfaceName];

    for (const network of networks) {
      if (network.family === 'IPv4' && !network.internal) {
        ipAddress = network.address;
        break;
      }
    }
    if (ipAddress) break;
  }
  return ipAddress;
};

const BACKEND_BASE_URL = `http://${ipAddress()}:${PORT}`;

export {
  apiVersion,
  BACKEND_BASE_URL,
  dummyPersonImage,
  dummyProductImage,
  emailHost,
  emailPort,
  emailService,
  ipAddress,
  longTokenExpirationDuration,
  maxRequests,
  requestTimeoutDuration,
  ROLES,
  salt,
  tokenExpirationDuration,
  trackingId,
  windowMs,
};
