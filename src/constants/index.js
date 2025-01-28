import bcrypt from 'bcryptjs';
import os from 'os';
import { PORT } from './environment.js';

const oneMonthsInSeconds = Math.floor(1 * 30.44 * 24 * 60 * 60);
const sixMonthsInSeconds = Math.floor(6 * 30.44 * 24 * 60 * 60);
const tokenExpirationDuration = oneMonthsInSeconds;
const longTokenExpirationDuration = sixMonthsInSeconds;

// const otp = 1234;
const salt = await bcrypt.genSalt(10);

const windowMs = 15 * 60 * 1000;
const maxRequests = 100;
const apiVersion = 'v1.0';
const requestTimeoutDuration = 50000;

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
  ipAddress,
  longTokenExpirationDuration,
  maxRequests,
  requestTimeoutDuration,
  salt,
  tokenExpirationDuration,
  windowMs,
};
