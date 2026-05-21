import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="relative min-h-screen bg-[#F7F7FA] overflow-hidden px-5 sm:px-6 lg:px-10 pt-32 sm:pt-40">

            {/* LEFT BLUR */}
            <div className="absolute top-[180px] left-[-120px] w-[300px] h-[300px] bg-[#6DF5E1]/30 blur-[120px] rounded-full pointer-events-none" />

            {/* RIGHT BLUR */}
            <div className="absolute top-[120px] right-[-120px] w-[320px] h-[320px] bg-[#7C3AED]/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-10 relative z-10">

                {/* LEFT CONTENT */}
                <div className="flex-1 max-w-xl text-center lg:text-left">

                    {/* Badge */}
                    <div className="inline-flex items-center bg-[#6DF5E1] text-[#006F64] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] px-4 py-2 rounded-full mb-7">
                        Now Enrolling: March Cohort
                    </div>

                    {/* Heading */}
                    <h1 className="
                        text-[38px]
                        sm:text-[52px]
                        lg:text-[64px]
                        leading-[1]
                        font-black
                        tracking-[-0.04em]
                        text-[#340075]
                        mb-6
                    ">
                        Build. Share. Iterate.
                    </h1>

                    {/* Paragraph */}
                    <p className="
                        text-[#4A4452]
                        text-[15px]
                        sm:text-[17px]
                        leading-7
                        sm:leading-8
                        max-w-lg
                        mx-auto
                        lg:mx-0
                        mb-10
                    ">
                        A monthly challenge platform turning learners into active
                        builders through structured hands-on projects and peer feedback.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12">
                        {/* Go to Signup */}
                        <Link to="/signup" className="bg-gradient-to-r from-[#006B5F] to-[#340075] text-white px-6 sm:px-7 py-3.5 rounded-[14px] text-sm font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-center">
                            Join the Challenge
                        </Link>

                        {/* Go to Open Challenges Grid */}
                        <Link to="/signin" className="border border-[#CCC3D4] bg-white/70 backdrop-blur-md text-[#340075] px-6 sm:px-7 py-3.5 rounded-[14px] text-sm font-semibold hover:border-[#9C8BB3] transition-all text-center">
                            View Ecosystem
                        </Link>
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center justify-center lg:justify-start gap-4">

                        {/* Avatars */}
                        <div className="flex -space-x-3">

                            <img
                                src="/images/profile1.jpeg"
                                alt=""
                                className="w-9 h-9 rounded-full border-2 border-white object-cover"
                            />

                            <img
                                src="/images/profile2.jpg"
                                alt=""
                                className="w-9 h-9 rounded-full border-2 border-white object-cover"
                            />

                            <img
                                src="/images/profile3.jpg"
                                alt=""
                                className="w-9 h-9 rounded-full border-2 border-white object-cover"
                            />
                        </div>

                        <p className="text-sm text-[#6B7280]">
                            <span className="font-semibold text-[#4C1D95]">
                                1.2k+
                            </span>{" "}
                            builders active this month
                        </p>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex-1 flex justify-center relative w-full mt-10 lg:mt-0">

                    {/* Purple Background Shape */}
                    <div className="
                        absolute
                        bottom-[-20px]
                        right-[5%]
                        sm:right-[10%]
                        w-[170px]
                        sm:w-[220px]
                        h-[170px]
                        sm:h-[220px]
                        bg-[#5B12D6]
                        rounded-[28px]
                        rotate-6
                    " >
                        {/* <img className="absolute bottom-[-10px] left-[22%] " src="/images/rocket.png" alt="" /> */}
                        </div>

                    {/* Main Floating Card */}
                    <div className="
                        relative
                        z-10
                        w-full
                        max-w-[370px]
                        rounded-[28px]
                        border
                        border-white/40
                        bg-white/65
                        backdrop-blur-xl
                        shadow-[0_20px_60px_rgba(0,0,0,0.12)]
                        p-4
                        sm:p-5
                    ">

                        {/* Code Image */}
                        <div className="rounded-[20px] overflow-hidden">
                            <img
                                src="/images/code-img.png"
                                alt="Code Preview"
                                className="
                                    w-full
                                    h-[180px]
                                    sm:h-[210px]
                                    object-cover
                                "
                            />
                        </div>

                        {/* Bottom Content */}
                        <div className="flex items-end justify-between gap-3 mt-5">

                            <div>
                                <p className="
                                    text-[#5B12D6]
                                    text-[18px]
                                    sm:text-[22px]
                                    font-bold
                                    leading-tight
                                ">
                                    Current Challenge
                                </p>

                                <p className="text-[#6B7280] text-xs sm:text-sm mt-1">
                                    Personal FinTech Dashboard
                                </p>
                            </div>

                            {/* Due Badge */}
                            <div className="
                                bg-[#6DF5E1]
                                text-[#111827]
                                text-[10px]
                                sm:text-[11px]
                                font-bold
                                px-3
                                sm:px-4
                                py-2
                                rounded-xl
                                whitespace-nowrap
                                shadow-sm
                            ">
                                DUE IN 4 DAYS
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}