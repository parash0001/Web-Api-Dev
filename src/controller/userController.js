
// controller/userController.js
import userRepo from '../model/user.repo.js';

export const createUser = async (req, res) => {
    try {
        const user = await userRepo.createUser(req.body);
        res.status(201).json({ message: 'User created by admin', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await userRepo.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await userRepo.getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const updated = await userRepo.updateUserById(req.params.id, req.body);
        res.json({ message: 'User updated', updated });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await userRepo.deleteUserById(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

