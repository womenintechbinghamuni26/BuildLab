import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FiPlusCircle, FiLogOut, FiActivity, FiLayers, FiTrash2, FiCalendar, FiEdit3, FiX, FiHome, FiCheckCircle, FiAlertTriangle, FiLink } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [userRequests, setUserRequests] = useState([]);
    const [editingId, setEditingId] = useState(null);

    // Custom Tailwind Modal States
    const [deleteModalId, setDeleteModalId] = useState(null);
    const [noGrantModalId, setNoGrantModalId] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');

    // FIXED: Added templateRepo field to form state defaults
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        track: 'Web Dev',
        difficulty: 'Builder',
        deadline: '',
        templateRepo: ''
    });

    const fetchChallenges = async () => {
        try {
            const { data } = await API.get('/challenges');
            setChallenges(data);
        } catch (err) { console.error(err); }
    };

    const fetchUserRequests = async () => {
        try {
            const { data } = await API.get('/requests');
            setUserRequests(data.filter(r => r.status === 'pending'));
        } catch (err) {
            console.error("Error loading user proposals:", err);
        }
    };

    useEffect(() => {
        fetchChallenges();
        fetchUserRequests();
    }, []);

    const handleLogout = () => { logout(); navigate('/signin'); };

    const handleApproveRequest = async (request) => {
        const feedback = prompt("Enter optional admin feedback notes:", "Approved for active ecosystem rotation.");
        // FIXED: Prompt admin for a repository link when converting user request to a challenge
        const repoLink = prompt("Enter required template repository link for this challenge:", "https://github.com/your-profile/wit-buildlab-challenges.git");

        if (!repoLink || !repoLink.trim()) {
            return toast.warn("A template repository URL is required to approve this challenge.");
        }

        try {
            await API.put(`/requests/${request._id}/status`, {
                status: 'approved',
                adminFeedback: feedback,
                track: 'Web Dev',
                difficulty: 'Builder',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                templateRepo: repoLink.trim() // Passes real repo to create the document
            });
            toast.success("Proposal granted and converted to Live Challenge!");
            fetchUserRequests();
            fetchChallenges();
        } catch (err) {
            toast.error("Failed to approve request.");
        }
    };

    const openNoGrantModal = (id) => {
        setNoGrantModalId(id);
        setFeedbackText('');
    };

    const confirmNoGrant = async (e) => {
        e.preventDefault();
        if (!feedbackText.trim()) return toast.warn("Feedback logs are required.");

        try {
            await API.put(`/requests/${noGrantModalId}/status`, {
                status: 'rejected',
                adminFeedback: feedbackText
            });
            toast.info("Proposal updated to 'No Grant' and returned with feedback logs.");
            setNoGrantModalId(null);
            fetchUserRequests();
        } catch (err) {
            toast.error("Failed to update proposal status.");
        }
    };

    const confirmDelete = async () => {
        try {
            await API.delete(`/challenges/${deleteModalId}`);
            toast.info("Challenge permanently dropped from lab.");
            setDeleteModalId(null);
            fetchChallenges();
        } catch (err) {
            toast.error("Error deleting challenge.");
        }
    };

    const handleEditClick = (challenge) => {
        setEditingId(challenge._id);
        setFormData({
            title: challenge.title,
            description: challenge.description,
            track: challenge.track,
            difficulty: challenge.difficulty,
            deadline: challenge.deadline ? challenge.deadline.split('T')[0] : '',
            templateRepo: challenge.templateRepo || '' // FIXED: Populates edit screen safely
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', track: 'Web Dev', difficulty: 'Builder', deadline: '', templateRepo: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/challenges/${editingId}`, formData);
                toast.success("Challenge updated!");
            } else {
                await API.post('/challenges', formData);
                toast.success("Challenge published!");
            }
            cancelEdit();
            fetchChallenges();
        } catch (err) {
            toast.error(err.response?.data?.message || "Check constraints!");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans pb-20">
            <ToastContainer />

            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 sm:px-8 py-5 bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#2E1065] p-2 rounded-xl shadow-lg shadow-purple-100">
                            <FiLayers className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-lg font-black text-[#1D124B] hidden sm:block">Admin Command</h1>
                    </div>
                    <Link to="/homepage" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#572BA0] bg-slate-50 hover:bg-purple-50/50 px-3 py-1.5 rounded-lg transition-all">
                        <FiHome size={14} /> View Site
                    </Link>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all cursor-pointer">
                    <FiLogOut /> <span className="hidden sm:inline">Logout</span>
                </button>
            </nav>

            <main className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">

                {/* Left Side: Forms and Lists */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Main Form Card */}
                    <div className={`bg-white p-6 sm:p-8 rounded-[32px] shadow-sm border-2 transition-all ${editingId ? 'border-amber-200' : 'border-transparent'}`}>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-[#1D124B] flex items-center gap-2">
                                {editingId ? <><FiEdit3 className="text-amber-500" /> Edit Challenge</> : <><FiPlusCircle className="text-purple-600" /> New Challenge</>}
                            </h2>
                            {editingId && (
                                <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-bold">
                                    <FiX size={18} /> Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[12px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Challenge Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Auth Middleware Implementation"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#572BA0] outline-none transition-all font-medium text-[#1D124B]"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[12px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Problem Statement</label>
                                <textarea
                                    placeholder="What should the builders solve?"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#572BA0] outline-none transition-all h-32 font-medium text-[#1D124B]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            {/* --- FIXED: REQUIRED STARTER REPOSITORY LINK COMPONENT ROW --- */}
                            <div className="space-y-1">
                                <label className="text-[12px] font-bold text-slate-400 ml-1 uppercase tracking-wider flex items-center gap-1">
                                    <FiLink size={12} /> Starter Template Repository URL (Required)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://github.com/your-username/wit-buildlab-challenges.git"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#572BA0] outline-none transition-all font-mono text-xs text-[#572BA0] font-bold"
                                    value={formData.templateRepo}
                                    onChange={(e) => setFormData({ ...formData, templateRepo: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase">Track</label>
                                    <select
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none cursor-pointer font-medium text-[#1D124B]"
                                        value={formData.track}
                                        onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                                    >
                                        <option value="Web Dev">Web Dev</option>
                                        <option value="Data Science">Data Science</option>
                                        <option value="UI/UX">UI/UX</option>
                                        <option value="Cybersecurity">Cybersecurity</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase">Difficulty</label>
                                    <select
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none cursor-pointer font-medium text-[#1D124B]"
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    >
                                        <option value="Starter">Starter</option>
                                        <option value="Builder">Builder</option>
                                        <option value="Stretch">Stretch</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase">Deadline</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none font-medium text-[#1D124B]"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button className={`w-full py-4 text-white font-bold rounded-2xl shadow-xl transition-all cursor-pointer ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#2E1065] hover:bg-[#1D124B]'}`}>
                                {editingId ? 'Update Challenge' : 'Publish to Ecosystem'}
                            </button>
                        </form>
                    </div>

                    {/* Incoming proposals */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                            User Proposals ({userRequests.length})
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {userRequests.length > 0 ? userRequests.map(req => (
                                <div key={req._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between gap-4 border-l-4 border-l-purple-500">
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 px-2 py-1 rounded-md">
                                                Proposed By: {req.userId?.fullName || "Anonymous"}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-400">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-[#1D124B] mt-2 text-base">{req.title}</h4>
                                        <p className="text-sm text-slate-500 mt-1 font-medium leading-relaxed">{req.description}</p>
                                    </div>

                                    <div className="flex gap-2 justify-end pt-3 border-t border-slate-50">
                                        <button onClick={() => handleApproveRequest(req)} className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"><FiCheckCircle /> Grant</button>
                                        <button onClick={() => openNoGrantModal(req._id)} className="flex items-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"><FiAlertTriangle /> No Grant</button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 font-medium text-xs">No incoming user topic requests pending review.</div>
                            )}
                        </div>
                    </div>

                    {/* Live Challenges List Container */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Live Challenges ({challenges.length})</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {challenges.length > 0 ? challenges.map(c => (
                                <div key={c._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 group">
                                    <div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${c.difficulty === 'Stretch' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {c.track} • {c.difficulty}
                                        </span>
                                        <h4 className="font-bold text-[#1D124B] mt-1">{c.title}</h4>
                                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                                            <FiCalendar /> Deadline: {new Date(c.deadline).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto justify-end border-t sm:border-none pt-3 sm:pt-0">
                                        <button onClick={() => handleEditClick(c)} className="p-3 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all cursor-pointer"><FiEdit3 size={18} /></button>
                                        <button onClick={() => setDeleteModalId(c._id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"><FiTrash2 size={18} /></button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium">No challenges published yet.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6 order-first lg:order-last">
                    <div className="bg-[#2E1065] p-8 rounded-[32px] text-white shadow-xl shadow-purple-100">
                        <FiActivity className="text-[#00BFA5] w-10 h-10 mb-4" />
                        <h3 className="text-xl font-bold">Admin Insights</h3>
                        <p className="text-purple-200 text-sm mt-2 leading-relaxed font-medium">
                            The ecosystem currently has <span className="text-white font-bold">{challenges.length} challenges</span> active across all tracks.
                        </p>
                    </div>
                </div>
            </main>

            {/* Modals */}
            {deleteModalId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[24px] w-full max-w-sm p-6 shadow-2xl">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 size={22} /></div>
                        <h4 className="text-lg font-bold text-[#1D124B] text-center mb-2">Delete Challenge?</h4>
                        <p className="text-slate-400 text-xs text-center mb-6 leading-relaxed">This action cannot be undone. This task will be permanently expunged from the active user ecosystem.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModalId(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white font-bold text-xs rounded-xl hover:bg-red-600 shadow-lg shadow-red-100 transition-colors cursor-pointer">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {noGrantModalId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
                        <button onClick={() => setNoGrantModalId(null)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 outline-none"><FiX size={20} /></button>
                        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-4"><FiAlertTriangle size={22} /></div>
                        <h3 className="text-xl font-bold text-[#1D124B] mb-1">Issue 'No Grant' Status</h3>
                        <p className="text-slate-400 text-xs mb-6 font-medium">Please specify architectural feedback adjustments for the user's dashboard.</p>
                        <form onSubmit={confirmNoGrant} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Rejection Feedback Logs</label>
                                <textarea required placeholder="e.g., Concept overlaps with current challenge #4..." className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#572BA0] outline-none text-sm h-28 transition-all font-medium text-[#1D124B] resize-none" value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setNoGrantModalId(null)} className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-all cursor-pointer">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-red-500 text-white font-bold text-sm rounded-xl hover:bg-red-600 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-red-100">Confirm No Grant</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}