import express from "express";
// Import your new controller hooks cleanly
import {
    getPosts, createPost, getLeaderboard, getPulseMetrics, getSessions,
    addCommentToPost, votePost, updatePost, deletePost
} from "../controllers/communityController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/posts", verifyToken, getPosts);
router.post("/posts", verifyToken, createPost);
router.get("/leaderboard", verifyToken, getLeaderboard);
router.get("/pulse", verifyToken, getPulseMetrics);
router.get("/sessions", verifyToken, getSessions);
router.post("/posts/:id/comments", verifyToken, addCommentToPost);

// --- NEW ROUTE MOUNTS FOR VOTING, EDITING, AND DELETIONS ---
router.put("/posts/:id/vote", verifyToken, votePost);
router.put("/posts/:id", verifyToken, updatePost);
router.delete("/posts/:id", verifyToken, deletePost);

export default router;