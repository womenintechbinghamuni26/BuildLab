import Request from '../models/Request.js';
import Challenge from '../models/Challenge.js';

// --- 1. USER: Propose a new topic ---
export const createRequest = async (req, res) => {
    try {
        const { title, description } = req.body;

        const newRequest = new Request({
            userId: req.user.id, // Pulled securely from your auth token middleware
            title,
            description
        });

        await newRequest.save();
        res.status(201).json({ message: "Proposal logged successfully", request: newRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- 2. ADMIN: View all submitted user requests ---
export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find()
            .populate('userId', 'fullName email') // Joins user data so you know who asked
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- 3. ADMIN: Update Status (Approve or Send to Dashboard) ---
export const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminFeedback, track, difficulty, deadline } = req.body;

        const request = await Request.findById(id);
        if (!request) return res.status(404).json({ message: "Proposal module not found" });

        request.status = status;
        if (adminFeedback) request.adminFeedback = adminFeedback;
        await request.save();

        // AUTOMATION: If admin GRANTS request, instantly turn it into a real Live Challenge card!
        if (status === 'approved') {
            const newChallenge = new Challenge({
                title: request.title,
                description: request.description,
                track: track || 'Web Dev',
                difficulty: difficulty || 'Builder',
                deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now default
            });
            await newChallenge.save();
        }

        res.status(200).json({ message: `Proposal status updated to ${status}`, request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- 4. USER: Fetch my submitted requests (For Notifications / Dashboard status) ---
export const getMyRequests = async (req, res) => {
    try {
        const myRequests = await Request.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(myRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};