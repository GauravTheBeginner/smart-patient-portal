
import express from 'express';
import { getPatientInfo, createPatient, updatePatient } from '../controllers/patientController';
import {authMiddleware} from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.get('/:id', getPatientInfo);
router.post('/', createPatient);
router.put('/:id', updatePatient);

export default router;
