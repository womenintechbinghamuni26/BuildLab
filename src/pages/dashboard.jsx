import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { FiPlay, FiAward, FiCheckCircle, FiClock, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const [progressData, setProgressData] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProgress = async () => {
            try {
                const { data } = await API.get('/submissions/my-progress');
                setProgressData(data);

                // Find active project
                const active = data.find(s => s.status !== 'completed');
                if (active) {
                    const progress = active.challengeId.deliverables?.length > 0
                        ? Math.round((active.completedDeliverables.length / active.challengeId.deliverables.length) * 100)
                        : 0;
                    setCurrentProject({ ...active.challengeId, progress });
                }
            } catch (err) {
                console.error("Progress fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProgress();
    }, []);

    const displayTrack = user?.track || "Builder";
    const userLevel = Math.floor((user?.points || 0) / 100) + 1;

    return (
        <DashboardLayout>
            {/* Top Stats Section - Now Fully Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between gap-4 mb-8">
                <div className="md:col-span-2 lg:max-w-xl">
                    <h2 className="text-xl lg:text-2xl font-black text-[#1D124B]">Welcome, {user?.fullName?.split(' ')[0]}!</h2>
                    <p className="text-slate-500 text-xs lg:text-sm mt-1 font-medium">Ready to start your first challenge?</p>
                </div>

                <div className="grid grid-cols-2 lg:flex gap-3 w-full lg:w-auto">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                        <p className="text-xl lg:text-2xl font-black text-[#572BA0]">{progressData.filter(s => s.status !== 'completed').length}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Labs</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                        <p className="text-xl lg:text-2xl font-black text-emerald-500">{user?.streak || 0}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Day Streak</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Challenge Card (Dynamic from DB) */}
                    {currentProject ? (
                        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="h-1.5 w-full bg-[#572BA0] absolute top-0 left-0" />
                            <h3 className="text-2xl font-bold text-[#1D124B] mb-2">{currentProject.title}</h3>
                            <p className="text-slate-500 text-sm mb-6">{currentProject.description}</p>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
                                <div className="bg-emerald-400 h-full transition-all" style={{ width: `${currentProject.progress}%` }}></div>
                            </div>
                            <button className="bg-[#2E1065] text-white px-8 py-3 rounded-xl font-bold text-sm">Resume Building</button>
                        </div>
                    ) : (
                        <div className="bg-white p-10 rounded-[32px] border-2 border-dashed border-slate-100 text-center">
                            <p className="text-slate-400 font-bold mb-4">You haven't started a challenge yet.</p>
                            <Link to="/challenges" className="inline-block bg-[#572BA0] text-white px-8 py-3 rounded-xl font-bold text-sm">Browse All Challenges</Link>
                        </div>
                    )}
                </div>

                {/* Right Side Stats */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-emerald-500">Mastery Path</p>
                            <p className="text-lg font-black text-[#1D124B]">
                                Level {userLevel} {displayTrack}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 text-[#572BA0] rounded-xl flex items-center justify-center"><FiAward size={24} /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-[24px] border border-slate-100 text-center shadow-sm">
                            <p className="text-2xl font-black text-[#1D124B]">{user?.points || 0}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Build Points</p>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] border border-slate-100 text-center shadow-sm">
                            <p className="text-2xl font-black text-emerald-500">{user?.streak || 0}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Day Streak</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}