import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import heroImage from "@assets/generated_images/Professional_learner_studying_confidently_484d4c23.png";

export default function Hero() {
  const certifications = ["PMP®", "CISSP®", "CCSP®", "CISM®"];

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/70" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-5 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent leading-tight"
            data-testid="text-hero-headline"
          >
            Pass Your Exam. Own Your Career.
          </h1>

          <p className="text-base md:text-lg text-foreground mb-5 leading-relaxed" data-testid="text-hero-subheadline">
            Every learner is unique. That's why CertGenix begins with you — your strengths, gaps, and goals. Our AI builds a personalized study plan that adapts as you progress, turning preparation into confidence.
          </p>

          <p className="text-sm md:text-base text-muted-foreground mb-6" data-testid="text-hero-certifications">
            Prepare smarter for the industry's top certifications — PMP®, CISSP®, CCSP®, CISM®, and more — with adaptive AI, real exam simulations, and real-world readiness tools.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {certifications.map((cert) => (
              <Badge key={cert} variant="secondary" className="text-sm px-4 py-1" data-testid={`badge-cert-${cert}`}>
                {cert}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="rounded-full text-base"
              data-testid="button-hero-cta"
            >
              Start Your Personalized Prep Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
