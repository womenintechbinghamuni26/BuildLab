export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-[#F9FAFB] border-t border-slate-200 py-12 px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

                {/* Brand & Copyright Section */}
                <div className="space-y-2">
                    <h2 className="text-xl font-black text-[#1D124B] tracking-tight">
                        WIT BuildLab
                    </h2>
                    <p className="text-[#828282] text-xs md:text-sm font-medium">
                        © {currentYear} WIT BuildLab. Engineered for the Expert Builder.
                    </p>
                </div>

                {/* Navigation Links - Wrap on mobile, single row on desktop */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-[#828282] text-xs md:text-sm font-semibold">
                    <a href="#" className="hover:text-[#340075] transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-[#340075] transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-[#340075] transition-colors">Discord Community</a>
                    <a href="#" className="hover:text-[#340075] transition-colors">GitHub</a>
                    <a href="#" className="hover:text-[#340075] transition-colors">Contact Us</a>
                </div>

                {/* Social Icons Section */}
                <div className="flex items-center gap-4">
                    {/* Share Icon Button */}
                    <button className="w-12 h-12 rounded-full bg-[#E8EDF2] flex items-center justify-center text-[#1D124B] hover:bg-[#D1D5DB] transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>

                    {/* Message/Mail Icon Button */}
                    <button className="w-12 h-12 rounded-full bg-[#E8EDF2] flex items-center justify-center text-[#1D124B] hover:bg-[#D1D5DB] transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>

            </div>
        </footer>
    );
}