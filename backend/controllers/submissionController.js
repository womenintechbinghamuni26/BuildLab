import Submission from "../models/Submission.js";
import User from "../models/User.js"; // Imported in case you aggregate XP ranks later

export const submitProject = async (req, res) => {
    try {
        const submission = await Submission.create({
            ...req.body,
            builder: req.user.id || req.user._id
        });
        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// For the "Community Engagement" layer: Get all submissions for feedback
export const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate('builder', 'fullName track profilePic')
            .populate('challenge', 'title difficulty points');
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- FIXED: SCHEMA INTERCEPTOR CORRECTION ---
export const getMyProgress = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        // FIXED: Swapped 'userId' to match your true 'builder' field assignment parameters
        // FIXED: Swapped 'challengeId' to populate 'challenge' exactly like the layout above
        const progress = await Submission.find({ builder: userId })
            .populate('challenge')
            .sort({ createdAt: -1 }); // Puts your most recent completed work at the top

        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};