import bcrypt from 'bcryptjs';
import validator from 'validator';
import { prisma } from '../config/db.js';
import { longTokenExpirationDuration, salt } from '../constants/index.js';
import messages from '../constants/messages.js';
import ExceptionHandler from '../utils/error.js';
import {
  createTransporter,
  generateOTP,
  generateToken,
} from '../utils/helper.js';

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
    if (user.isBlocked) {
      ExceptionHandler.Forbidden(messages.BLOCKED_USER);
    }
    if (!user.isVerified) {
      ExceptionHandler.Forbidden(messages.NOT_VERIFIED_USER);
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

    const mailOptions = {
      to: email,
      from: `"Foodie" <mudasserasool@gmail.com>`,
      subject: 'OTP for account verification',
      text: generateOTP().toString(),
    };

    const sendMail = async (mailOptions) => {
      const transporter = createTransporter();

      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve('Email sent successfully: ' + info.response);
          }
        });
      });
    };

    try {
      await sendMail(mailOptions);
    } catch (error) {
      throw new Error(error.message);
    }
    const OTP = Math.floor(1000 + Math.random() * 9000);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationCode: OTP,
        role,
      },
    });

    return {
      id: user._id,
    };
  }

  async verifyOtp(email, otp) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.verificationCode !== otp) {
      throw new Error('Invalid OTP');
    }

    const registeredUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
      },
    });

    const token = generateToken(registeredUser._id);

    return {
      email,
      token,
      id: registeredUser._id,
      role: registeredUser.role,
    };
  }
}

const userService = new UserService();
export default userService;
