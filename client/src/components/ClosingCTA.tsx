import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ClosingCTA() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary to-chart-2 text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6" data-testid="text-closing-title">
          Ready to Certify With Confidence?
        </h2>
        
        <p className="text-lg md:text-xl mb-8 text-primary-foreground/90" data-testid="text-closing-subtitle">
          Let CertGenix learn about you, so you can learn smarter.
        </p>

        <Button
          size="lg"
          variant="secondary"
          className="rounded-full text-base"
          data-testid="button-closing-cta"
        >
          Join CertGenix Today — Learn. Certify. Apply.
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
