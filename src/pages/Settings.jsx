import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    FiUser, FiMail, FiCpu, FiPlus, FiSettings, FiEdit2,
    FiBell, FiLogOut, FiX, FiToggleLeft, FiToggleRight, FiCamera
} from 'react-icons/fi';

export default function Settings() {
    const { user, logout, updateProfileState } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    // Modals state management
    const [isStackModalOpen, setIsStackModalOpen] = useState(false);
    const [newSkill, setNewSkill] = useState({ name: '', level: 'LEARNING' });

    // --- SYSTEM ENVIRONMENT DATA STATES ---
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        bio: '',
        profilePic: '',
        challengeCompletion: true,
        communityInteractions: true,
        laboratoryNews: false,
        techStack: []
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                fullName: user.fullName || '',
                email: user.email || '',
                bio: user.bio || '',
                profilePic: user.profilePic || '',
                challengeCompletion: user.challengeCompletion ?? true,
                communityInteractions: user.communityInteractions ?? true,
                laboratoryNews: user.laboratoryNews ?? false,
                techStack: user.techStack || [] // <--- HERE IS THE DISCONNECT!
            });
        }
    }, [user]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            return toast.error("Image is too large. Please select a file under 2MB.");
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileData(prev => ({ ...prev, profilePic: reader.result }));
            toast.info("Image attached. Click 'Save Profile' to sync with your database.");
        };
        reader.readAsDataURL(file);
    };

    const handleSignOut = () => {
        logout();
        navigate('/signin');
    };

    const handleSaveProfile = async () => {
        setSubmitting(true);
        try {
            // 1. Fire the update API call to save everything to MongoDB permanently
            const { data } = await API.put('/users/profile/update', profileData);

            // 2. SMART MERGE FIX: Instead of passing data.user blindly,
            // we pass our active local profileData variables right back into our global context state!
            if (updateProfileState) {
                updateProfileState({
                    fullName: profileData.fullName,
                    email: profileData.email,
                    bio: profileData.bio,
                    profilePic: profileData.profilePic, // Keeps your Base64 string locked in place!
                    challengeCompletion: profileData.challengeCompletion,
                    communityInteractions: profileData.communityInteractions,
                    laboratoryNews: profileData.laboratoryNews,
                    techStack: profileData.techStack
                });
            }

            toast.success("Ecosystem preferences updated successfully!");
        } catch (err) {
            console.error("Save Error Logs:", err);
            toast.error(err.response?.data?.message || "Failed to sync updates to database.");
        } finally {
            setSubmitting(false);
        }
    };

    const togglePreference = async (key) => {
        // 1. Calculate the freshly toggled state immediately
        const updatedData = {
            ...profileData,
            [key]: !profileData[key]
        };

        // 2. Instantly show it on the UI screen
        setProfileData(updatedData);

        try {
            // 3. Silently push it straight to your MongoDB database in the background
            const { data } = await API.put('/users/profile/update', updatedData);
            if (updateProfileState) updateProfileState(data.user);
            toast.success("Notification setting synchronized!");
        } catch (err) {
            console.error("Failed to sync toggle:", err);
            toast.error("Database failed to lock toggle setting.");
            // Rollback state if database fails
            setProfileData(profileData);
        }
    };

    const handleAddSkillSubmit = async (e) => {
        e.preventDefault();
        if (!newSkill.name.trim()) return toast.warn("Skill name is required.");

        const trackColors = {
            EXPERT: 'text-emerald-600 bg-emerald-50/80 border-emerald-100',
            ADVANCED: 'text-sky-600 bg-sky-50/80 border-sky-100',
            INTERMEDIATE: 'text-amber-600 bg-amber-50/80 border-amber-100',
            LEARNING: 'text-purple-600 bg-purple-50/80 border-purple-100'
        };

        const updatedStack = [...profileData.techStack, {
            name: newSkill.name,
            level: newSkill.level,
            color: trackColors[newSkill.level] || 'text-purple-600 bg-purple-50'
        }];

        // 1. Build the full payload object with the fresh stack list included
        const updatedData = {
            ...profileData,
            techStack: updatedStack
        };

        // 2. Render to screen instantly
        setProfileData(updatedData);
        setIsStackModalOpen(false);
        setNewSkill({ name: '', level: 'LEARNING' });

        try {
            // 3. Lock the new language array directly into MongoDB
            const { data } = await API.put('/users/profile/update', updatedData);
            if (updateProfileState) updateProfileState(data.user);
            toast.success(`Permanently saved ${newSkill.name} to database stack.`);
        } catch (err) {
            console.error("Failed to sync stack array:", err);
            toast.error("Could not append language node to server record.");
        }
    };

    // --- SMOOTH REAL-TIME STORAGE MATH ---
    const totalSkillsCount = profileData.techStack.length;
    const calculatedStorage = totalSkillsCount > 0 ? (totalSkillsCount * 0.15) : 0.0;
    const storagePercentage = Math.min(Math.round((calculatedStorage / 10) * 100), 100);

    return (
        <DashboardLayout>
            <ToastContainer p-4 />

            {/* Header Area */}
            <div className="mb-8">
                <h2 className="text-2xl font-black text-[#1D124B]">Settings</h2>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Manage your builder profile and laboratory preferences.</p>
            </div>

            {/* MAIN CONFIGURATION GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* LEFT SIDE: CONTAINER CARDS */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Main Settings Input Block */}
                    <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-slate-100/80 shadow-sm space-y-6">

                        {/* Profile Section Layout - FIXED IMAGE SQUEEZING */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                            <div className="w-24 h-24 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center justify-center relative group overflow-hidden shrink-0 shadow-inner">
                                {profileData.profilePic ? (
                                    <img src={profileData.profilePic} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <FiUser size={36} className="text-slate-300" />
                                )}
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-all">
                                    <FiCamera size={16} className="mb-1" />
                                    <span>Change</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <div className="text-center sm:text-left space-y-1">
                                <h4 className="font-bold text-[#1D124B] text-lg">{profileData.fullName || "Builder Profile"}</h4>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-md inline-block">
                                    {user?.role === 'admin' ? 'System Administrator' : user?.track || 'General Engineer'}
                                </p>
                            </div>
                        </div>

                        {/* Inputs Block */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-0.5">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100/40 text-slate-700 focus:bg-white focus:border-[#572BA0] outline-none text-sm font-semibold transition-all"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-0.5">Email Address</label>
                                <input
                                    type="email" required
                                    className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100/40 text-slate-700 focus:bg-white focus:border-[#572BA0] outline-none text-sm font-semibold transition-all"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-0.5">Bio</label>
                            <textarea
                                placeholder="Describe your technical core specialty profiles here..."
                                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100/40 text-slate-700 focus:bg-white focus:border-[#572BA0] outline-none text-sm h-28 font-medium resize-none leading-relaxed transition-all"
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-5 py-3 bg-white border border-slate-100 hover:bg-slate-50 text-slate-500 font-bold text-xs rounded-xl transition-colors"
                            >
                                Discard Changes
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveProfile}
                                disabled={submitting}
                                className="px-6 py-3.5 bg-[#2E1065] text-white font-black text-xs rounded-xl hover:bg-[#1D124B] active:scale-[0.99] transition-all disabled:bg-slate-200 shadow-md cursor-pointer"
                            >
                                {submitting ? "Saving Profile..." : "Save Profile"}
                            </button>
                        </div>
                    </div>

                    {/* Technical Stack Section */}
                    <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-base font-black text-[#1D124B]">Technical Stack</h3>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">We'll tailor your challenges based on these preferences.</p>
                            </div>
                            <button
                                onClick={() => setIsStackModalOpen(true)}
                                className="text-xs font-black text-[#572BA0] hover:text-[#2E1065] flex items-center gap-1 bg-purple-50 px-3 py-2 rounded-xl transition-all cursor-pointer"
                            >
                                <FiPlus /> Add Language
                            </button>
                        </div>

                        {profileData.techStack.length > 0 ? (
                            <div className="flex flex-wrap gap-4">
                                {profileData.techStack.map((tech, index) => (
                                    <div key={index} className="p-4 rounded-2xl border border-slate-100 min-w-[120px] text-center flex flex-col items-center justify-center gap-2 shadow-sm bg-white">
                                        <div className={`text-xs font-black px-3 py-1 rounded-xl uppercase tracking-wider border ${tech.color || 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                            {tech.name}
                                        </div>
                                        <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{tech.level}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 font-medium text-xs">
                                No technical stack skills listed yet. Click 'Add Language' to configure your hub profile.
                            </div>
                        )}
                    </div>

                    {/* Notification Preferences */}
                    <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                        <div>
                            <h3 className="text-base font-black text-[#1D124B]">Notification Preferences</h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Stay updated with your build progress and community activity.</p>
                        </div>

                        <div className="divide-y divide-slate-100/60 space-y-4">
                            <div className="flex justify-between items-center pt-2">
                                <div className="space-y-0.5 max-w-xl">
                                    <p className="text-xs font-bold text-[#1D124B]">Challenge Completion</p>
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Notify me when a challenge I started is completed or expires.</p>
                                </div>
                                <button onClick={() => togglePreference('challengeCompletion')} className="text-3xl focus:outline-none transition-transform active:scale-95">
                                    {profileData.challengeCompletion ? <FiToggleRight className="text-[#00BFA5]" size={36} /> : <FiToggleLeft className="text-slate-300" size={36} />}
                                </button>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <div className="space-y-0.5 max-w-xl">
                                    <p className="text-xs font-bold text-[#1D124B]">Community Interactions</p>
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Alert me when someone replies to my comments or projects.</p>
                                </div>
                                <button onClick={() => togglePreference('communityInteractions')} className="text-3xl focus:outline-none transition-transform active:scale-95">
                                    {profileData.communityInteractions ? <FiToggleRight className="text-[#00BFA5]" size={36} /> : <FiToggleLeft className="text-slate-300" size={36} />}
                                </button>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <div className="space-y-0.5 max-w-xl">
                                    <p className="text-xs font-bold text-[#1D124B]">Laboratory News</p>
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Weekly digest of new tools, technologies, and features.</p>
                                </div>
                                <button onClick={() => togglePreference('laboratoryNews')} className="text-3xl focus:outline-none transition-transform active:scale-95">
                                    {profileData.laboratoryNews ? <FiToggleRight className="text-[#00BFA5]" size={36} /> : <FiToggleLeft className="text-slate-300" size={36} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR PANEL */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Subscription Banner */}
                    <div className="bg-gradient-to-br from-[#2E1065] to-[#1D124B] p-6 sm:p-7 rounded-[28px] text-white shadow-xl relative overflow-hidden border border-purple-950">
                        <div className="relative z-10 space-y-5">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black tracking-tight">BuildLab Pro</h3>
                                    <p className="text-purple-300 text-[10px] font-medium">Your subscription renews on Oct 14, 2026</p>
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest bg-white/10 text-[#00BFA5] px-2 py-0.5 rounded border border-white/5">PRO PLAN</span>
                            </div>

                            <ul className="text-[11px] space-y-2 text-purple-200/90 font-bold pl-0.5">
                                <li className="flex items-center gap-2">✓ Unlimited Private Labs</li>
                                <li className="flex items-center gap-2">✓ Early access to Challenges</li>
                                <li className="flex items-center gap-2">✓ Priority Support</li>
                            </ul>

                            <button disabled className="w-full bg-slate-800 text-slate-500 border border-slate-700/60 py-3 rounded-xl font-black text-xs uppercase tracking-wider cursor-not-allowed">
                                Coming Soon
                            </button>
                        </div>
                        <div className="absolute right-[-20%] bottom-[-20%] text-white/5 pointer-events-none">
                            <FiSettings size={180} />
                        </div>
                    </div>

                    {/* Storage Analytics Box */}
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-3">
                        <div className="flex justify-between text-xs font-bold text-[#1D124B]">
                            <span className="text-slate-400 font-medium">Storage Usage</span>
                            <span className="font-black text-slate-700">{calculatedStorage.toFixed(2)} <span className="text-slate-300 font-medium">/ 10 GB</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-50 border border-slate-100/30 rounded-full overflow-hidden">
                            <div className="h-full bg-[#00BFA5] transition-all duration-500 rounded-full" style={{ width: `${storagePercentage}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-slate-400">Environment Volume Capacity</span>
                            <span className="text-[#00BFA5]">{storagePercentage}%</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="w-full py-4 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl border border-red-100 hover:border-transparent font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider shadow-sm"
                    >
                        <FiLogOut /> Logout
                    </button>
                </div>
            </div>

            {/* ================= MODAL DIALOG ================= */}
            {isStackModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-sm p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
                        <button onClick={() => setIsStackModalOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 focus:outline-none">
                            <FiX size={20} />
                        </button>

                        <h3 className="text-lg font-black text-[#1D124B] mb-1">Add Language</h3>
                        <p className="text-slate-400 text-xs mb-6 font-medium">Add a technology node to your tracking metrics.</p>

                        <form onSubmit={handleAddSkillSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language Name</label>
                                <input
                                    type="text" required placeholder="e.g., Rust, Python, Go"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#572BA0] outline-none text-sm font-semibold text-[#1D124B]"
                                    value={newSkill.name}
                                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mastery Tier</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 outline-none cursor-pointer font-bold text-xs text-slate-600"
                                    value={newSkill.level}
                                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                                >
                                    <option value="LEARNING">LEARNING</option>
                                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                                    <option value="ADVANCED">ADVANCED</option>
                                    <option value="EXPERT">EXPERT</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-4 bg-[#2E1065] text-white font-bold text-sm rounded-xl hover:bg-[#1D124B] transition-all cursor-pointer mt-2 uppercase tracking-wider text-xs">
                                Add Skill Badge
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}