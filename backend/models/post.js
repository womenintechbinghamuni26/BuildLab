// backend/models/post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    mediaUrl: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // --- UPDATED TRACKING ARRAYS FOR SINGLE VOTING BOUNDARIES ---
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    upvotes: { type: Number, default: 0 }, // Kept for quick sorting index checks

    views: { type: Number, default: 0 },
    comments: [{
        text: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model("Post", postSchema);