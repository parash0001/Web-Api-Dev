import express from 'express';
import { createDonation, getMyDonations, getAllDonations, deleteDonation } from '../controller/donationController.js';
import { authenticateToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', authenticateToken, createDonation);
router.get('/me', authenticateToken, getMyDonations);
router.get('/', authenticateToken, getAllDonations); // Optional: restrict to admin
router.delete('/:id', authenticateToken, deleteDonation); // Optional: admin only

export default router;
