// backend/models/Challenge.js
import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },

    // CRITICAL CORRECTION: Ensure this is explicitly named "track"
    track: {
        type: String,
        required: true,
        enum: ['Web Dev', 'Data Science', 'UI/UX', 'Cybersecurity'],
        default: 'Web Dev'
    },

    difficulty: {
        type: String,
        enum: ['Starter', 'Builder', 'Stretch'],
        default: 'Starter'
    },
    // Add this field to your challengeSchema object
    templateRepo: {
        type: String,
        default: "https://github.com/wit-buildlab-challenges/base-template"
    },
    
    points: { type: Number, default: 100 }
}, { timestamps: true });

export default mongoose.model("Challenge", challengeSchema);