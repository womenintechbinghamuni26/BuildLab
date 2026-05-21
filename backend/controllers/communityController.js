import Post from "../models/post.js";
import User from "../models/User.js";

// 1. FETCH STREAM DISCUSSIONS WITH POPULATED COMMENTS MATRIX
export const getPosts = async (req, res) => {
    try {
        const { tab } = req.query;

        // Dynamic deep population tracks writer and comment writer nodes concurrently
        const posts = await Post.find({ type: tab })
            .populate('user', 'fullName profilePic role track')
            .populate({
                path: 'comments.user',
                select: 'fullName profilePic role track'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. DISPATCH NEW POST RECORD DOCUMENT
export const createPost = async (req, res) => {
    try {
        const { type, title, description, mediaUrl } = req.body;
        const userId = req.user.id || req.user._id;

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "Authenticated session user node not found." });
        }

        const newPost = new Post({
            type: type,
            title: title || "New Lab Log Entry",
            description: description,
            mediaUrl: mediaUrl || "",
            user: userId
        });

        const savedPost = await newPost.save();

        const populatedPost = await Post.findById(savedPost._id)
            .populate({
                path: 'user',
                select: 'fullName profilePic role track'
            });

        res.status(201).json({ post: populatedPost });

    } catch (error) {
        console.error("DETAILED DATABASE POST CREATION CRASH LOG:", error);
        res.status(500).json({
            message: "Ecosystem database failed to compile post instance.",
            error: error.message
        });
    }
};

// --- NEW: CONTROLLER ENGINE FOR PERSISTING REAL BUILDER COMMENTS ---
export const addCommentToPost = async (req, res) => {
    try {
        const { id } = req.params; // Post Document Target ID
        const { text } = req.body;
        const userId = req.user.id || req.user._id;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment message data structure cannot be blank." });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post node target location not found." });
        }

        // Push new object straight into model embedded array schema
        post.comments.push({
            text: text,
            user: userId
        });

        await post.save();

        // Re-query with populated object parameters so UI can view writer profiles instantly
        const updatedPost = await Post.findById(id).populate({
            path: 'comments.user',
            select: 'fullName profilePic role track'
        });

        res.status(201).json({
            message: "Comment compiled.",
            comments: updatedPost.comments
        });

    } catch (error) {
        console.error("Comment Insertion Database Crash:", error);
        res.status(500).json({ message: "Server error processing comment pipeline insertion." });
    }
};

// 3. AGGREGATE LAB BUILDERS LEADERBOARD BY DYNAMIC SCALE
export const getLeaderboard = async (req, res) => {
    try {
        const builders = await User.find({ role: 'builder' })
            .select('fullName profilePic')
            .limit(5);

        const formattedBuilders = builders.map((b, idx) => ({
            _id: b._id,
            fullName: b.fullName,
            profilePic: b.profilePic,
            xp: Math.floor(2500 - (idx * 230))
        }));

        res.status(200).json({ builders: formattedBuilders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. LABORATORY PULSE METRICS
export const getPulseMetrics = async (req, res) => {
    try {
        res.status(200).json({
            metrics: {
                onlineNow: Math.floor(Math.random() * (1300 - 1100) + 1100),
                newReviews: 48
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. UPCOMING LAB SESSIONS
export const getSessions = async (req, res) => {
    try {
        res.status(200).json({
            sessions: [
                { _id: "s1", title: "Peer Review Sprint: UI/UX", time: "2:00 PM EST", date: new Date("2026-10-24") },
                { _id: "s2", title: "Expert AMA: Rust for Web", time: "11:00 AM EST", date: new Date("2026-10-26") }
            ]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add these functions to your existing backend/controllers/communityController.js file

// --- CONTROLLER MATRIX FOR CAPTURING ENGINE UPVOTES / VOTING ---
// Replace the old votePost inside backend/controllers/communityController.js
export const votePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { direction } = req.body;
        const userId = req.user.id || req.user._id;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post document not found." });

        // Initialize tracking fields safely if old posts don't have them yet
        if (!post.upvotedBy) post.upvotedBy = [];
        if (!post.downvotedBy) post.downvotedBy = [];

        const hasUpvoted = post.upvotedBy.includes(userId);
        const hasDownvoted = post.downvotedBy.includes(userId);

        if (direction === 'up') {
            if (hasUpvoted) {
                // User clicked upvote again -> REMOVE their upvote
                post.upvotedBy = post.upvotedBy.filter(uid => uid.toString() !== userId.toString());
            } else {
                // Add upvote, and clear downvote if they had one
                post.upvotedBy.push(userId);
                post.downvotedBy = post.downvotedBy.filter(uid => uid.toString() !== userId.toString());
            }
        } else if (direction === 'down') {
            if (hasDownvoted) {
                // User clicked downvote again -> REMOVE their downvote
                post.downvotedBy = post.downvotedBy.filter(uid => uid.toString() !== userId.toString());
            } else {
                // Add downvote, and clear upvote if they had one
                post.downvotedBy = post.downvotedBy.filter(uid => uid.toString() !== userId.toString());
                post.upvotedBy = post.upvotedBy.filter(uid => uid.toString() !== userId.toString());
            }
        }

        // Calculate the absolute upvote aggregate score
        post.upvotes = post.upvotedBy.length - post.downvotedBy.length;
        await post.save();

        res.status(200).json({
            updatedUpvotes: post.upvotes,
            upvotedBy: post.upvotedBy,
            downvotedBy: post.downvotedBy
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- CONTROLLER FOR SECURELY EDITING/REVISING YOUR POST ---
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found." });

        // Security authorization boundary check
        if (post.user.toString() !== req.user.id && post.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Forbidden: You do not own this document record." });
        }

        post.description = description;
        await post.save();

        res.status(200).json({ message: "Revisions locked into storage.", post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- CONTROLLER FOR SECURELY DISCARDING/DELETING YOUR POST ---
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post timeline log not found." });

        // Security authorization boundary check
        if (post.user.toString() !== req.user.id && post.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Forbidden: Action tracking restricted to owner only." });
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Document removed successfully from MongoDB." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};