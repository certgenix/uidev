import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoImage from "@assets/Gemini_Generated_Image_napyvqnapyvqnapy_1759625118642.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="CertGenix Logo" className="h-14 w-auto" data-testid="img-logo" />
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-how-it-works">
              How It Works
            </a>
            <a href="#benefits" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-benefits">
              Benefits
            </a>
            <a href="#testimonials" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-testimonials">
              Testimonials
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="default"
              className="hidden md:inline-flex rounded-full"
              data-testid="button-get-started"
            >
              Get Started
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t" data-testid="mobile-menu">
            <nav className="flex flex-col gap-2">
              <a
                href="#how-it-works"
                className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-how-it-works"
              >
                How It Works
              </a>
              <a
                href="#benefits"
                className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-benefits"
              >
                Benefits
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-testimonials"
              >
                Testimonials
              </a>
              <Button
                variant="default"
                className="mt-2 rounded-full"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="button-mobile-get-started"
              >
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
