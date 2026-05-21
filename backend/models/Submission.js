import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    builder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    projectLink: { type: String, required: true }, // GitHub, Figma, etc.
    liveDemo: { type: String }, // Deployed app link
    explanation: { type: String, required: true }, // "Concise explanation of the solution"
    reflections: { type: String }, // "Challenges encountered and lessons learned"
    feedback: [{
        reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model("Submission", submissionSchema);