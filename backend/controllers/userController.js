import User from "../models/User.js";

// --- REMOVE BUILDER FROM MATRIX ---
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToDelete = await User.findByIdAndDelete(id);

        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User removed from BuildLab" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- CORE PROFILE SETTINGS UPDATE CONTROLLER ---
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            fullName,
            email,
            bio,
            profilePic,
            challengeCompletion,
            communityInteractions,
            laboratoryNews,
            techStack
        } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    fullName,
                    email,
                    bio: bio || "",
                    profilePic: profilePic || "",
                    challengeCompletion: challengeCompletion ?? true,
                    communityInteractions: communityInteractions ?? true,
                    laboratoryNews: laboratoryNews ?? false,
                    techStack: techStack || []
                }
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User account model not found." });
        }

        res.status(200).json({
            message: "Ecosystem preferences updated successfully!",
            user: updatedUser
        });

    } catch (error) {
        console.error("Backend Schema Save Error:", error);
        res.status(500).json({ message: "Database update pipeline execution failed." });
    }
};

export const getProfile = async (req, res) => {
    try {
        // 1. Safety fallback: check both req.user.id and req.user._id
        const userId = req.user?.id || req.user?._id;

        // 2. Terminal debug log to catch errors instantly
        console.log("GET_PROFILE HANDSHAKE ROOT LOG - DECODED USER ID:", userId);

        if (!userId) {
            return res.status(401).json({ message: "Access token payload missing identification metrics." });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Builder account profile not found." });
        }

        // 3. Return a clean 200 payload response structure
        res.status(200).json({ user });

    } catch (error) {
        console.error("CRITICAL ERROR INSIDE GETPROFILE CONTROLLER:", error);
        res.status(500).json({ message: "Server registry lookup error.", error: error.message });
    }
};
// --- NEW CRITICAL FIX: TRACK SELECTION SYNC PIPELINE ---
// This handles updating the dynamic track property passed up from your homepage components!
export const updateTrack = async (req, res) => {
    try {
        const userId = req.user.id;
        const { track } = req.body;

        if (!track) {
            return res.status(400).json({ message: "Track string configuration target required." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { track: track } },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User document location matrix unresolvable." });
        }

        res.status(200).json({
            message: `Ecosystem path locked to ${track}!`,
            user: updatedUser
        });
    } catch (error) {
        console.error("Track Selection System Crash:", error);
        res.status(500).json({ message: "Failed to persist chosen tech specialization track." });
    }
};