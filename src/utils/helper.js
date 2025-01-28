import chalk from 'chalk';
import jwt from 'jsonwebtoken';

// import os from 'os';
import mongoose from 'mongoose';
import path from 'path';
import winston from 'winston';
import { JWT_SECRET_KEY } from '../constants/environment.js';
import { tokenExpirationDuration } from '../constants/index.js';

const generateToken = (id, expiresIn = tokenExpirationDuration) => {
  return jwt.sign({ id }, JWT_SECRET_KEY, {
    expiresIn,
  });
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join('logs', 'errors.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join('logs', 'requests.log'),
      level: 'info',
    }),
  ],
});

// utils/logger.js

const detailedLog = (title, ...details) => {
  const timestamp = new Date().toISOString();
  const separator = '-'.repeat(50);

  console.log(chalk.blueBright(`[${timestamp}]`)); // Timestamp
  console.log(
    chalk.greenBright(`---------- ${capitalizeFirstLetter(title)} ----------`)
  );
  details.forEach((detail, index) => {
    console.log(chalk.yellowBright(`Detail ${index + 1}:`), detail);
  });
  console.log(chalk.redBright(separator));
};

function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str; // return the string unchanged if it's not a string or is empty
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateChatId(userId1, userId2) {
  const chatIds = `${userId1}-${userId2}`.split('-');
  return chatIds.join('-');
}

function convertValidMongoId(id) {
  return mongoose.Types.ObjectId.createFromHexString(id);
}

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export {
  capitalizeFirstLetter,
  convertValidMongoId,
  detailedLog,
  generateChatId,
  generateOTP,
  generateToken,
  logger,
};
