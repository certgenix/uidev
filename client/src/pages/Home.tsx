import { useEffect, useRef } from "react";
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
  const sectionsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <section ref={addToRefs} className="section-transition">
          <HowItWorks />
        </section>
        <section ref={addToRefs} className="section-transition">
          <Benefits />
        </section>
        <section ref={addToRefs} className="section-transition">
          <WeaknessToStrength />
        </section>
        <section ref={addToRefs} className="section-transition">
          <BeyondExam />
        </section>
        <section ref={addToRefs} className="section-transition">
          <Testimonials />
        </section>
        <section ref={addToRefs} className="section-transition">
          <ClosingCTA />
        </section>
      </main>
      <Footer />

      <style>{`
        .section-transition {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .section-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
