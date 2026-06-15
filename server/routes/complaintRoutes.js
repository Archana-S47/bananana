import { Router } from 'express';
import { listComplaints } from '../controllers/complaintController.js';

const router = Router();

router.get('/', listComplaints);

export default router;
