import express from 'express';
import {
    createCamp,
    getAllCamps,
    getCampById,
    updateCamp,
    deleteCamp
} from '../controller/campController.js';

import { authenticateToken, checkRole } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Public / user access
router.get('/', getAllCamps);
router.get('/:id', getCampById);

// Admin-only
router.post('/', authenticateToken, checkRole('admin'), createCamp);
router.patch('/:id', authenticateToken, checkRole('admin'), updateCamp);
router.delete('/:id', authenticateToken, checkRole('admin'), deleteCamp);

export default router;
