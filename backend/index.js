import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// FIXED: Defined MONGO_URI from your .env file with an absolute safe local fallback string
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wit-buildlab";

// Middlewareconst cors = require('cors');

const allowedOrigins = [
    'https://buildlab-laaef3tkt-toniababys-projects.vercel.app',
    // Add your main production Vercel link here too once it generates
];

const cors = require('cors');

// Make sure this is only declared ONCE in the entire file
const allowedOrigins = [
    'https://buildlab-9e29nn8z4-toniababys-projects.vercel.app',
    'https://buildlab-laaef3tkt-toniababys-projects.vercel.app',
    'https://buildlab-np03u8cwz-toniababys-projects.vercel.app',
    'https://buildlab.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// Crucial: Handle the preflight OPTIONS request explicitly before your routes
app.options('*', cors());

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Route Definitions - Moved right above connection so everything is mounted on launch
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/community", communityRoutes);

// Base Test Route
app.get('/', (req, res) => {
    res.send('WIT BuildLab Backend is Running!');
});

// --- FIXED: MONGOOSE SYNC ENGINE STARTUP PIPELINE ---
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Database connected successfully. Opening laboratory channels...");

        // ONLY accept network connections after MongoDB is completely online!
        app.listen(PORT, () => {
            console.log(`WIT BuildLab Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("CRITICAL DATABASE HANDSHAKE FAILURE:", err.message);
        process.exit(1);
    });

// ❌ DUPLICATE app.listen BLOCK REMOVED FROM HERE TO PREVENT PORT CLASH CRASHES