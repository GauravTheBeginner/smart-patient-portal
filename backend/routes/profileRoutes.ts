import express, { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { changePassword, deleteAccount, getProfile, updateProfile } from '../controllers/profileController';
;

const router: Router = express.Router();

// All profile routes require authentication
router.use(authMiddleware);

// Profile routes
router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/change-password', changePassword);
router.delete('/', deleteAccount);

export default router;
