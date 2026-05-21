import express from 'express';
import { createRequest, getAllRequests, updateRequestStatus, getMyRequests } from '../controllers/requestController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post("/", verifyToken, createRequest);
router.get("/my-alerts", verifyToken, getMyRequests);

// Secure Admin routes
router.get("/", verifyToken, isAdmin, getAllRequests);
router.put("/:id/status", verifyToken, isAdmin, updateRequestStatus);

export default router;