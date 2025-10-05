import logoImage from "@assets/Gemini_Generated_Image_napyvqnapyvqnapy_1759625118642.png";

export default function Footer() {
  return (
    <footer className="bg-card border-t py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <img src={logoImage} alt="CertGenix Logo" className="h-10 w-auto mb-3" data-testid="img-footer-logo" />
            <p className="text-sm text-muted-foreground mb-3" data-testid="text-footer-tagline">
              Turn preparation into confidence with AI-powered personalized learning.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3" data-testid="text-footer-product-title">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-how-it-works">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-benefits">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-certifications">
                  Certifications
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3" data-testid="text-footer-company-title">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-about">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-contact">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-privacy">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p data-testid="text-footer-copyright">&copy; 2025 CertGenix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
