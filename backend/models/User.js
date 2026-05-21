import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["builder", "admin"],
        default: "builder",
    },
    currentPath: {
        type: String,
        enum: ["Starter", "Builder", "Stretch"],
        default: "Starter",
    },

    // ================= NEW ECOSYSTEM FIELDS FOR SETTINGS =================
    bio: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        default: "", // Saves your base64 image strings safely
    },
    challengeCompletion: {
        type: Boolean,
        default: true,
    },
    communityInteractions: {
        type: Boolean,
        default: true,
    },
    laboratoryNews: {
        type: Boolean,
        default: false,
    },
    githubUsername: {
        type: String,
        default: "" // Saved when they connect their GitHub account profile
    },
    // Array layout structure to hold your custom track badges
    techStack: [{
        name: { type: String },
        level: { type: String },
        color: { type: String }
    }]
}, {
    timestamps: true,
});

export default mongoose.model("User", userSchema);