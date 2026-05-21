import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api/axios';
import {
    FiMessageSquare, FiEye, FiThumbsUp, FiChevronUp, FiChevronDown,
    FiPlus, FiCompass, FiCheckCircle, FiTrendingUp, FiCalendar, FiUser, FiClock, FiSend, FiTrash2, FiEdit2
} from 'react-icons/fi';

export default function CommunityHub() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Latest Discussions');
    const [statusText, setStatusText] = useState('');

    // --- LIVE SYSTEM DATABASE STATES ---
    const [discussions, setDiscussions] = useState([]);
    const [leaderboardBuilders, setLeaderboardBuilders] = useState([]);
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [pulseMetrics, setPulseMetrics] = useState({ onlineNow: 0, newReviews: 0 });
    const [loading, setLoading] = useState(true);

    // Comment & Edit States
    const [expandedCommentsPostId, setExpandedCommentsPostId] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);
    const [editText, setEditText] = useState('');

    const tabs = ['Latest Discussions', 'Peer Reviews', 'Showcase', 'Off-Topic'];

    const fetchCommunityDataMatrix = async () => {
        try {
            setLoading(true);
            const directToken = localStorage.getItem('token');
            const requestConfig = directToken ? {
                headers: { 'Authorization': `Bearer ${directToken}` }
            } : {};

            const [postsRes, leaderboardRes, sessionsRes, pulseRes] = await Promise.all([
                API.get(`/community/posts?tab=${activeTab}`, requestConfig),
                API.get('/community/leaderboard', requestConfig),
                API.get('/community/sessions', requestConfig),
                API.get('/community/pulse', requestConfig)
            ]);

            setDiscussions(postsRes.data.posts || []);
            setLeaderboardBuilders(leaderboardRes.data.builders || []);
            setUpcomingSessions(sessionsRes.data.sessions || []);
            setPulseMetrics(pulseRes.data.metrics || { onlineNow: 1204, newReviews: 48 });
        } catch (err) {
            console.error("Community Hub sync breakdown:", err);
            toast.error("Network verification failed. Please check your session token.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommunityDataMatrix();
    }, [activeTab]);

    const handleUpvote = async (id, direction) => {
        try {
            const { data } = await API.put(`/community/posts/${id}/vote`, { direction });
            setDiscussions(prev => prev.map(post =>
                post._id === id ? {
                    ...post,
                    upvotes: data.updatedUpvotes,
                    upvotedBy: data.upvotedBy,
                    downvotedBy: data.downvotedBy
                } : post
            ));
        } catch (err) {
            toast.error("Could not complete voting action.");
        }
    };

    const handlePostStatus = async (e) => {
        e.preventDefault();
        if (!statusText.trim()) return toast.warn("Status text wrapper string cannot be empty.");

        try {
            const payload = {
                type: activeTab,
                title: statusText.slice(0, 50) + (statusText.length > 50 ? "..." : ""),
                description: statusText
            };

            const { data } = await API.post('/community/posts', payload);
            setDiscussions(prev => [data.post, ...prev]);
            setStatusText('');
            toast.success("Dispatched check-in log to ecosystem feed matrix!");
        } catch (err) {
            toast.error("Database failed to compile new post document.");
        }
    };

    const handleAddComment = async (postId) => {
        const text = commentInputs[postId];
        if (!text || !text.trim()) return toast.warn("Comment string cannot be left empty.");

        try {
            const { data } = await API.post(`/community/posts/${postId}/comments`, { text });
            setDiscussions(prev => prev.map(post =>
                post._id === postId ? { ...post, comments: data.comments } : post
            ));
            setCommentInputs(prev => ({ ...prev, [postId]: '' }));
            toast.success("Comment added successfully!");
        } catch (err) {
            toast.error("Could not append comment.");
        }
    };

    // --- DYNAMIC POST EDIT & DELETE SUB-MODULES ---
    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you absolutely sure you want to discard this post document log?")) return;
        try {
            await API.delete(`/community/posts/${postId}`);
            setDiscussions(prev => prev.filter(post => post._id !== postId));
            toast.success("Post removed from community index.");
        } catch (err) {
            toast.error("Unauthorized or server dropped deletion command.");
        }
    };

    const handleSaveEdit = async (postId) => {
        if (!editText.trim()) return toast.warn("Content body text cannot be empty.");
        try {
            const { data } = await API.put(`/community/posts/${postId}`, { description: editText });
            setDiscussions(prev => prev.map(post =>
                post._id === postId ? { ...post, description: data.post.description } : post
            ));
            setEditingPostId(null);
            toast.success("Post revisions applied successfully.");
        } catch (err) {
            toast.error("Failed to commit post update edits.");
        }
    };

    const startEditing = (post) => {
        setEditingPostId(post._id);
        setEditText(post.description);
    };

    return (
        <DashboardLayout>
            <ToastContainer p-4 />
            <div className="mb-8">
                <h2 className="text-2xl font-black text-[#1D124B]">Community Hub</h2>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Connect with fellow builders, share your progress, and get expert feedback.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    {/* Check-in Input box */}
                    <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-100/80 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#E8FDF5] text-[#00BFA5] flex items-center justify-center font-bold"><FiCompass size={20} /></div>
                                <div>
                                    <h4 className="text-sm font-black text-[#1D124B]">Weekly Check-in</h4>
                                    <p className="text-[11px] font-black tracking-wider text-slate-400 uppercase mt-0.5">Active Challenge: The Modern Web</p>
                                </div>
                            </div>
                            <button onClick={handlePostStatus} className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#572BA0] font-bold text-xs rounded-xl transition-all cursor-pointer">Post Status</button>
                        </div>
                        <div className="bg-[#F8F9FB] p-5 rounded-2xl border border-slate-100 flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                                {user?.profilePic ? <img src={user.profilePic} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#2E1065] text-white flex items-center justify-center font-bold text-xs"><FiUser size={16} /></div>}
                            </div>
                            <textarea value={statusText} onChange={(e) => setStatusText(e.target.value)} placeholder="What logic loops are you shipping today?" className="w-full bg-transparent text-sm font-semibold text-[#1D124B] placeholder-slate-400 border-none outline-none resize-none h-16 leading-relaxed" />
                        </div>
                    </div>

                    {/* Tabs navigation */}
                    <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar gap-6 pt-2">
                        {tabs.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-bold border-b-2 transition-all cursor-pointer focus:outline-none ${activeTab === tab ? 'border-[#572BA0] text-[#572BA0] font-black' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{tab}</button>
                        ))}
                    </div>

                    {/* Feed Stream */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="py-20 text-center text-xs font-bold text-slate-400 tracking-widest uppercase">Compiling community logs...</div>
                        ) : discussions.length > 0 ? (
                            discussions.map((post) => (
                                <div key={post._id} className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col gap-4 transition-all hover:border-purple-100">
                                    <div className="flex gap-5 items-start w-full">
                                        {/* Upvote controller layout segment */}
                                        {/* Upvote controller layout segment */}
                                        <div className="flex flex-col items-center bg-slate-50/60 border border-slate-100/50 p-2 rounded-xl shrink-0 min-w-[40px]">
                                            <button
                                                onClick={() => handleUpvote(post._id, 'up')}
                                                className={`transition-colors focus:outline-none cursor-pointer ${post.upvotedBy?.includes(user?._id || user?.id)
                                                        ? 'text-[#572BA0] font-black scale-110'
                                                        : 'text-slate-400 hover:text-[#572BA0]'
                                                    }`}
                                            >
                                                <FiChevronUp size={18} />
                                            </button>

                                            <span className="text-xs font-black text-[#1D124B] my-0.5">{post.upvotes || 0}</span>

                                            <button
                                                onClick={() => handleUpvote(post._id, 'down')}
                                                className={`transition-colors focus:outline-none cursor-pointer ${post.downvotedBy?.includes(user?._id || user?.id)
                                                        ? 'text-red-500 font-black scale-110'
                                                        : 'text-slate-400 hover:text-red-500'
                                                    }`}
                                            >
                                                <FiChevronDown size={18} />
                                            </button>
                                        </div>

                                        <div className="flex-1 space-y-3 min-w-0">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-wider">
                                                    <span className="uppercase text-[#572BA0] bg-purple-50 px-2 py-0.5 rounded-md font-black">{post.type}</span>
                                                    <span>•</span>
                                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                    <span>by</span>
                                                    <span className="text-slate-500 font-black">{post.user?.fullName || '@anonymous'}</span>
                                                </div>

                                                {/* SECURE CHECK: Edit/Delete layout triggers only if you own the post */}
                                                {(user?._id === post.user?._id || user?.id === post.user?._id) && (
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => startEditing(post)} className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"><FiEdit2 size={13} /></button>
                                                        <button onClick={() => handleDeletePost(post._id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"><FiTrash2 size={13} /></button>
                                                    </div>
                                                )}
                                            </div>

                                            {editingPostId === post._id ? (
                                                <div className="space-y-2 mt-1">
                                                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-slate-50 text-xs font-semibold text-[#1D124B] p-3 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-purple-200" rows={3} />
                                                    <div className="flex gap-2 justify-end">
                                                        <button onClick={() => setEditingPostId(null)} className="px-3 py-1 bg-slate-100 text-slate-500 font-bold text-[10px] rounded-lg cursor-pointer">Cancel</button>
                                                        <button onClick={() => handleSaveEdit(post._id)} className="px-3 py-1 bg-[#572BA0] text-white font-bold text-[10px] rounded-lg cursor-pointer">Save Revisions</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="text-base font-black text-[#1D124B] leading-snug">{post.title}</h3>
                                                    <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">{post.description}</p>
                                                </>
                                            )}

                                            {/* Footer metrics linked perfectly with MongoDB defaults */}
                                            <div className="flex items-center gap-5 text-slate-400 text-xs pt-2 border-t border-slate-50">
                                                <button onClick={() => setExpandedCommentsPostId(expandedCommentsPostId === post._id ? null : post._id)} className="flex items-center gap-1.5 font-bold hover:text-[#572BA0] focus:outline-none cursor-pointer">
                                                    <FiMessageSquare size={14} /> {post.comments?.length || 0} <span className="hidden sm:inline font-medium text-slate-400/80">comments</span>
                                                </button>
                                                <span className="flex items-center gap-1.5 font-bold"><FiEye size={14} /> {post.views || 0} <span className="hidden sm:inline font-medium text-slate-400/80">views</span></span>
                                                <span className="flex items-center gap-1.5 font-bold text-[#572BA0]"><FiThumbsUp size={14} /> {post.upvotes || 0} <span className="hidden sm:inline font-medium text-purple-400/80">likes</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Collapsible comments list block */}
                                    {expandedCommentsPostId === post._id && (
                                        <div className="w-full pt-4 border-t border-slate-100/60 mt-2 space-y-4 animate-in fade-in zoom-in duration-150">
                                            {post.comments?.map((comment, cIdx) => (
                                                <div key={comment._id || cIdx} className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100/40 flex gap-3 items-start pl-4 sm:pl-12">
                                                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                                        {comment.user?.profilePic ? <img src={comment.user.profilePic} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#572BA0] text-white text-[10px] font-bold flex items-center justify-center"><FiUser size={12} /></div>}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[11px] font-black text-[#1D124B]">{comment.user?.fullName || "@builder"}</span>
                                                            <span className="text-[9px] text-slate-400 font-bold">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-xs font-semibold text-slate-600 mt-0.5 leading-relaxed">{comment.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex items-center gap-3 pl-4 sm:pl-12 pt-2">
                                                <div className="flex-1 flex bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl items-center focus-within:bg-white transition-all">
                                                    <input type="text" value={commentInputs[post._id] || ''} onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })} placeholder="Write a comment..." className="w-full bg-transparent text-xs font-bold text-[#1D124B] outline-none placeholder-slate-400" onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)} />
                                                    <button onClick={() => handleAddComment(post._id)} className="text-[#572BA0] p-1 cursor-pointer"><FiSend size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium text-xs">No discussions found under this path node.</div>
                        )}
                    </div>
                </div>

                {/* Keep RIGHT SIDEBAR PANEL exactly identical to your working code layout */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 bg-gradient-to-br from-[#2E1065] to-[#1D124B] text-white">
                            <h3 className="text-sm font-black uppercase tracking-widest text-purple-200">Top Lab Builders</h3>
                            <p className="text-[10px] text-purple-300 font-bold tracking-wider mt-0.5">SEASON 04 • WEEK 2</p>
                        </div>
                        <div className="p-4 divide-y divide-slate-50">
                            {leaderboardBuilders.map((builder, idx) => (
                                <div key={builder._id || idx} className="flex items-center justify-between py-3 px-2 hover:bg-slate-50/60 rounded-xl transition-all">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-black w-5 text-center ${idx === 0 ? 'text-amber-500' : 'text-slate-400'}`}>{idx + 1}</span>
                                        <div className="w-8 h-8 rounded-full border border-slate-100 overflow-hidden shrink-0 bg-slate-100">
                                            {builder.profilePic ? <img src={builder.profilePic} alt="" className="w-full h-full object-cover" /> : <FiUser size={12} className="text-slate-400 m-auto mt-2 block" />}
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-black text-[#1D124B]">{builder.fullName}</h5>
                                            <p className="text-[10px] text-slate-400 font-medium">{builder.xp || 0} Lab XP</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}