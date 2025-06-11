import express from 'express';
import { register, loginUser } from '../controller/authController.js';
import { authenticateToken } from '../middlewares/authMiddlewares.js';
import { requestReset, verifyOtp, resetPassword } from '../controller/authController.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', loginUser);

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});
router.post('/request-reset', requestReset);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
export default router;
