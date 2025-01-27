import bcrypt from 'bcryptjs'; // vercel is not supporting it so use olde rversion or js-sha512
import validator from 'validator';
import { ROLES, salt } from '../constants/index.js';
import messages from '../constants/messages.js';
import emailService from '../services/emailService.js';
// import twilioService from '../services/twilioService.js';
import { prisma } from '../config/db.js';
import userService from '../services/userService.js';
import ExceptionHandler from '../utils/error.js';
import { generateOTP, generateToken, paginateQuery } from '../utils/helper.js';
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
    const { email, password, role = ROLES.employee, name } = req.body;
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
        if (existingUser.isVerified) {
          ExceptionHandler.Conflict(messages.ALREADY_EXIST_USER);
        } else if (!existingUser.isVerified) {
          ExceptionHandler.Forbidden(messages.NOT_VERIFIED_USER);
        }
      }
      const OTP = generateOTP();
      await emailService.sendEmail(email, OTP);
      const hash = await bcrypt.hash(password, salt);

      const registeredUser = await prisma.user.create({
        data: {
          email,
          password: hash,
          verificationCode: OTP,
          role,
          name,
          isOtpVerified: false,
        },
      });
      // const token = generateToken(registeredUser._id);
      // registeredUser.token = token;
      delete registeredUser.password;
      delete registeredUser.verificationCode;

      successResponse(
        res,
        'User Registered. OTP sent to your email, please verify OTP to login.',
        registeredUser
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    console.log('Inside getAllUsers zcontroller');
    const { role } = req.query;
    const { pagination } = req;
    try {
      const filter = {
        where: role ? { role } : {},
        orderBy: {
          createdAt: 'desc',
        },
      };

      const result = await paginateQuery(prisma.user, filter, pagination);

      successResponse(res, 'All users fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        ExceptionHandler.NotFound(messages.NOT_FOUND_USER);
      }
      await prisma.profile.delete({
        where: {
          userId: id,
        },
      });
      const deletedUser = await prisma.user.delete({
        where: {
          id,
        },
      });
      successResponse(res, messages.USER_DELETED, deletedUser);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async verifyOtp(req, res, next) {
    const { email, otp } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        ExceptionHandler.NotFound(messages.NOT_FOUND_USER);
      }

      if (user.verificationCode !== otp) {
        ExceptionHandler.BadRequest(messages.INVALID_OTP);
      }

      const token = generateToken(user.id);

      const registeredUser = await prisma.user.update({
        where: {
          email,
        },
        data: {
          isVerified: true,
          isOtpVerified: true,
        },
      });

      await prisma.profile.upsert({
        where: {
          userId: registeredUser.id,
        },
        update: {
          userId: registeredUser.id,
        },
        create: {
          userId: registeredUser.id,
          email: registeredUser.email,
        },
      });

      successResponse(res, messages.ACCOUNT_VERIFIED, {
        ...registeredUser,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req, res, next) {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return ExceptionHandler.BadRequest(messages.INVALID_EMAIL);
    }
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        ExceptionHandler.NotFound(messages.PLEASE_REGISTER);
      }
      if (user.isVerified) {
        ExceptionHandler.Forbidden(messages.VERIFIED_PLEASE_LOGIN);
      }
      const OTP = generateOTP();

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          verificationCode: OTP,
          isOtpVerified: false,
        },
      });

      await emailService.sendEmail(email, user.verificationCode);
      successResponse(res, messages.OTP_SENT, {});
    } catch (error) {
      next(error);
    }
  }

  // verify resend otp
  async verifyResendOtp(req, res, next) {
    const { email, otp } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        ExceptionHandler.NotFound(messages.PLEASE_REGISTER);
      }
      if (user.verificationCode != otp) {
        ExceptionHandler.BadRequest(messages.INVALID_OTP);
      }

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          isVerified: true,
          isOtpVerified: true,
        },
      });

      successResponse(res, messages.ACCOUNT_VERIFIED);
    } catch (error) {
      next(error);
    }
  }

  // reset password by sending otp to the email
  async forgetPasswordOtp(req, res, next) {
    const { email } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        ExceptionHandler.NotFound(messages.NOT_FOUND_USER);
      }

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          isOtpVerified: false,
        },
      });

      const OTP = generateOTP();
      await emailService.sendEmail(email, OTP);

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          verificationCode: OTP,
        },
      });

      successResponse(res, messages.OTP_SENT);
    } catch (error) {
      next(error);
    }
  }

  // reset password by entering email otp and new password
  async resetPassword(req, res, next) {
    const { email, otp, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        ExceptionHandler.NotFound(messages.NOT_FOUND_USER);
      }
      if (user.verificationCode != otp) {
        ExceptionHandler.BadRequest(messages.INVALID_OTP);
      }
      if (!user.isOtpVerified) {
        ExceptionHandler.BadRequest(messages.OTP_NOT_VERIFIED);
      }
      const hashedPassword = await bcrypt.hash(password, salt);
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
        },
      });
      successResponse(res, messages.PASSWORD_RESET, {}, 201);
    } catch (error) {
      next(error);
    }
  }

  // register user with google
  async socialLogin(req, res, next) {
    const { email, name, imageUrl, provider, idToken, accessToken } = req.body;

    try {
      let user = await prisma.user.findUnique({
        where: { email },
      });

      let account = await prisma.account.findFirst({
        where: {
          provider,
          userId: user?.id,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            imageUrl,
            isVerified: true,
          },
        });

        await prisma.profile.create({
          data: {
            userId: user.id,
          },
        });

        account = await prisma.account.create({
          data: {
            provider,
            userId: user.id,
            idToken,
            accessToken,
            refreshToken: '',
            expiresAt: new Date(Date.now() + 3600 * 1000), // Example expiry time
          },
        });
      } else if (!account) {
        account = await prisma.account.create({
          data: {
            provider,
            userId: user.id,
            idToken,
            accessToken,
            refreshToken: '',
            expiresAt: new Date(Date.now() + 3600 * 1000),
          },
        });
      }

      const token = generateToken(user.id);

      successResponse(res, messages.USER_LOGGED_IN, {
        ...user,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  // refresh token
  async refreshToken(req, res, next) {
    const userId = req.user.id;

    try {
      const token = generateToken(userId);

      successResponse(res, 'Token refreshed successfully', {
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  // enable or disable user
  async blockOrUnblockUser(req, res, next) {
    const { id } = req.params;
    const userId = Number(id);
    const { isBlocked } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        ExceptionHandler.NotFound(messages.NOT_FOUND_USER);
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isBlocked,
        },
      });

      successResponse(res, messages.USER_UPDATED(isBlocked), { isBlocked });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
