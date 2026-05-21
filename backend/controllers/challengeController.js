import Challenge from "../models/Challenge.js";

// Inside your challenge creation controller function
export const createChallenge = async (req, res) => {
    try {
        const { title, description, track, difficulty, points } = req.body;

        // Ensure we explicitly map req.body.track to the model schema
        const newChallenge = new Challenge({
            title,
            description,
            track, // 👈 CRITICAL: Must be mapped here!
            difficulty,
            points
        });

        const savedChallenge = await newChallenge.save();
        res.status(201).json(savedChallenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getChallenges = async (req, res) => {
    try {
        let query = {};

        // If user is not an admin, filter by their specific track
        if (req.user.role !== 'admin') {
            query.track = req.user.track;
        }

        // We sort by newest first
        const challenges = await Challenge.find(query).sort({ createdAt: -1 });
        res.status(200).json(challenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateChallenge = async (req, res) => {
    try {
        const updatedChallenge = await Challenge.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true } // runValidators ensures Enums are still checked
        );
        res.status(200).json(updatedChallenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ensure 'export' is at the very beginning of the function
export const deleteChallenge = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedChallenge = await Challenge.findByIdAndDelete(id);

        if (!deletedChallenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        res.status(200).json({ message: "Challenge successfully removed from ecosystem" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getChallengeById = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge spec not found in database registry." });
        }
        res.status(200).json(challenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};