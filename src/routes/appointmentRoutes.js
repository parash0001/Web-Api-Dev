import express from 'express';
import {
    createAppointment,
    getMyAppointments,
    getAllAppointments,
    updateAppointment,
    deleteAppointment
} from '../controller/appointmentController.js';

import { authenticateToken, checkRole } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', authenticateToken, createAppointment);
router.get('/me', authenticateToken, getMyAppointments);
router.get('/', authenticateToken, checkRole('admin'), getAllAppointments);
router.patch('/:id', authenticateToken, updateAppointment);
router.delete('/:id', authenticateToken, deleteAppointment);

export default router;
