import { useState, useEffect } from 'react';
import { FiUsers, FiChevronRight, FiPlusCircle, FiZap, FiX } from 'react-icons/fi';
import API from '../../api/axios';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

export default function Challenges() {
    const { user } = useAuth();
    const [challenges, setChallenges] = useState([]);
    const [filteredChallenges, setFilteredChallenges] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(true);

    // --- REQUEST TOPIC MODAL STATES ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [requestData, setRequestData] = useState({
        title: '',
        description: ''
    });

    const tracks = ['All', 'Web Dev', 'Data Science', 'UI/UX', 'Cybersecurity'];

    useEffect(() => {
    const fetchChallenges = async () => {
        try {
            const { data } = await API.get('/challenges');
            setChallenges(data || []);
            setFilteredChallenges(data || []);
        } catch (err) {
            console.error("Error loading challenges:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchChallenges();
}, []);

    // --- FIXED: SAFE INTERCEPTOR FALLBACK CONSTRAINTS ---
    // --- FIXED: FORGIVING MATCH MATRIX INTERCEPTOR ---
    useEffect(() => {
        if (activeTab === 'All') {
            setFilteredChallenges(challenges);
        } else {
            setFilteredChallenges(challenges.filter(c => {
                if (!c || !c.track) return false;

                const databaseTrack = c.track.toLowerCase().trim();
                const currentSelectedTab = activeTab.toLowerCase().trim();

                // SMART MATCH: Catches 'web dev', 'webdev', and 'web development' concurrently!
                if (currentSelectedTab === 'web dev') {
                    return databaseTrack.includes('web dev') ||
                        databaseTrack === 'webdev' ||
                        databaseTrack.includes('web');
                }
                if (currentSelectedTab === 'data science') {
                    return databaseTrack.includes('data') || databaseTrack.includes('science');
                }
                if (currentSelectedTab === 'ui/ux') {
                    return databaseTrack.includes('ui') || databaseTrack.includes('ux') || databaseTrack.includes('design');
                }
                if (currentSelectedTab === 'cybersecurity') {
                    return databaseTrack.includes('cyber') || databaseTrack.includes('security');
                }

                return databaseTrack.includes(currentSelectedTab);
            }));
        }
    }, [activeTab, challenges]);

    // --- FIXED: FORGIVING BADGE VISUAL STYLES ---
    const getTrackBadgeStyle = (trackName) => {
        const name = trackName ? trackName.toLowerCase().trim() : 'general';

        if (name.includes('web')) {
            return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
        }
        if (name.includes('data') || name.includes('science')) {
            return 'bg-blue-50 text-blue-600 border border-blue-100';
        }
        if (name.includes('ui') || name.includes('ux') || name.includes('design')) {
            return 'bg-pink-50 text-pink-600 border border-pink-100';
        }
        if (name.includes('cyber') || name.includes('security')) {
            return 'bg-red-50 text-red-600 border border-red-100';
        }

        return 'bg-slate-50 text-slate-600 border border-slate-100';
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await API.post('/requests', requestData);
            toast.success("Topic proposal transmitted to Admin Panel!");
            setIsModalOpen(false);
            setRequestData({ title: '', description: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit proposal.");
            console.error("Topic request error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <ToastContainer p-4 />

            {/* --- HERO SECTION --- */}
            <div className="bg-[#2E1065] rounded-[24px] sm:rounded-[32px] p-6 sm:p-12 text-white relative overflow-hidden mb-8 sm:mb-12 shadow-xl">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                        <FiZap className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-200">Ecosystem Hub</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
                        {challenges.length > 0 ? challenges[0].title : "Browse Engineering Tasks"}
                    </h2>
                    <p className="text-purple-200 text-xs sm:text-base mb-6 sm:mb-8 leading-relaxed max-w-lg font-medium">
                        Select any challenge from the lab. Your progress and points are calculated based on verifiable commits.
                    </p>
                    <button className="w-full sm:w-auto bg-[#00BFA5] text-[#1D124B] px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#00e6c8] transition-all cursor-pointer shadow-lg shadow-emerald-900/20">
                        View Latest Lab
                    </button>
                </div>
                <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 opacity-10 hidden lg:block">
                    <FiZap size={400} />
                </div>
            </div>

            {/* --- TRACK FILTERS --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 lg:mb-10">
                <div className="px-1">
                    <h3 className="text-lg sm:text-xl font-bold text-[#1D124B]">Available Challenges</h3>
                    <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Cross-train across any track in the ecosystem.</p>
                </div>

                <div className="w-full lg:w-auto bg-white p-1.5 rounded-2xl border border-slate-100 flex gap-1 overflow-x-auto no-scrollbar shadow-sm">
                    {tracks.map(track => (
                        <button
                            key={track}
                            onClick={() => setActiveTab(track)}
                            className={`px-4 py-2.5 sm:px-5 rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === track
                                ? 'bg-[#2E1065] text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {track}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- CHALLENGE GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-bold animate-pulse">Syncing with Lab Database...</div>
                ) : filteredChallenges.length > 0 ? (
                    filteredChallenges.map((c) => (
                        <div key={c._id} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group flex flex-col min-h-[380px]">
                            {/* Inside filteredChallenges.map((c) => ...) */}
                            <div className="flex justify-between items-start mb-6">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${getTrackBadgeStyle(c.track)}`}>
                                    {/* Shows the actual database string value so you can spot typos instantly */}
                                    {c.track || 'Unassigned Track'}
                                </span>
                                <div className="flex items-center gap-1.5 text-slate-300 text-[10px] font-bold">
                                    <FiUsers /> 1.2k builders
                                </div>
                            </div>

                            <div className="flex-1">
                                <h4 className="text-xl font-bold text-[#1D124B] mb-3 leading-snug group-hover:text-[#572BA0] transition-colors">{c.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-4 font-medium">
                                    {c.description}
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 space-y-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Difficulty</span>
                                    <span className={`text-[10px] font-bold uppercase ${c.difficulty === 'Stretch' ? 'text-red-500' :
                                        c.difficulty === 'Builder' ? 'text-amber-500' : 'text-emerald-500'
                                        }`}>
                                        {c.difficulty}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 ${c.difficulty === 'Stretch' ? 'bg-red-400 w-full' :
                                        c.difficulty === 'Builder' ? 'bg-amber-400 w-[66%]' : 'bg-emerald-400 w-[33%]'
                                        }`}></div>
                                </div>
                                <Link
                                    to={`/challenges/${c._id}`}
                                    className="w-full py-4 rounded-2xl border border-slate-100 text-[#1D124B] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#2E1065] hover:text-white hover:border-[#2E1065] transition-all cursor-pointer text-center"
                                >
                                    View Challenge <FiChevronRight />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 bg-white rounded-[32px] border border-dashed border-slate-200 text-center">
                        <p className="text-slate-400 font-bold">No active challenges in the {activeTab} track yet.</p>
                    </div>
                )}

                {/* --- REQUEST CARD --- */}
                <div
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-50 p-10 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#572BA0] transition-all"
                >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-all">
                        <FiPlusCircle className="text-slate-300 group-hover:text-[#572BA0]" size={32} />
                    </div>
                    <h4 className="font-bold text-[#1D124B] mb-2">Request Topic</h4>
                    <p className="text-slate-400 text-xs font-medium max-w-[200px] leading-relaxed">
                        Suggest a new engineering challenge for the ecosystem.
                    </p>
                </div>
            </div>

            {/* --- REQUEST MODAL POPUP --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-md p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 outline-none transition-colors"
                        >
                            <FiX size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-[#1D124B] mb-1">Propose Challenge</h3>
                        <p className="text-slate-400 text-xs mb-6 font-medium">Your request will be vetted by system administrators.</p>

                        <form onSubmit={handleRequestSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Concept Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., GraphQL Endpoint Federation"
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#572BA0] outline-none text-sm transition-all font-medium text-[#1D124B]"
                                    value={requestData.title}
                                    onChange={(e) => setRequestData({ ...requestData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Objective Target</label>
                                <textarea
                                    required
                                    placeholder="What architectural problem constraints should builders implement?"
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#572BA0] outline-none text-sm h-28 transition-all font-medium text-[#1D124B] resize-none"
                                    value={requestData.description}
                                    onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-[#2E1065] text-white font-bold text-sm rounded-xl hover:bg-[#1D124B] active:scale-[0.99] transition-all cursor-pointer disabled:bg-slate-200 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Transmitting..." : "Submit Proposal"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}