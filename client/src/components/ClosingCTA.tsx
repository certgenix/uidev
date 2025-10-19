import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function ClosingCTA() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary to-chart-2 text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4" data-testid="text-closing-title">
          Ready to Certify With Confidence?
        </h2>
        
        <p className="text-base md:text-lg mb-6 text-primary-foreground/90" data-testid="text-closing-subtitle">
          Let CertGenix learn about you, so you can learn smarter.
        </p>

        <Link href="/diagnostic">
          <Button
            size="default"
            variant="secondary"
            className="bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 rounded-full border-0"
            data-testid="button-closing-cta"
          >
            Join CertGenix Today — Learn. Certify. Apply.
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
