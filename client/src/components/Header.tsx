import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupDialog } from "@/components/SignupDialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, Target, Search, BarChart3, BookOpen, Briefcase, ArrowRight, Shield, FileCheck, Folder, Grid3x3, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import logoImage from "@assets/Gemini_logo 11_1759728209053.png";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user, login, loginWithGoogle, logout } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: "Success",
        description: "You've successfully logged in with Google!",
      });
      setLoginOpen(false);
      setSignupOpen(false);
    } catch (error: any) {
      toast({
        title: "Google Sign-In Failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Success",
        description: "You've successfully logged in!",
      });
      setLoginOpen(false);
      setLoginEmail("");
      setLoginPassword("");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You've been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-28 items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logoImage} alt="CertGenix Logo" className="h-24 w-auto" data-testid="img-logo" />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium" data-testid="menu-products">
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-48 p-2">
                      <li>
                        <Link href="/simulator">
                          <div className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer" data-testid="link-simulator">
                            <div className="text-sm font-medium leading-none">Simulator</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                              Practice with exam simulations
                            </p>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <a href="#how-it-works" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-how-it-works">
              How It Works
            </a>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium" data-testid="menu-certifications">
                    Certifications
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-8 p-8 w-[780px] shadow-xl border border-border/50 bg-background rounded-lg" data-testid="megamenu-certifications">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-4">Information Security</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link href="/cert/cism">
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer group transition-all duration-200 ease-in-out hover:translate-x-1" data-testid="link-cert-cism">
                                  <Shield className="h-5 w-5 text-primary shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-semibold text-base group-hover:text-primary transition-colors duration-200">CISM</div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Information Security Manager</p>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href="/cert/cissp">
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer group transition-all duration-200 ease-in-out hover:translate-x-1" data-testid="link-cert-cissp">
                                  <Shield className="h-5 w-5 text-primary shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-semibold text-base group-hover:text-primary transition-colors duration-200">CISSP</div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Security Professional</p>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href="/cert/ccsp">
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer group transition-all duration-200 ease-in-out hover:translate-x-1" data-testid="link-cert-ccsp">
                                  <Shield className="h-5 w-5 text-primary shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-semibold text-base group-hover:text-primary transition-colors duration-200">CCSP</div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Cloud Security</p>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4 pt-2 border-t">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-4">IT Audit & Governance</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link href="/cert/cisa">
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer group transition-all duration-200 ease-in-out hover:translate-x-1" data-testid="link-cert-cisa">
                                  <FileCheck className="h-5 w-5 text-primary shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-semibold text-base group-hover:text-primary transition-colors duration-200">CISA</div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Information Systems Auditor</p>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href="/cert/cgeit">
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer group transition-all duration-200 ease-in-out hover:translate-x-1" data-testid="link-cert-cgeit">
                                  <FileCheck className="h-5 w-5 text-primary shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-semibold text-base group-hover:text-primary transition-colors duration-200">CGEIT</div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">IT Governance</p>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4 pt-2 border-t">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-4">Project Management</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link href="/cert/pmp">
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer group transition-all duration-200 ease-in-out hover:translate-x-1" data-testid="link-cert-pmp">
                                  <Folder className="h-5 w-5 text-primary shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-semibold text-base group-hover:text-primary transition-colors duration-200">PMP</div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Project Management Professional</p>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href="/cert/capm">
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer group transition-all duration-200 ease-in-out hover:translate-x-1" data-testid="link-cert-capm">
                                  <Folder className="h-5 w-5 text-primary shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-semibold text-base group-hover:text-primary transition-colors duration-200">CAPM</div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Associate Project Manager</p>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-6 bg-accent/30 rounded-lg p-6 border-l-4 border-primary">
                        <div className="pb-4 border-b border-border/50">
                          <Link href="/certifications">
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/60 cursor-pointer group transition-all duration-200 ease-in-out bg-background/40" data-testid="link-browse-all-certifications">
                              <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-all duration-200">
                                <Grid3x3 className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-base group-hover:text-primary transition-colors duration-200">Browse All Certifications</div>
                                <p className="text-sm text-muted-foreground leading-relaxed">View complete certification catalog</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0" />
                            </div>
                          </Link>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Need Help Deciding?
                          </h3>
                          <ul className="space-y-2">
                            <li>
                              <Link href="/which-certification">
                                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-background/60 cursor-pointer group transition-all duration-200 ease-in-out" data-testid="link-which-certification">
                                  <span className="text-sm font-medium group-hover:text-primary transition-colors duration-200">Which Certification Is Right for Me?</span>
                                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto text-primary -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href="/compare/cism-vs-cissp">
                                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-background/60 cursor-pointer group transition-all duration-200 ease-in-out" data-testid="link-compare-cism-cissp">
                                  <span className="text-sm font-medium group-hover:text-primary transition-colors duration-200">Compare CISM vs CISSP</span>
                                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto text-primary -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href="/compare/pmp-vs-capm">
                                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-background/60 cursor-pointer group transition-all duration-200 ease-in-out" data-testid="link-compare-pmp-capm">
                                  <span className="text-sm font-medium group-hover:text-primary transition-colors duration-200">Compare PMP vs CAPM</span>
                                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto text-primary -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href="/certifications/isaca">
                                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-background/60 cursor-pointer group transition-all duration-200 ease-in-out" data-testid="link-isaca-certifications">
                                  <span className="text-sm font-medium group-hover:text-primary transition-colors duration-200">View All ISACA Certifications</span>
                                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto text-primary -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href="/certifications/by-goal">
                                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-background/60 cursor-pointer group transition-all duration-200 ease-in-out" data-testid="link-certifications-by-goal">
                                  <span className="text-sm font-medium group-hover:text-primary transition-colors duration-200">Certifications by Career Goal</span>
                                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto text-primary -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/50">
                          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            Popular Career Paths
                          </h3>
                          <ul className="space-y-2">
                            <li>
                              <Link href="/career/security-manager">
                                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-background/60 cursor-pointer group transition-all duration-200 ease-in-out" data-testid="link-career-security-manager">
                                  <span className="text-sm font-medium group-hover:text-primary transition-colors duration-200">Security Manager Track</span>
                                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto text-primary -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href="/career/ciso">
                                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-background/60 cursor-pointer group transition-all duration-200 ease-in-out" data-testid="link-career-ciso">
                                  <span className="text-sm font-medium group-hover:text-primary transition-colors duration-200">CISO Career Path</span>
                                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto text-primary -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href="/career/it-auditor">
                                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-background/60 cursor-pointer group transition-all duration-200 ease-in-out" data-testid="link-career-it-auditor">
                                  <span className="text-sm font-medium group-hover:text-primary transition-colors duration-200">IT Auditor Track</span>
                                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto text-primary -translate-x-2 group-hover:translate-x-0" />
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <a href="#about-us" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-about-us">
              About Us
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden md:inline-flex rounded-full gap-2"
                    data-testid="button-user-menu"
                  >
                    <User className="h-4 w-4" />
                    {user.displayName || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="menu-item-profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    data-testid="menu-item-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
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
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    data-testid="button-google-login"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      data-testid="input-login-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a 
                        href="/forgot-password"
                        className="text-sm text-primary hover:underline" 
                        onClick={() => setLoginOpen(false)}
                        data-testid="link-forgot-password"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      data-testid="input-login-password"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full"
                    disabled={isLoading}
                    data-testid="button-login-submit"
                  >
                    {isLoading ? "Logging in..." : "Login"}
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
            
                <Button
                  variant="default"
                  className="hidden md:inline-flex rounded-full"
                  onClick={() => setSignupOpen(true)}
                  data-testid="button-signup"
                >
                  Sign up
                </Button>
              </>
            )}

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
              <Link href="/simulator">
                <div
                  className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="link-mobile-simulator"
                >
                  Simulator
                </div>
              </Link>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-how-it-works"
              >
                How It Works
              </a>
              <a
                href="#certifications"
                className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-certifications"
              >
                Certifications
              </a>
              <a
                href="#about-us"
                className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-about-us"
              >
                About Us
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
                <Button
                  variant="default"
                  className="flex-1 rounded-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSignupOpen(true);
                  }}
                  data-testid="button-mobile-signup"
                >
                  Sign up
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      <SignupDialog
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />
    </header>
  );
}
