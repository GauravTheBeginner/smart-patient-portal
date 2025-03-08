
import express from 'express';
import { signup, signin, getMe } from '../controllers/authController';
import {authMiddleware} from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);

// Protected routes
router.get('/me', authMiddleware, getMe);

export default router;
