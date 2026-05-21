import express from 'express';
import { submitProject, getAllSubmissions, getMyProgress } from '../controllers/submissionController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, submitProject);
router.get('/all', verifyToken, getAllSubmissions);

// This is the endpoint your frontend dashboard will call to fetch your history
router.get('/my-progress', verifyToken, getMyProgress);

export default router;