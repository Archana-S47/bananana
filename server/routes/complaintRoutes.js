import { Router } from 'express';
import {
  createComplaint,
  deleteComplaint,
  getComplaintById,
  getComplaints,
  updateComplaint,
  updateComplaintStatus,
} from '../controllers/complaintController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/', createComplaint);
router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.put('/:id', updateComplaint);
router.patch('/:id', authorize('admin'), updateComplaintStatus);
router.patch('/:id/status', authorize('admin'), updateComplaintStatus);
router.delete('/:id', deleteComplaint);

export default router;
