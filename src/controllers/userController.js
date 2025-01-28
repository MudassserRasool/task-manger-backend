import bcrypt from 'bcryptjs'; // vercel is not supporting it so use olde rversion or js-sha512
import validator from 'validator';
import { salt, tokenExpirationDuration } from '../constants/index.js';
import messages from '../constants/messages.js';
// import twilioService from '../services/twilioService.js';
import { prisma } from '../config/db.js';
import userService from '../services/userService.js';
import ExceptionHandler from '../utils/error.js';
import { generateToken } from '../utils/helper.js';
import successResponse from '../utils/successResponse.js';

class UserController {
  async loginUser(req, res, next) {
    const { email, password, rememberMe } = req.body;
    try {
      const result = await userService.loginUser(email, password, rememberMe);
      successResponse(res, 'User logged in successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async registerUser(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return ExceptionHandler.BadRequest(messages.MISSING_FIELDS);
    }

    if (!validator.isEmail(email)) {
      ExceptionHandler.BadRequest(messages.INVALID_EMAIL);
    }

    if (password.length < 6) {
      ExceptionHandler.BadRequest(messages.INVALID_PASSWORD);
    }
    if (!validator.isStrongPassword(password)) {
      ExceptionHandler.BadRequest(
        'Password must contain at least 1 lowercase, 1 uppercase, 1 numeric, 1 special character and must be at least 8 characters long'
      );
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return ExceptionHandler.BadRequest(messages.ALREADY_EXIST_USER);
      }

      console.log('---------------------------');

      console.log(email, password);
      console.log('---------------------------');

      const hash = await bcrypt.hash(password, salt);

      const registeredUser = await prisma.user.create({
        data: {
          email,
          password: hash,
        },
      });
      const token = generateToken(registeredUser.id, tokenExpirationDuration);
      delete registeredUser.password;
      delete registeredUser.id;
      delete registeredUser.createdAt;
      delete registeredUser.updatedAt;
      registeredUser.token = token;

      successResponse(
        res,
        'User Registered. OTP sent to your email, please verify OTP to login.',
        registeredUser
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
