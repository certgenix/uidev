import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SignupDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  onSwitchToLogin?: () => void;
}

export function SignupDialog({ open, onOpenChange, trigger, onSwitchToLogin }: SignupDialogProps) {
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup, loginWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: "Success",
        description: "You've successfully signed up with Google!",
      });
      onOpenChange?.(false);
    } catch (error: any) {
      toast({
        title: "Google Sign-Up Failed",
        description: error.message || "Failed to sign up with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(signupEmail, signupPassword, signupFirstName, signupLastName);
      toast({
        title: "Success",
        description: "Your account has been created!",
      });
      onOpenChange?.(false);
      setSignupFirstName("");
      setSignupLastName("");
      setSignupEmail("");
      setSignupPassword("");
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Sign up for CertGenix</DialogTitle>
      </DialogHeader>
      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          data-testid="button-google-signup"
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
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={signupFirstName}
            onChange={(e) => setSignupFirstName(e.target.value)}
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
            value={signupLastName}
            onChange={(e) => setSignupLastName(e.target.value)}
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
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            required
            data-testid="input-signup-email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signupPassword">Password</Label>
          <Input
            id="signupPassword"
            type="password"
            placeholder="••••••••"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            required
            minLength={6}
            data-testid="input-signup-password"
          />
        </div>
        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={isLoading}
          data-testid="button-signup-submit"
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
        {onSwitchToLogin && (
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <a 
              className="text-primary hover:underline cursor-pointer" 
              onClick={() => {
                onOpenChange?.(false);
                onSwitchToLogin();
              }}
              data-testid="link-switch-to-login"
            >
              Login
            </a>
          </p>
        )}
      </form>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {dialogContent}
    </Dialog>
  );
}
