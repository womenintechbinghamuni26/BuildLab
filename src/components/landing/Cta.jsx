import { Link } from "react-router-dom";

export default function CallToAction() {
    return (
        <section className="w-full relative py-24 sm:py-32 px-6 md:px-12 lg:px-20 overflow-hidden">

            {/* 1. Base Layer: The Solid Purple Background */}
            <div className="absolute inset-0 bg-[#340075] z-0" />

            {/* 2. Image Layer: Now on top (z-10) but with very low opacity */}
            <div
                className="absolute inset-0 z-[1] bg-cover bg-center bg-no-repeat opacity-[0.1]"
                style={{ backgroundImage: `url('/images/bg.png')` }}
            />

            {/* 3. Content Layer: Highest z-index to stay readable */}
            <div className="max-w-4xl mx-auto text-center relative z-20 flex flex-col items-center">

                {/* Heading */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter mb-6">
                    Stop Watching. Start Building.
                </h2>

                {/* Subtitle */}
                <p className="text-purple-100 text-base md:text-lg leading-relaxed mb-12 max-w-xl">
                    Join a community of builders who choose action over theory. Every great product started with a single build.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                    {/* Start Building Today -> Goes to Signup */}
                    <Link   
                        to="/signup"
                        className="w-full sm:w-auto bg-[#71F8E4] text-[#00201C] font-black text-sm px-10 py-4 rounded-2xl tracking-widest uppercase shadow-lg shadow-[#71F8E4]/20 hover:bg-white hover:shadow-white/30 transition-all active:scale-95 text-center"
                    >
                        Start Building Today
                    </Link>

                    {/* Browse Challenges -> Goes directly to the Ecosystem Grid */}
                    <Link
                        to="/signin"
                        className="w-full sm:w-auto border border-white/50 text-white font-bold text-sm px-10 py-4 rounded-2xl tracking-tight hover:border-white hover:bg-white/5 transition-colors text-center"
                    >
                        Browse Challenges
                    </Link>
                </div>
            </div>
        </section>
    );
}