import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate= useNavigate();
    return (
        <nav className="fixed top-0 left-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto h-[72px] flex items-center justify-between px-4 sm:px-6 lg:px-10">

                {/* Logo */}
                <a
                    href="/"
                    aria-label="WIT BuildLab Home"
                    className="flex items-center flex-shrink-0"
                >
                    <img
                        src="/logo.png"
                        alt="WIT BuildLab"
                        className="
                            h-6
                            sm:h-7
                            md:h-8
                            w-auto
                            object-contain
                        "
                    />
                </a>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

                    {/* Sign In */}
                    <button
                    onClick={() => navigate("/signin")}
                    className="text-[12px] sm:text-[13px] md:text-sm font-medium text-[#6931a0] hover:opacity-70 transition whitespace-nowrap"
                    >
                    Sign In
                </button>

                    {/* Join Button */}
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-gradient-to-r from-[#1faab2] to-[#675ed4] text-white text-[11px] sm:text-[13px] md:text-sm font-semibold px-3 sm:px-5 py-2 rounded-full shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
                    >
                        Join BuildLab
                    </button>

                </div>
            </div>
        </nav>
    );
}

// who is like you oh lord no words can carry from-[#1faab2] to-[#675ed4]