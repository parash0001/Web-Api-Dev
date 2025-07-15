import express from 'express';
import {
    createBloodRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus,
    updateBloodRequest,
    deleteBloodRequest
} from '../controller/bloodRequestController.js';

import { authenticateToken, checkRole } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// User routes
router.post('/', authenticateToken, createBloodRequest);
router.get('/me', authenticateToken, getMyRequests);
router.patch('/:id', authenticateToken, updateBloodRequest);
router.delete('/:id', authenticateToken, deleteBloodRequest);

// Admin routes
router.get('/', authenticateToken, checkRole('admin'), getAllRequests);
router.patch('/:id/status', authenticateToken, checkRole('admin'), updateRequestStatus);

export default router;
