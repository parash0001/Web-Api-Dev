import express from 'express';
import {
  register,
  loginUser,
  requestReset,
  verifyOtp,
  resetPassword,
} from '../controller/authController.js';
import { authenticateToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

export default router;
