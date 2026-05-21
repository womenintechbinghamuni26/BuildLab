import express from 'express';
import { isAdmin, verifyToken } from '../middleware/auth.js';
import { createChallenge, updateChallenge, deleteChallenge, getChallenges, getChallengeById } from '../controllers/challengeController.js';
// import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Anyone logged in can fetch challenges to view them
router.get("/", verifyToken, getChallenges);

// ONLY Admins can touch these endpoints
router.post("/", verifyToken, isAdmin, createChallenge);
router.put("/:id", verifyToken, isAdmin, updateChallenge);
router.delete("/:id", verifyToken, isAdmin, deleteChallenge);
router.get("/:id", verifyToken, getChallengeById);

export default router;