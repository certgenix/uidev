import { Sparkles } from "lucide-react";

export default function WeaknessToStrength() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 to-chart-2/5">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6" data-testid="text-weakness-title">
          We Turn Your Weakness into Your Biggest Win.
        </h2>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-6" data-testid="text-weakness-description">
          Most learners fear what they don't know. At CertGenix, those gaps aren't setbacks — they're opportunities. Our AI adapts your plan around your weakest areas, turning them into your strongest wins.
        </p>

        <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-chart-2 font-medium">
          <Sparkles className="h-6 w-6" />
          <p data-testid="text-weakness-highlight">
            With CertGenix, what once held you back becomes your advantage.
          </p>
        </div>
      </div>
    </section>
  );
}
