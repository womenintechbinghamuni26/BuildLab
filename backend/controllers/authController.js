// 1. UNCOMMENT THIS LINE and make sure it has the .js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const { fullName, email, password, track, adminSecret } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Strict Admin Key Logic
        let assignedRole = "builder";

        // If they provided a key, it MUST be correct
        if (adminSecret) {
            if (adminSecret === process.env.ADMIN_SECRET_KEY) {
                assignedRole = "admin";
            } else {
                // If the key is wrong, STOP HERE and don't generate a token
                return res.status(403).json({
                    message: "Invalid Admin Secret Key. Access Denied."
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            track,
            role: assignedRole,
        });

        // 3. Generate Token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 4. Return Success Message + Token
        res.status(201).json({
            status: "success",
            message: `Welcome to WIT BuildLab, ${assignedRole === 'admin' ? 'Admin' : 'Builder'}!`,
            token,
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure you are using bcrypt.compare correctly
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                track: user.track, // Still send it, but we won't show it for admin
                points: user.points || 0
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
};