const steps = [
    {
        number: 1,
        color: "bg-[#340075]", // Darker purple from image
        title: "Create",
        description:
            "Receive a high-level industry problem statement. Design and develop your unique solution using provided resources.",
    },
    {
        number: 2,
        color: "bg-[#006B5F]", // Teal/Green from image
        title: "Share",
        description:
            "Submit your work to the BuildHub. Get visibility within the community and present your technical reasoning.",
    },
    {
        number: 3,
        color: "bg-[#340075]", // Back to purple
        title: "Improve",
        description:
            "Receive peer and mentor reviews. Iterate on your project to meet industry-standard best practices.",
    },
];

export default function GrowthCycle() {
    return (
        <section className="w-full py-24 px-6 md:px-16 lg:px-24 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                {/* LEFT — Steps Content */}
                <div className="flex-1 w-full">
                    <h2 className="text-3xl md:text-4xl font-black text-[#340075] mb-14 tracking-tight">
                        The Professional Growth Cycle
                    </h2>

                    <div className="flex flex-col gap-12">
                        {steps.map((step) => (
                            <div key={step.number} className="flex items-start gap-6 group">
                                {/* Larger, colored Number Circle */}
                                <div className={`w-12 h-12 rounded-full ${step.color} text-white text-lg font-bold flex items-center justify-center shrink-0 shadow-md`}>
                                    {step.number}
                                </div>

                                {/* Text Content with better spacing */}
                                <div className="pt-1">
                                    <h3 className="text-2xl font-extrabold text-[#340075] mb-3 tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-[#4A4452] text-base md:text-lg leading-relaxed max-w-md">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT — Visual Grid (Matches Image Layout Exactly) */}
                <div className="flex-1 w-full grid grid-cols-2 gap-3 md:gap-6">

                    {/* Top-left: Image Card */}
                    <div className="rounded-[24px] md:rounded-[32px] overflow-hidden aspect-square shadow-lg">
                        <img
                            src="/images/OverlayImg.png"
                            alt="Team at whiteboard"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Top-right: Teal card - self-end keeps the staggered feel on desktop */}
                    <div className="rounded-[24px] md:rounded-[32px] bg-[#6DF5E1] flex items-center justify-center aspect-square p-4 md:p-8 md:self-end">
                        <p className="text-[#006F64] text-xs sm:text-base md:text-xl font-bold text-center leading-tight">
                            Feedback is a Gift.
                        </p>
                    </div>

                    {/* Bottom-left: Purple card - self-start maintains the stagger */}
                    <div className="rounded-[24px] md:rounded-[32px] bg-[#340075] flex items-center justify-center aspect-square p-4 md:p-8 md:self-start">
                        <p className="text-white text-xs sm:text-base md:text-xl font-bold text-center leading-tight">
                            Iteration leads to Excellence.
                        </p>
                    </div>

                    {/* Bottom-right: Image Card */}
                    <div className="rounded-[24px] md:rounded-[32px] overflow-hidden aspect-square shadow-lg">
                        <img
                            src="/images/OverlayImg2.png"
                            alt="Collaboration"
                            className="w-full h-full object-cover"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}