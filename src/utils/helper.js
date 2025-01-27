import chalk from 'chalk';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// import os from 'os';
import mongoose from 'mongoose';
import path from 'path';
import winston from 'winston';
import { JWT_SECRET_KEY } from '../constants/environment.js';
import { tokenExpirationDuration } from '../constants/index.js';
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    secure: true,
  });
}

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

async function scrapeLinkedInCompanyProfile(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const companyData = await page.evaluate(() => {
    const companyName =
      document.querySelector('.top-card-layout__title')?.innerText || null;
    const companyTagline =
      document.querySelector('.top-card-layout__headline')?.innerText || null;
    const companyIndustry =
      document.querySelector('.top-card-layout__first-subline')?.innerText ||
      null;
    const companySize =
      document.querySelector('.top-card-layout__company-size')?.innerText ||
      null;
    const companyLocation =
      document.querySelector('.top-card-layout__location')?.innerText || null;
    const companyWebsite =
      document.querySelector('.top-card-layout__company-website')?.innerText ||
      null;

    return {
      companyName,
      companyTagline,
      companyIndustry,
      companySize,
      companyLocation,
      companyWebsite,
    };
  });

  await browser.close();
  return companyData;
}
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const paginateQuery = async (model, filter = {}, pagination) => {
  const { limit, skip } = pagination;
  const { where = {}, ...otherFilters } = filter;

  const [data, total] = await Promise.all([
    model.findMany({
      ...otherFilters,
      where,
      skip,
      take: limit,
    }),
    // model.count({ where }),
    model.count(),
  ]);

  return {
    data,
    metadata: {
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      currentPage: pagination.page,
      pageSize: limit,
    },
  };
};

export {
  capitalizeFirstLetter,
  convertValidMongoId,
  createTransporter,
  detailedLog,
  generateChatId,
  generateOTP,
  generateToken,
  logger,
  paginateQuery,
  scrapeLinkedInCompanyProfile,
};
