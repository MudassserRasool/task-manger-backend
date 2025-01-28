import { Router } from 'express';
import userController from '../controllers/userController.js';
const router = Router();

// employee routes
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);

export default router;
