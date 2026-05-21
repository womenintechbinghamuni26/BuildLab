import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // FIX: Use formData.email and formData.password
            const data = await login(formData.email, formData.password);

            // Check for user and role safely
            if (data?.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/HomePage');
            }
        } catch (err) {
            toast.error("Invalid credentials");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <ToastContainer />

            {/* Main Card */}
            <div className="bg-white w-full max-w-[440px] p-6 sm:p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">

                <header className="text-center mb-8">
                    <h1 className="text-[32px] font-bold text-[#191C1E] leading-tight">Welcome back</h1>
                    <p className="text-[#434655] text-sm mt-2 font-medium">Please enter your details to sign in.</p>
                </header>

                {/* Google Sign In */}
                <button type="button" className="w-full py-3 px-4 border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-all mb-8">
                    <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="" />
                    <span className="text-sm">Sign in with Google</span>
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] bg-slate-100 flex-1"></div>
                    <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">OR</span>
                    <div className="h-[1px] bg-slate-100 flex-1"></div>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    {/* Email Field */}
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-[#1D124B] ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            required
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#572BA0] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-slate-300"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[13px] font-bold text-[#1D124B]">Password</label>
                            <button type="button" className="text-[12px] font-bold text-[#572BA0] hover:underline cursor-pointer">
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#572BA0] focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center gap-3 py-1">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 rounded border-slate-300 accent-[#572BA0] cursor-pointer"
                        />
                        <label htmlFor="remember" className="text-[13px] text-slate-500 font-medium cursor-pointer">
                            Remember me for 30 days
                        </label>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#572BA0] text-white py-4 rounded-xl font-bold mt-2 hover:bg-[#452280] active:scale-[0.98] transition-all shadow-lg shadow-purple-100 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
                    >
                        {isLoading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <footer className="mt-10 text-center">
                    <p className="text-sm text-[#434655] font-medium">
                        Don't have an account?
                        <Link to="/signup" className="text-[#572BA0] font-bold cursor-pointer hover:underline ml-1">
                            Create an account
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}