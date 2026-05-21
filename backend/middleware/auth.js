// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Contains user ID and role encrypted in token
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// CRITICAL MIDDLEWARE FOR ADMIN PROTECTION
export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden. Administrative access required." });
        }
        next(); // User verified as admin. Proceed to controller operation.
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};