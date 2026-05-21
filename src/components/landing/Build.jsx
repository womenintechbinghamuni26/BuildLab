const features = [
    "Real-time Progress Tracking",
    "Direct GitHub Integration",
    "Structured Tech Explanations"
];

export default function BuildHub() {
    return (
        <section className="w-full bg-[#D8DADC] py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                {/* LEFT — Content (Now slightly narrower to give room to the dashboard) */}
                <div className="w-full lg:w-[40%] space-y-10">
                    <h2 className="text-5xl md:text-6xl font-black text-[#340075] tracking-tighter leading-tight">
                        The BuildHub
                    </h2>
                    <p className="text-[#4F4F4F] text-lg md:text-xl leading-relaxed max-w-md">
                        Centralized project management for every challenge you undertake. No more lost repos or forgotten lessons.
                    </p>

                    <div className="space-y-6">
                        {features.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-[#14B8A6] flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-[#1D124B] font-bold text-lg md:text-xl tracking-tight">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT — Floating Dashboard Preview */}
                <div className="w-full lg:w-[65%] relative py-10">

                    <div className="relative z-10 w-full bg-white rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-12 border border-white/50">

                        {/* User Header - Stacked on small mobile, row on tablet+ */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-8 mb-10 gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-[#EBDCFF] flex items-center justify-center text-[#340075] font-black text-xl shrink-0">
                                    JD
                                </div>
                                <div>
                                    <h4 className="font-black text-[#1D124B] text-xl md:text-2xl tracking-tight">Jordan Doe</h4>
                                    <p className="text-xs md:text-sm text-slate-400 font-bold mt-1">Active Project: Neo-Bank API</p>
                                </div>
                            </div>
                            <div className="flex gap-4 text-black-400 self-end sm:self-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /></svg>
                            </div>
                        </div>

                        {/* Middle Section: Progress & Feedback */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
                            {/* Progress Card - Full width on mobile, 7/12 on desktop */}
                            <div className="md:col-span-7 bg-white border border-[#F1F5F9] rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm">
                                <p className="text-[10px] font-black tracking-widest text-[#A1A1AA] uppercase mb-6">Milestone Progress</p>
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="flex-1 bg-[#D1FAE5] h-10 md:h-14 rounded-xl md:rounded-2xl overflow-hidden relative">
                                        <div className="bg-[#14B8A6] h-full w-[65%] rounded-xl md:rounded-2xl" />
                                    </div>
                                    <span className="text-2xl md:text-4xl font-black text-[#1D124B]">65%</span>
                                </div>
                                <p className="mt-4 text-[10px] md:text-sm font-bold text-[#A1A1AA]">Database Schema Finalized</p>
                            </div>

                            {/* Feedback Card - Full width on mobile, 5/12 on desktop */}
                            <div className="md:col-span-5 bg-white border border-[#F1F5F9] rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm">
                                <p className="text-[10px] font-black tracking-widest text-[#A1A1AA] uppercase mb-6">Recent Feedback</p>
                                <div className="flex gap-4">
                                    <div className="w-5 h-10 bg-[#D8B4FE] rounded-full shrink-0" />
                                    <div className="flex flex-col overflow-hidden">
                                        <p className="text-xs md:text-sm font-bold text-[#1D124B] leading-tight italic truncate md:whitespace-normal">
                                            "Consider using a factory pattern..."
                                        </p>
                                        <p className="mt-2 text-[#14B8A6] font-black text-[10px] uppercase tracking-tighter">
                                            — Mentor Sarah
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Submit Bar */}
                        <div className="bg-[#340075] rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="text-center sm:text-left">
                                <p className="text-white font-black text-lg md:text-xl tracking-tight">Submit Build V1.2</p>
                                <p className="text-[#A78BFA] text-[10px] md:text-xs font-bold">Final verification for March Cohort</p>
                            </div>
                            <button className="w-full sm:w-auto bg-[#71F8E4] text-[#006F64] font-black text-xs px-8 py-4 rounded-xl md:rounded-2xl tracking-widest uppercase shadow-lg shadow-[#71F8E4]/20 active:scale-95 transition-all">
                                SUBMIT NOW
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}