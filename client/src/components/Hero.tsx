import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  const certifications = ["PMP®", "CISSP®", "CCSP®", "CISM®"];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Learning Platform</span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight"
              data-testid="text-hero-headline"
            >
              Pass Your Exam.{" "}
              <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
                Own Your Career.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl" data-testid="text-hero-subheadline">
              Every learner is unique. CertGenix begins with you — your strengths, gaps, and goals. Our AI builds a personalized study plan that adapts as you progress.
            </p>

            <div className="flex flex-wrap gap-3" data-testid="text-hero-certifications">
              {certifications.map((cert) => (
                <Badge 
                  key={cert} 
                  variant="outline" 
                  className="text-sm px-4 py-2 border-primary/30 hover:bg-primary/10 transition-colors" 
                  data-testid={`badge-cert-${cert}`}
                >
                  {cert}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="rounded-full text-base px-8 h-14 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                data-testid="button-hero-cta"
              >
                Start Your Personalized Prep Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="relative lg:block hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-chart-2/20 blur-3xl rounded-full transform scale-75" />
            <img 
              src="/attached_assets/Hero Image 3 3D No BG_1759679073254.png"
              alt="AI-Powered Learning"
              className="relative w-full h-auto object-contain drop-shadow-2xl animate-float"
            />
          </div>
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, hsl(var(--foreground) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground) / 0.1) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
