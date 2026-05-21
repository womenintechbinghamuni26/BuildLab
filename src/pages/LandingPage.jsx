import BuildHub from "../components/landing/Build";
import ChallengeEngine from "../components/landing/Challenge";
import CallToAction from "../components/landing/Cta";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";
import GrowthCycle from "../components/landing/Growth";
import Hero from "../components/landing/Hero";
import Navbar from "../components/landing/Navbar";
import PathToMastery from "../components/landing/Path";

export default function LandingPage() {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <GrowthCycle />
            <ChallengeEngine />
            <PathToMastery />
            <BuildHub />
            <CallToAction />
            <Footer />
            {/* <ChallengePaths />
            <HowItWorks />
            <CommunitySection />
            <ShowcaseSection />
            <CTASection />
            <Footer /> */}
        </>
    );
}