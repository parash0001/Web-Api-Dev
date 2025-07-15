
// routes/userRoutes.js
import express from 'express';
import {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
} from '../controller/userController.js';

const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
