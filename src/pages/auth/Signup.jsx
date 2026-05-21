import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Separate states for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        track: 'Web Dev',
        adminSecret: '' // Admin Key is back
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        setIsLoading(true);
        try {
            const data = await signup(formData); // This returns the user object from AuthContext
            toast.success("Welcome to BuildLab!");

            // Redirect based on role
            if (data.user.role === 'admin') {
                navigate('/admin'); // Admins go straight to the Dashboard
            } else {
                navigate('/HomePage'); // Regular users go to the Home Page
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed.");
        } finally {
            setIsLoading(false);
        }

        setIsLoading(true);
        try {
            await signup(formData);
            toast.success("Welcome to BuildLab!");
            navigate('/HomePage');
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <ToastContainer />

            <div className="bg-white w-full max-w-[460px] p-6 sm:p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <header className="text-center mb-8">
                    <h1 className="text-[32px] font-bold text-[#191C1E] leading-tight">Create account</h1>
                    <p className="text-[#434655] text-sm mt-2 font-medium">Start your 14-day free trial today.</p>
                </header>

                <button type="button" className="w-full py-3 px-4 border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-all mb-8">
                    <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="" />
                    <span className="text-sm">Sign up with Google</span>
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] bg-slate-100 flex-1"></div>
                    <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">OR</span>
                    <div className="h-[1px] bg-slate-100 flex-1"></div>
                </div>

                <form className="space-y-4" onSubmit={handleSignup}>
                    {/* Full Name */}
                    <div className="space-y-1">
                        <label className="text-[13px] font-bold text-[#1D124B] ml-1">Full Name</label>
                        <input name="fullName" type="text" placeholder="John Doe" required onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#572BA0] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-slate-300" />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-[13px] font-bold text-[#1D124B] ml-1">Email Address</label>
                        <input name="email" type="email" placeholder="name@company.com" required onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#572BA0] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-slate-300" />
                    </div>

                   

                    {/* Password with Eye */}
                    <div className="space-y-1 relative">
                        <label className="text-[13px] font-bold text-[#1D124B] ml-1">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#572BA0] focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password with Eye */}
                    <div className="space-y-1 relative">
                        <label className="text-[13px] font-bold text-[#1D124B] ml-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#572BA0] focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Admin Secret Key (Subtle styling) */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 ml-1 italic">Admin Secret (Optional)</label>
                        <input name="adminSecret" type="password" placeholder="For WIT Staff only" onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-slate-100 focus:border-slate-300 outline-none transition-all text-xs" />
                    </div>

                 

                    <button type="submit" disabled={isLoading}
                        className="w-full bg-[#2E1065] text-white py-4 rounded-xl font-bold mt-2 hover:bg-[#1D124B] active:scale-[0.98] transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300">
                        {isLoading ? "Creating Account..." : "Create Account →"}
                    </button>
                </form>

                <footer className="mt-8 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Already have an account? <Link to="/signin" className="text-[#572BA0] font-bold cursor-pointer hover:underline ml-1">Login</Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}