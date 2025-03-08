import express, { Router } from 'express';
import {
  getHealthRecords,
  getHealthRecord,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  shareHealthRecord,
  getSharedRecords,
  removeSharing
} from '../controllers/healthRecordController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = express.Router();
// Apply authentication middleware to all routes
router.use(authMiddleware);

// Health record routes
router.get('/', getHealthRecords);
router.get('/shared', getSharedRecords);
router.get('/:id', getHealthRecord);
router.post('/', createHealthRecord);
router.put('/:id', updateHealthRecord);
router.delete('/:id', deleteHealthRecord);
router.post('/:id/share', shareHealthRecord);
router.delete('/share/:id', removeSharing);

export default router;
