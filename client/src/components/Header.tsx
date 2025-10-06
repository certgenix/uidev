import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import logoImage from "@assets/Gemini_logo 7_1759694336419.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logoImage} alt="CertGenix Logo" className="h-20 w-auto" data-testid="img-logo" />
            </div>
          </Link>

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
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden md:inline-flex rounded-full"
                  data-testid="button-login"
                >
                  Login
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Login to CertGenix</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      data-testid="input-login-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password">
                        <a 
                          className="text-sm text-primary hover:underline" 
                          onClick={() => setLoginOpen(false)}
                          data-testid="link-forgot-password"
                        >
                          Forgot password?
                        </a>
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      data-testid="input-login-password"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full"
                    data-testid="button-login-submit"
                  >
                    Login
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <a 
                      className="text-primary hover:underline cursor-pointer" 
                      onClick={() => {
                        setLoginOpen(false);
                        setSignupOpen(true);
                      }}
                      data-testid="link-switch-to-signup"
                    >
                      Sign up
                    </a>
                  </p>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="hidden md:inline-flex rounded-full"
                  data-testid="button-signup"
                >
                  Sign up
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Sign up for CertGenix</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSignup} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      required
                      data-testid="input-signup-firstname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                      data-testid="input-signup-lastname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email Address</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="your@email.com"
                      required
                      data-testid="input-signup-email"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full"
                    data-testid="button-signup-submit"
                  >
                    Sign up
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <a 
                      className="text-primary hover:underline cursor-pointer" 
                      onClick={() => {
                        setSignupOpen(false);
                        setLoginOpen(true);
                      }}
                      data-testid="link-switch-to-login"
                    >
                      Login
                    </a>
                  </p>
                </form>
              </DialogContent>
            </Dialog>

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
              <div className="flex gap-2 mt-2">
                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-full"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid="button-mobile-login"
                    >
                      Login
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="flex-1 rounded-full"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid="button-mobile-signup"
                    >
                      Sign up
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
