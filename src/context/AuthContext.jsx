import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- FIXED: Page Boot/Refresh Hydration Pipeline ---
    // Inside src/context/AuthContext.jsx
    useEffect(() => {
        const verifySessionAndSyncData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Explicit database pull using the stored token
                const { data } = await API.get('/users/profile/me');

                // Check if user data exists inside the response before setting state
                if (data && data.user) {
                    setUser(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user));
                } else {
                    // If data format is weird, fallback to localStorage to prevent instant logouts
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) setUser(JSON.parse(storedUser));
                }
            } catch (err) {
                console.error("Session verification failed. Falling back to cache:", err);
                // Fallback safety to keep you logged in if the endpoint has a temporary glitch
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        verifySessionAndSyncData();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (formData) => {
        try {
            const { data } = await API.post('/auth/signup', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateProfileState = (updatedUserData) => {
        setUser(prevUser => {
            const freshUser = { ...prevUser, ...updatedUserData };
            localStorage.setItem('user', JSON.stringify(freshUser));
            return freshUser;
        });
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout, updateProfileState }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);