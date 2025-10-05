import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import strengthImage from "@assets/Strength-3D2_1759686901921.png";

export default function WeaknessToStrength() {
  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-teal-500/5 to-cyan-600/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <img 
              src={strengthImage}
              alt="Strength Building"
              className="relative w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3" data-testid="text-weakness-title">
              We Turn Your Weakness into Your Biggest Win.
            </h2>
            
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed" data-testid="text-weakness-description">
              Most learners fear what they don't know. At CertGenix, those gaps aren't setbacks — they're opportunities.
            </p>

            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              Our AI adapts your plan around your weakest areas, turning them into your strongest wins.
            </p>

            <div className="flex items-center gap-3 text-lg md:text-xl font-semibold text-cyan-600 dark:text-cyan-400">
              <div className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-pulse" />
              <p data-testid="text-weakness-highlight">
                Your weak spots become your best scores.
              </p>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="rounded-full text-base px-8 h-14 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                data-testid="button-weakness-cta"
              >
                Get Your Personalized Study Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
