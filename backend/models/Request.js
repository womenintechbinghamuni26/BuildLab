import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminFeedback: {
        type: String, 
        default: ''
    }
}, { timestamps: true });

export default mongoose.model('Request', requestSchema);