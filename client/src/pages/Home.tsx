import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import WeaknessToStrength from "@/components/WeaknessToStrength";
import BeyondExam from "@/components/BeyondExam";
import Testimonials from "@/components/Testimonials";
import ClosingCTA from "@/components/ClosingCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <WeaknessToStrength />
        <BeyondExam />
        <Testimonials />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}
