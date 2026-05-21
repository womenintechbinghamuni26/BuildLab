const features = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#340075]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        ),
        iconBg: "bg-[#EBDCFF]",
        title: "Unmatched Consistency",
        description:
            "Structured monthly cycles ensure you never stop building. Transform sporadic learning into a disciplined professional habit.",
    },
    {
        icon: (
            <img src="/images/people.png" alt="" className="w-6 h-6 object-contain" />
        ),
        iconBg: "bg-[#71F8E4] ",
        title: "Global Community",
        description:
            "Connect with peers across the globe. Review code, share insights, and build your professional network from day one.",
    },
    {
        icon: (
            <img src="/images/eye.png" alt="" className="w-6 h-6 object-contain" />
        ),
        iconBg: "bg-[#E9DDFF] ",
        title: "Proof of Work",
        description:
            "Every challenge completed is a verified addition to your portfolio. Show potential employers exactly what you can build.",
    },
];

export default function Features() {
    return (
        <section className="w-full bg-[#F2F4F6] py-24 px-6 md:px-12 lg:px-20">
            {/* Increased max-width from 5xl to 7xl to fill more screen space */}
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#340075] mb-5 tracking-tight">
                        Structured Ecosystem for Hands-on Learning
                    </h2>
                    <p className="text-[#4A4452] text-lg md:text-xl max-w-2xl mx-auto">
                        BuildLab isn't just a platform; it's a refinery for your digital craft.
                    </p>
                </div>

                {/* Cards Grid - Fully Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-[24px] p-8 md:p-10 shadow-sm border border-[#CCC3D4] flex flex-col gap-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[320px]"
                        >
                            {/* Larger Icon Box */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${feature.iconBg}`}>
                                {feature.icon}
                            </div>

                            {/* Text Content */}
                            <div className="flex flex-col gap-3">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}