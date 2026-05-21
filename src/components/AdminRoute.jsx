import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    // If no user or user is NOT an admin, kick them to the home page
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
}