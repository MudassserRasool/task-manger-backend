import { Router } from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import paginationMiddleware from '../middlewares/paginationMiddleware.js';
const router = Router();

// admin routes
router.get(
  '/',
  authMiddleware.authorizeAdmin,
  paginationMiddleware,
  userController.getAllUsers
);
router.put(
  '/:id',
  authMiddleware.authorizeAdmin,
  userController.blockOrUnblockUser
);

// employee routes
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);

router.delete('/:id', userController.deleteUser);
router.post('/verify-signup-otp', userController.verifyOtp);
router.post('/resend-otp', userController.resendOtp);
router.post('/verify-resend-otp', userController.verifyResendOtp);
router.post('/reset-password', userController.resetPassword);
router.post('/forget-password', userController.forgetPasswordOtp);
router.post('/social-login', userController.socialLogin);
router.post(
  '/refresh-token',
  authMiddleware.authenticateUser,
  userController.refreshToken
);
export default router;
