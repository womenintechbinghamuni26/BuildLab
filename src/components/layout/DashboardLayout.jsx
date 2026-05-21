import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLayout, FiTarget, FiCode, FiUsers, FiSettings, FiSearch, FiBell, FiPlus, FiMenu, FiX, FiHome, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: <FiLayout />, path: '/dashboard' },
        { name: 'Challenges', icon: <FiTarget />, path: '/challenges' },
        { name: 'Lab', icon: <FiCode />, path: '/lab' },
        { name: 'Community', icon: <FiUsers />, path: '/community' },
        { name: 'Settings', icon: <FiSettings />, path: '/settings' },
    ];

    return (
        /* FIXED: Set height to screen and hide body scroll to prevent short sidebar */
        <div className="flex h-screen bg-[#F8F9FB] font-sans overflow-hidden">

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - FIXED: h-full and sticky logic */}
            <aside className={`
                fixed inset-y-0 left-0 z-[70] w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static h-full
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#2E1065] rounded-lg flex items-center justify-center text-white font-bold">W</div>
                        <span className="font-black text-[#1D124B] tracking-tight">WIT BuildLab</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400">
                        <FiX size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === item.path
                                ? 'bg-purple-50 text-[#572BA0]'
                                : 'text-slate-400 hover:bg-slate-50'
                                }`}
                        >
                            {item.icon} {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Replace the entire old bottom button container inside your aside tag with this: */}
                <div className="p-4 border-t border-slate-50">
                    <button
                        onClick={() => { logout(); navigate('/signin'); }}
                        className="w-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm active:scale-95 transition-all cursor-pointer border border-red-100 hover:border-transparent uppercase tracking-wider"
                    >
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                {/* Topbar */}
                <header className="h-16 lg:h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
                    <div className="flex items-center gap-3 flex-1">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600">
                            <FiMenu size={22} />
                        </button>
                        <div className="relative flex-1 max-w-md hidden sm:block">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                type="text"
                                placeholder="Search the lab..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Profile Interactive Container */}
                        <div className="relative flex items-center gap-3 pl-4 border-l border-slate-100">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 text-right hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                            >
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-bold text-[#1D124B] leading-none mb-1">{user?.fullName}</p>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                        {user?.role === 'admin' ? "System Administrator" : user?.track || "General Builder"}
                                    </p>
                                </div>

                                {/* FIXED: Image-driven User Avatar Display Frame Container */}
                                <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-slate-50 border border-slate-100 shadow-md flex items-center justify-center overflow-hidden shrink-0 border-2 border-white">
                                    {user?.profilePic ? (
                                        <img src={user.profilePic} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <FiUser className="text-slate-400" size={16} />
                                    )}
                                </div>
                            </button>

                            {/* Dropdown Menu Overlay */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-[90] animate-in fade-in zoom-in duration-200">
                                    <div className="px-4 py-2 border-b border-slate-50 mb-1 sm:hidden">
                                        <p className="text-sm font-bold text-[#1D124B] truncate">{user?.fullName}</p>
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tight mt-0.5">
                                            {user?.role === 'admin' ? "System Administrator" : user?.track}
                                        </p>
                                    </div>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#572BA0] transition-colors">
                                            <FiSettings /> Admin Panel
                                        </Link>
                                    )}
                                    <Link to="/homepage" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#572BA0] transition-colors">
                                        <FiHome size={14} /> View Site
                                    </Link>
                                    <button
                                        onClick={() => { logout(); navigate('/signin'); }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-t border-slate-50 mt-1 text-left"
                                    >
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* --- FIXED: Main Content Scrolls Independently --- */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-10 no-scrollbar bg-[#F8F9FB]">
                    <div className="max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}