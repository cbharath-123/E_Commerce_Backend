import express from 'express';
import { getUsers, getUserById } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// User routes
router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);

export default router;
