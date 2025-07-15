import express from 'express';
import { getDashboardStats } from '../controller/dashboardController.js';
import { authenticateToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();
router.get('/', authenticateToken, getDashboardStats);
export default router;
