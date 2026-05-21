import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Signup from '../pages/auth/Signup';
import Signin from '../pages/auth/Signin';
import HomePage from '../pages/HomePage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Dashboard from '../pages/dashboard';
import Challenges from '../components/challenges/challenge';
import { useAuth } from '../context/AuthContext'; 
import ChallengeDetail from '../components/challenges/challengeDetails';
import Lab from '../pages/workspace/lab';
import Settings from '../pages/Settings';
import CommunityHub from '../pages/CommunityHub';

// FIX 2: Removed the duplicate import line from the top and kept the function right here
function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-10 text-center font-bold">Verifying Credentials...</div>;

    // If no user is logged in, or they exist but are a builder, block access completely
    if (!user || user.role !== 'admin') {
        return <Navigate to="/signin" replace />;
    }

    return children;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/homepage" element={<HomePage />} />

            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/:id" element={<ChallengeDetail />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/community" element={<CommunityHub />} />


        </Routes>
    );
}