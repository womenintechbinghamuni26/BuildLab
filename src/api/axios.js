import axios from 'axios';

const API = axios.create({
    // This line tells it to use Vercel's variable first, then fall back to localhost if not found
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true
});


API.interceptors.request.use(
    (req) => {
        // 1. Fallback collection lookups to catch token wherever it sits on disk
        const token = localStorage.getItem('token') || localStorage.getItem('userToken');

        // DEBUG SPRINT LOG: Check your browser F12 Console row to see this!
        console.log("AXIOS INTERCEPTOR HANDSHAKE CHECK. FOUND TOKEN STRING:", token ? "Token Loaded" : "NOT FOUND (NULL)");

        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }

        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;