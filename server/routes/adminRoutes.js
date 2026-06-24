import { Router } from 'express';
import {
  getAdminComplaints,
  updateAdminComplaintStatus,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);
router.use(requireRole('admin'));

router.get('/complaints', getAdminComplaints);
router.put('/status/:id', updateAdminComplaintStatus);

export default router;
