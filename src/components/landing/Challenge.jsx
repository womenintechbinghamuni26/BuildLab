const featuredChallenge = {
    track: "WEB DEVELOPMENT",
    title: "Building a Real-time Collaborative Engine",
    description:
        "Master WebSockets and Operational Transforms by building a shared workspace tool.",
    tags: ["React", "Node.js", "Redis"],
};

const topRightChallenge = {
    track: "DATA SCIENCE",
    title: "Predictive Health Analytics",
    description:
        "Develop a model to identify early warning signs in synthetic patient data using Python and Scikit-Learn.",
    avatars: ["PY", "PD"],
    enrolled: "2.4k Builders Enrolled",
};

const smallCards = [
    {
        color: "border-yellow-400",
        // iconColor: "text-yellow-500",
        icon: (
            <img src="/images/ruler.png" alt="" />
        ),
        title: "Accessibility Audit",
        description: "Redesign a legacy landing page for WCAG compliance.",
    },
    {
        color: "border-red-400",
        // iconColor: "text-red-500",
        icon: (
        <img src="/images/lock.png" alt="" />
        ),
        title: "Threat Modeling",
        description: "Conduct a security assessment of a mock cloud infrastructure.",
    },
];

export default function ChallengeEngine() {
    return (
        <section className="w-full bg-[#F4F4F8] py-16 px-4 sm:px-8 md:px-12">
            <div className="max-w-7xl mx-auto">

                {/* Header Row - Fixed for all screens */}
                <div className="flex flex-row items-center justify-between mb-8">
                    <div className="flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-black text-[#340075] tracking-tight">
                            Challenge Engine
                        </h2>
                        <p className="text-[#4A4452] text-xs md:text-sm">
                            Real-world tracks designed by industry experts.
                        </p>
                    </div>
                    <button className="text-[#340075] text-[10px] md:text-sm font-black tracking-widest uppercase flex items-center gap-1">
                        EXPLORE ALL TRACKS <span className="text-lg">→</span>
                    </button>
                </div>

                {/* Grid Layout - Handled for Mobile and Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT — Big Featured Card (Spans 7 columns on desktop) */}
                    <div className="lg:col-span-7 bg-white rounded-[24px] border-t-[6px] border-[#A855F7] p-6 md:p-10 shadow-sm flex flex-col h-fit">
                        <div className="flex items-center justify-between mb-6">
                            <span className="bg-[#F3E8FF] text-[#7E22CE] text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">
                                {featuredChallenge.track}
                            </span>
                            <div className="w-6 h-6">
                                <img src="/images/Icon.png" alt="" className="w-full h-full object-contain" />
                            </div>
                        </div>

                        <h3 className="text-2xl md:text-4xl font-bold text-[#1D124B] mb-4 leading-tight tracking-tight">
                            {featuredChallenge.title}
                        </h3>

                        <p className="text-[#4F4F4F] text-sm md:text-base leading-relaxed mb-6">
                            {featuredChallenge.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-10">
                            {featuredChallenge.tags.map((tag) => (
                                <span key={tag} className="border-2 border-[#F2F2F2] text-[#4F4F4F] text-[10px] md:text-xs font-bold px-3 py-1 rounded-lg">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <button className="w-full bg-[#340075] hover:bg-[#250055] text-white text-[10px] md:text-xs font-black tracking-[0.2em] uppercase py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Problem Statement
                        </button>
                    </div>

                    {/* RIGHT — The Stack (Spans 5 columns on desktop) */}
                    <div className="lg:col-span-5 flex flex-col gap-6 h-fit">

                        {/* Top Right Card - Shortened to match image */}
                        <div className="bg-white rounded-[24px] border-t-[6px] border-[#14B8A6] p-6 shadow-sm">
                            <div className="flex items-start justify-between mb-4 gap-4">
                                <span className="bg-[#CCFBF1] text-[#0F766E] text-[9px] font-black px-2 py-1 rounded-full tracking-widest uppercase">
                                    {topRightChallenge.track}
                                </span>
                                <h3 className="text-lg md:text-xl font-bold text-[#1D124B] text-right leading-snug">
                                    {topRightChallenge.title}
                                </h3>
                            </div>
                            <p className="text-[#4F4F4F] text-xs md:text-sm leading-relaxed mb-6">
                                {topRightChallenge.description}
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                                <div className="flex -space-x-2">
                                    {topRightChallenge.avatars.map((av) => (
                                        <div key={av} className="w-7 h-7 rounded-full bg-[#E2E8F0] text-black text-[9px] font-bold flex items-center justify-center border-2 border-white">
                                            {av}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[#828282] text-[10px] font-bold">
                                    {topRightChallenge.enrolled}
                                </span>
                            </div>
                        </div>

                        {/* Bottom Row - Responsive grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {smallCards.map((card, i) => (
                                <div key={i} className={`bg-white rounded-[24px] border-t-[4px] ${card.color} p-6 shadow-sm flex flex-col h-full`}>
                                    <div className="w-8 h-8 mb-4">
                                        {card.icon}
                                    </div>
                                    <h3 className="text-base font-bold text-[#1D124B] mb-2 tracking-tight">
                                        {card.title}
                                    </h3>
                                    <p className="text-[#828282] text-[11px] leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}