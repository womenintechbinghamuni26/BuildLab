import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import DashboardLayout from '../layout/DashboardLayout';
import { FiArrowLeft, FiClock, FiCpu, FiAward, FiPlay, FiBookOpen } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';

export default function ChallengeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallengeDetails = async () => {
            try {
                const { data } = await API.get(`/challenges/${id}`);
                setChallenge(data);
            } catch (err) {
                console.error("Error pulling challenge context:", err);
                toast.error("Could not trace this challenge file.");
            } finally {
                setLoading(false);
            }
        };
        fetchChallengeDetails();
    }, [id]);

    // --- NEW: DYNAMIC TIME FRAME CALCULATOR ---
    const getTimeFrameLabel = () => {
        if (!challenge?.deadline) return "Flexible Timeline";

        const deadlineDate = new Date(challenge.deadline);
        const today = new Date();

        // Calculate the difference in milliseconds and convert to days
        const timeDiff = deadlineDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) {
            return "Deadline Passed";
        } else if (daysRemaining === 0) {
            return "Due Today";
        } else if (daysRemaining === 1) {
            return "1 Day Remaining";
        } else if (daysRemaining <= 14) {
            return `${daysRemaining} Days Remaining`;
        } else {
            // If it's far out, just display the clean calendar date (e.g., "Due: 5/24/2026")
            return `Due: ${deadlineDate.toLocaleDateString()}`;
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="py-32 text-center text-slate-400 font-bold animate-pulse">Compiling architectural specifications...</div>
            </DashboardLayout>
        );
    }

    if (!challenge) {
        return (
            <DashboardLayout>
                <div className="py-20 text-center text-slate-500 font-bold">Challenge manifest not found.</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <ToastContainer />

            {/* Back to Hub navigation */}
            <Link to="/challenges" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#572BA0] mb-8 transition-colors">
                <FiArrowLeft /> Back to Ecosystem Hub
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-start">

                {/* Left Side: Technical Briefing Sheet */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-purple-50 text-purple-600 px-3 py-1 rounded-lg">
                                {challenge.track} Specification Document
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-[#1D124B] mt-3 leading-tight">{challenge.title}</h2>
                        </div>

                        {/* Metadata Pills - NOW 100% DYNAMIC */}
                        <div className="flex flex-wrap gap-4 pt-2 border-b border-slate-50 pb-6 text-xs font-bold text-slate-400">
                            {/* FIXED: Replaced static text with our runtime calculator function */}
                            <span className="flex items-center gap-1.5 text-purple-600 bg-purple-50/60 px-2.5 py-1 rounded-md">
                                <FiClock /> {getTimeFrameLabel()}
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                                <FiCpu /> Track: {challenge.track}
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                                <FiAward /> Difficulty: {challenge.difficulty}
                            </span>
                        </div>

                        {/* Dynamic Problem Statement Content */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-[#1D124B] uppercase tracking-wider flex items-center gap-2">
                                <FiBookOpen className="text-[#572BA0]" /> Challenge Description & Objectives
                            </h4>
                            <p className="text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-line bg-slate-50/50 p-6 sm:p-8 rounded-[24px] border border-slate-100/60">
                                {challenge.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Deployment Panel Board */}
                <div className="lg:col-span-1">
                    <div className="bg-[#2E1065] p-6 sm:p-8 rounded-[32px] text-white shadow-xl shadow-purple-100 relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div>
                                <h3 className="text-lg font-black tracking-tight">Ready to Initialize?</h3>
                                <p className="text-purple-200 text-xs mt-1 font-medium leading-relaxed">
                                    Spawning this project loads your file system structures and sets up your telemetry panel inside the workspace module.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate(`/lab?challengeId=${challenge._id}`)}
                                className="w-full bg-[#00BFA5] text-[#1D124B] py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#00e6c8] active:scale-[0.98] transition-all shadow-lg shadow-emerald-950/20 cursor-pointer uppercase tracking-wider"
                            >
                                <FiPlay fill="currentColor" size={12} /> Run Build Sandbox
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}