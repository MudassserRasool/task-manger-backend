import bcrypt from 'bcryptjs';
import validator from 'validator';
import { prisma } from '../config/db.js';
import { longTokenExpirationDuration, salt } from '../constants/index.js';
import messages from '../constants/messages.js';
import ExceptionHandler from '../utils/error.js';
import { generateToken } from '../utils/helper.js';

class UserService {
  async loginUser(email, password, rememberMe) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      ExceptionHandler.NotFound(messages.NOT_FOUND_USER);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      ExceptionHandler.BadRequest(messages.INVALID_CREDENTIALS);
    }

    const token = generateToken(
      user.id,
      rememberMe ? longTokenExpirationDuration : undefined
    );

    return {
      email: user.email,
      token,
      role: user.role,
    };
  }

  async registerUser(email, password, role) {
    if (!email || !password) {
      throw new Error(messages.MISSING_FIELDS);
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new Error(messages.ALREADY_EXIST_USER);
    }

    if (!validator.isEmail(email)) {
      throw new Error(messages.INVALID_CREDENTIALS);
    }

    if (password.length < 6) {
      throw new Error(messages.INVALID_CREDENTIALS);
    }

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return {
      id: user._id,
    };
  }
}

const userService = new UserService();
export default userService;
