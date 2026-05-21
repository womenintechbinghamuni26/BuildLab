import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiLogOut, FiSettings, FiLayout, FiChevronDown, FiClock, FiBarChart2, FiChevronRight, FiHome, FiUser } from 'react-icons/fi';
import API from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function HomePage() {
    const { user, logout, setUser } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const { data } = await API.get('/challenges');
                setChallenges(data.slice(0, 4));
            } catch (err) {
                console.error("Error fetching labs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    // --- 2. CHOOSE YOUR PATH DYNAMIC UPDATE ---
    const handleTrackSelection = async (selectedTrack) => {
        try {
            // Sends PUT request to change the builder's chosen ecosystem specialization
            const { data } = await API.put(`/users/profile`, { track: selectedTrack });

            // Updates internal Auth Context state dynamically
            setUser(prev => ({ ...prev, track: selectedTrack }));
            toast.success(`Ecosystem path altered to ${selectedTrack}!`);

            // Seamless transition straight to your personalized project panel
            navigate('/dashboard');
        } catch (err) {
            toast.error("Could not bind your profile path update.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans">
            <ToastContainer />

            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6">
                        <img src="/images/Icon.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    <Link to="/HomePage" aria-label="WIT BuildLab Home" className="flex items-center flex-shrink-0">
                        <img src="/logo.png" alt="WIT BuildLab" className="h-6 sm:h-7 md:h-8 w-auto object-contain" />
                    </Link>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-200"
                    >
                        {/* FIXED: Dynamic Image display utilizing your new uploaded base64 strings */}
                        <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shadow-md shrink-0">
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <FiUser className="text-slate-400" size={14} />
                            )}
                        </div>
                        <FiChevronDown className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-[60] animate-in fade-in zoom-in duration-200">
                            <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
                                <p className="text-sm font-bold text-[#1D124B] truncate">{user?.fullName}</p>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight mt-0.5">{user?.role === 'admin' ? "System Administrator" : user?.track}</p>
                            </div>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#572BA0] transition-colors">
                                    <FiSettings /> Admin Panel
                                </Link>
                            )}
                            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#572BA0] transition-colors">
                                <FiLayout /> Dashboard
                            </Link>
                            <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#572BA0] transition-colors">
                                <FiSettings /> Settings
                            </Link>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-t border-slate-50 mt-1">
                                <FiLogOut /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="max-w-5xl mx-auto pt-16 px-6">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-[#EBDCFF] text-[#572BA0] px-4 py-1.5 rounded-full text-xs font-bold mb-8">
                        <span className="uppercase text-[#572BA0] tracking-wider">✨ Now Live: BuildHub V2.0</span>
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-bold text-[#340075] mb-6 leading-tight">Build. Share. Iterate.</h1>
                    <p className="text-[#4A4452] text-lg max-w-2xl mx-auto mb-10">Master the craft of software engineering through structured challenges and peer-reviewed cycles.</p>

                    {/* LINKED 1: Join the Challenge Route */}
                    <Link to="/challenges" className="inline-block w-full max-w-sm py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#006B5F] to-[#340075] shadow-xl hover:opacity-90 transition-all text-center">
                        Join the Challenge
                    </Link>
                </div>

                {/* Builders Count */}
                <div className="flex items-center justify-center gap-3 mb-16">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 overflow-hidden">
                                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="builder" />
                            </div>
                        ))}
                    </div>
                    <span className="text-sm text-[#4A4452] font-medium">1.2k+ builders building today</span>
                </div>

                {/* Code Editor Preview */}
                <div className="flex justify-center items-center w-full mb-20 px-4 sm:px-0">
                    <div className="w-full group transition-transform duration-300 hover:scale-[1.01]">
                        <img src="/images/codeEditor.png" alt="WIT BuildLab Code Editor" className="w-full h-auto rounded-[24px] cursor-pointer" />
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    <div className="bg-white p-10 rounded-[24px] shadow-sm border border-slate-100 text-center group hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-[#F0FDFA] text-[#0D9488] rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-[#572BA0] font-bold text-lg mb-2">Unmatched Consistency</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Daily architectural prompts designed to build muscle memory and deep focus.</p>
                    </div>

                    <div className="bg-white p-10 rounded-[24px] shadow-sm border border-slate-100 text-center group hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-[#F5F3FF] text-[#7C3AED] rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <h3 className="text-[#572BA0] font-bold text-lg mb-2">Global Community</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Connect with 50,000+ builders worldwide for real-time collaboration and feedback.</p>
                    </div>

                    <div className="bg-white p-10 rounded-[24px] shadow-sm border border-slate-100 text-center group hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-[#F0FDF4] text-[#16A34A] rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <h3 className="text-[#572BA0] font-bold text-lg mb-2">Proof of Work</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Your profile isn't a resume; it's a verifiable repository of every line you've shipped.</p>
                    </div>
                </div>

                {/* The Build Cycle Section */}
                <section className="bg-[#F8F9FB] border-t border-slate-100 pt-20 pb-32">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-[#572BA0] font-bold text-sm uppercase tracking-[0.3em]">The Build Cycle</h2>
                        </div>

                        <div className="space-y-20">
                            <div className="flex flex-col items-start">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-[#1D124B] text-white flex items-center justify-center font-bold text-xs shadow-md">1</div>
                                    <h3 className="text-[#572BA0] font-bold text-lg">Create</h3>
                                </div>
                                <p className="text-slate-500 text-sm font-medium mb-6 max-w-2xl leading-relaxed">Take on a core challenge and ship a working prototype following modern standards.</p>
                                <div className="w-full max-w-3xl aspect-[21/9] rounded-[20px] overflow-hidden shadow-sm border border-slate-200 bg-white">
                                    <img src="/images/cycle1.png" alt="Create Step" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <div className="flex flex-col items-start">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-[#1D124B] text-white flex items-center justify-center font-bold text-xs shadow-md">2</div>
                                    <h3 className="text-[#572BA0] font-bold text-lg">Share</h3>
                                </div>
                                <p className="text-slate-500 text-sm font-medium mb-6 max-w-2xl leading-relaxed">Publish your build to the community for audit, feedback, and architectural debate.</p>
                                <div className="w-full max-w-3xl aspect-[21/9] rounded-[20px] overflow-hidden shadow-sm border border-slate-200 bg-white">
                                    <img src="/images/cycle2.png" alt="Share Step" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <div className="flex flex-col items-start">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-[#1D124B] text-white flex items-center justify-center font-bold text-xs shadow-md">3</div>
                                    <h3 className="text-[#572BA0] font-bold text-lg">Improve</h3>
                                </div>
                                <p className="text-slate-500 text-sm font-medium mb-6 max-w-2xl leading-relaxed">Refactor your code based on insights and earn your mastery badge for the sprint.</p>
                                <div className="w-full max-w-3xl aspect-[21/9] rounded-[20px] overflow-hidden shadow-sm border border-slate-200 bg-white">
                                    <img src="/images/cycle3.png" alt="Improve Step" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Active Lab Section */}
                <div className="mb-20">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-[#340075]">Active Lab</h2>
                        <p className="text-slate-500 text-sm">Latest challenges from the lab.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {loading ? (
                            <div className="py-10 text-center text-slate-400">Loading labs...</div>
                        ) : challenges.length > 0 ? (
                            challenges.map((lab) => (
                                <div key={lab._id} onClick={() => navigate('/challenges')} className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm flex justify-between items-center group hover:border-purple-200 transition-all cursor-pointer">
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-1 rounded">
                                            {lab.track}
                                        </span>
                                        <h3 className="text-lg font-bold text-[#340075]">{lab.title}</h3>
                                        <p className="text-slate-500 text-sm max-w-xl">{lab.description}</p>
                                        <div className="flex items-center gap-4 text-slate-400 text-xs">
                                            <span className="flex items-center gap-1"><FiClock /> {lab.deadline ? new Date(lab.deadline).toLocaleDateString() : 'Flexible'}</span>
                                            <span className="flex items-center gap-1"><FiBarChart2 /> {lab.difficulty}</span>
                                        </div>
                                    </div>
                                    <FiChevronRight className="text-slate-300 group-hover:text-[#572BA0] group-hover:translate-x-1 transition-all" size={20} />
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-slate-400">No active challenges found.</div>
                        )}
                    </div>
                </div>

                {/* --- CHOOSE YOUR PATH SECTION (LINKED) --- */}
                <div className="mb-32">
                    <div className="text-center mb-12">
                        <h2 className="text-[#572BA0] font-bold text-sm uppercase tracking-[0.3em]">Choose Your Path</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Web Dev Option */}
                        <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between p-8 hover:shadow-md transition-all">
                            <div>
                                <div className="w-12 h-12 bg-[#E0F2F1] text-[#00BFA5] rounded-xl flex items-center justify-center mb-6">🔑</div>
                                <h3 className="text-xl font-bold text-[#1D124B] mb-2">Web Development</h3>
                                <p className="text-slate-500 text-sm mb-8">Master responsive modern layouts, high-concurrency systems, and state trees.</p>
                            </div>
                            <button onClick={() => handleTrackSelection('Web Dev')} className="w-full py-3 rounded-xl border-2 border-[#00BFA5] text-[#00BFA5] font-bold text-sm hover:bg-[#00BFA5] hover:text-white transition-all cursor-pointer">
                                Select Web Dev Path
                            </button>
                        </div>

                        {/* Data Science Option */}
                        <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between p-8 hover:shadow-md transition-all">
                            <div>
                                <div className="w-12 h-12 bg-purple-50 text-[#7C3AED] rounded-xl flex items-center justify-center mb-6">📊</div>
                                <h3 className="text-xl font-bold text-[#1D124B] mb-2">Data Science</h3>
                                <p className="text-slate-500 text-sm mb-8">Architect pipeline structures, train local logic scripts, and compute variables.</p>
                            </div>
                            <button onClick={() => handleTrackSelection('Data Science')} className="w-full py-3 rounded-xl border-2 border-[#7C3AED] text-[#7C3AED] font-bold text-sm hover:bg-[#7C3AED] hover:text-white transition-all cursor-pointer">
                                Select Data Science Path
                            </button>
                        </div>

                        {/* Cybersecurity Option */}
                        <div className="bg-[#2E1065] rounded-[24px] overflow-hidden p-8 text-white flex flex-col justify-between shadow-xl">
                            <div>
                                <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center mb-6">🛡️</div>
                                <h3 className="text-xl font-bold mb-2">Cybersecurity</h3>
                                <p className="text-white/60 text-sm mb-8">Secure localized endpoints, audit token vectors, and protect system states.</p>
                            </div>
                            <button onClick={() => handleTrackSelection('Cybersecurity')} className="w-full py-3 rounded-xl bg-white text-[#2E1065] font-bold text-sm hover:bg-slate-100 transition-all cursor-pointer">
                                Select Security Path
                            </button>
                        </div>
                    </div>
                </div>

                {/* Community Pulse Section */}
                <div className="mb-32">
                    <div className="text-center mb-12">
                        <h2 className="text-[#572BA0] font-bold text-sm uppercase tracking-[0.3em]">Community Pulse</h2>
                    </div>

                    {/* PLUGGED: Community page placeholder context banner */}
                    <div className="max-w-3xl mx-auto bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm mb-8 text-center">
                        <span className="bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">Feature Incoming</span>
                        <h4 className="text-base font-bold text-[#1D124B] mt-3">The Community Hub is currently compiling logs...</h4>
                        <p className="text-xs text-slate-400 mt-1">Soon you'll be able to trace all global code critiques and technical debates right from this viewport.</p>
                    </div>

                    <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-sm relative overflow-hidden opacity-70">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center font-bold text-[#2E1065]">JD</div>
                                <div>
                                    <h4 className="font-bold text-[#1D124B]">Jordan Doe</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level 8 Architect</p>
                                </div>
                            </div>
                            <div className="bg-[#F0FDFA] p-6 rounded-2xl border border-emerald-50 mb-4">
                                <p className="text-[#065F46] text-sm italic leading-relaxed font-medium">
                                    "The peer review on my core application refactor was brutal but exactly what I needed to polish performance bottlenecks."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stop Watching CTA Section */}
                <section className="bg-[#2E1065] py-24 px-6 text-center text-white rounded-[32px] overflow-hidden relative">
                    <div className="max-w-3xl mx-auto relative z-10">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">Stop Watching. <br /> Start Building.</h2>
                        <p className="text-purple-200 text-lg mb-12 font-medium leading-relaxed">
                            Theory is only half the battle. Your professional growth is measured in commits, not certificates.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            {/* LINKED 4: Lab tracker/Dashboard link placeholder until Lab sandbox is deployed */}
                            <Link to="/dashboard" className="w-full sm:w-64 py-4 bg-[#00BFA5] text-[#1D124B] font-bold rounded-xl shadow-xl hover:bg-[#00e6c8] transition-all text-center">
                                Start Building Today
                            </Link>
                            {/* LINKED 4: Browse challenges route shortcut */}
                            <Link to="/challenges" className="w-full sm:w-64 py-4 bg-transparent border-2 border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all text-center">
                                Browse Challenges
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="bg-[#050B18] pt-20 pb-10 px-6 text-slate-400 border-t border-slate-900 mt-20 rounded-[32px] overflow-hidden">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="md:col-span-2 space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-[#00BFA5] p-1.5 rounded-lg">
                                    <span className="text-black font-black text-xs">&lt;/&gt;</span>
                                </div>
                                <span className="text-xl font-black text-white tracking-tight">WIT BuildLab</span>
                            </div>
                            <p className="max-w-xs text-sm leading-relaxed">
                                The premier lab for digital engineers to hone their craft through intense iteration and global collaboration.
                            </p>
                        </div>

                        {/* LINKED 5: Ecosystem column linked directly to live paths */}
                        <div>
                            <h5 className="text-[10px] font-black text-[#00BFA5] uppercase tracking-[0.2em] mb-6">Ecosystem</h5>
                            <ul className="space-y-4 text-sm font-medium">
                                <li><Link to="/challenges" className="hover:text-white transition-colors">Challenges</Link></li>
                                <li><Link to="/dashboard" className="hover:text-white transition-colors">Mastery Paths</Link></li>
                                <li><Link to="/lab" className="hover:text-white transition-colors">BuildHub</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="text-[10px] font-black text-[#00BFA5] uppercase tracking-[0.2em] mb-6">Company</h5>
                            <ul className="space-y-4 text-sm font-medium">
                                <li><span className="text-slate-600 cursor-not-allowed">About Lab</span></li>
                                <li><span className="text-slate-600 cursor-not-allowed">Privacy</span></li>
                                <li><span className="text-slate-600 cursor-not-allowed">Terms</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto pt-10 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-slate-800 cursor-pointer transition-all">🌐</div>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                            © 2026 WIT BuildLab. All building rights reserved.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}