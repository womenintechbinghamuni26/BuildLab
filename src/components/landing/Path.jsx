const paths = [
    {
        title: "Beginner",
        description: "Fundamental logic, syntax mastery, and small-scale component building.",
        icon: "/images/baby.png",
        color: "#14B8A6", // Teal
        bgColor: "bg-[#E1FBF9]",
        progressWidth: "25%", // Shorter for beginner
        buttonStyle: "border-2 border-[#14B8A6] text-[#14B8A6] hover:bg-[#14B8A6] hover:text-white",
        isPopular: false
    },
    {
        title: "Intermediate",
        description: "Architecting systems, integrating APIs, and mastering state management.",
        icon: "/images/think.png",
        color: "#7C3AED", // Purple
        bgColor: "bg-[#F3E8FF]",
        progressWidth: "50%", // Mid-way for intermediate
        buttonStyle: "bg-[#340075] text-white hover:bg-[#250055]",
        isPopular: true
    },
    {
        title: "Advanced",
        description: "Performance tuning, distributed systems, and lead-level design patterns.",
        icon: "/images/brain.png",
        color: "#F59E0B", // Orange/Gold
        bgColor: "bg-[#FEF3C7]",
        progressWidth: "85%", // Almost full for advanced
        buttonStyle: "border-2 border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white",
        isPopular: false
    }
];

export default function PathToMastery() {
    return (
        <section className="w-full py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-black text-[#340075] mb-3 tracking-tight">
                        Your Path to Mastery
                    </h2>
                    <p className="text-[#4A4452] text-sm md:text-base font-medium">
                        Every builder starts somewhere. Every builder aims higher.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {paths.map((path, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-[32px] p-8 md:p-10 shadow-sm border-2 transition-all duration-300 hover:shadow-xl flex flex-col items-center text-center 
                            ${path.isPopular ? 'border-[#340075] lg:scale-105 z-10 shadow-purple-100' : 'border-[#F2F2F2]'}`}
                        >
                            {/* Most Popular Badge */}
                            {path.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#340075] text-white text-[10px] font-black px-6 py-2 rounded-full tracking-widest uppercase whitespace-nowrap">
                                    MOST POPULAR
                                </div>
                            )}

                            {/* Icon Circle */}
                            <div className={`w-16 h-16 rounded-full ${path.bgColor} flex items-center justify-center mb-8`}>
                                <img src={path.icon} alt="" className="w-8 h-8 object-contain" />
                            </div>

                            <h3 className="text-2xl font-black text-[#1D124B] mb-4">
                                {path.title}
                            </h3>
                            <p className="text-[#4F4F4F] text-sm md:text-base leading-relaxed mb-10 min-h-[60px]">
                                {path.description}
                            </p>

                            {/* Fixed Progress Bar Logic */}
                            <div className="w-full bg-gray-100 h-2.5 rounded-full mb-12 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700 ease-out"
                                    style={{
                                        width: path.progressWidth,
                                        backgroundColor: path.color
                                    }}
                                />
                            </div>

                            {/* Action Button - mt-auto keeps buttons aligned even if text height varies */}
                            <button className={`w-full py-4 rounded-2xl text-sm font-black tracking-widest uppercase transition-all mt-auto ${path.buttonStyle}`}>
                                Choose Track
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}