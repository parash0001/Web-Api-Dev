import express from 'express';
import {
  submitFeedback,
  getMyFeedback,
  getAllFeedbacks,
  updateFeedbackStatus,
  deleteFeedback
} from '../controller/feedbackController.js';

import { authenticateToken, checkRole } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', authenticateToken, submitFeedback);
router.get('/me', authenticateToken, getMyFeedback);
router.delete('/:id', authenticateToken, deleteFeedback);

router.get('/', authenticateToken, checkRole('admin'), getAllFeedbacks);
router.patch('/:id/status', authenticateToken, checkRole('admin'), updateFeedbackStatus);

export default router;
