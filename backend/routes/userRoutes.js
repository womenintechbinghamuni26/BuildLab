import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.js";
// 1. Imports your clean controllers from userController.js
import { deleteUser, getProfile, updateProfile, updateTrack } from "../controllers/userController.js";
import { logout } from "../controllers/authController.js";

const router = express.Router();

// Publicly authenticated routes
router.post("/logout", verifyToken, logout);

// 2. FIXED: Uses the getProfile controller directly instead of a broken inline function
router.get('/profile/me', verifyToken, getProfile);

// Your existing update endpoint
router.put('/profile/update', verifyToken, updateProfile);

// Admin-only routes
router.delete("/admin/remove-user/:id", verifyToken, isAdmin, deleteUser);
router.put('/profile', verifyToken, updateTrack);

export default router;