import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const certifications = [
  "PMP®", "CISSP®", "CCSP®", "CISM®", "PRINCE2®", 
  "AWS Certified Solutions Architect", "CompTIA Security+", 
  "CompTIA Network+", "ITIL Foundation", "CPA"
];

const examTimelines = [
  { value: "1-3", label: "1–3 months" },
  { value: "3-6", label: "3–6 months" },
  { value: "6+", label: "6+ months" },
  { value: "not-sure", label: "Not sure yet" }
];

const weeklyHours = [
  { value: "1-3", label: "1-3 hours" },
  { value: "3-5", label: "3–5 hours" },
  { value: "6-10", label: "6–10 hours" },
  { value: "10+", label: "10+ hours" }
];

const domainsByExam: Record<string, string[]> = {
  "PMP®": ["Initiating", "Planning", "Executing", "Monitoring & Controlling", "Closing"],
  "CISSP®": ["Security & Risk Management", "Asset Security", "Security Architecture", "Communication & Network Security", "Identity & Access Management", "Security Assessment & Testing", "Security Operations", "Software Development Security"],
  "CCSP®": ["Cloud Concepts", "Cloud Data Security", "Cloud Platform & Infrastructure Security", "Cloud Application Security", "Cloud Security Operations", "Legal, Risk & Compliance"],
  "CISM®": ["Information Security Governance", "Information Risk Management", "Information Security Program", "Incident Management"],
  "default": ["Domain 1", "Domain 2", "Domain 3", "Domain 4", "Domain 5"]
};

const backgrounds = [
  { value: "student", label: "Student" },
  { value: "professional", label: "Working Professional" },
  { value: "career-switcher", label: "Career Switcher" },
  { value: "manager", label: "Manager" }
];

export default function Diagnostic() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    certification: "",
    examTimeline: "",
    weeklyHours: "",
    weaknesses: [] as string[],
    background: ""
  });

  const domains = formData.certification 
    ? (domainsByExam[formData.certification] || domainsByExam.default)
    : domainsByExam.default;

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleWeaknessToggle = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      weaknesses: prev.weaknesses.includes(domain)
        ? prev.weaknesses.filter(w => w !== domain)
        : [...prev.weaknesses, domain]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return formData.certification !== "";
      case 2: return formData.examTimeline !== "" && formData.weeklyHours !== "";
      case 3: return formData.weaknesses.length > 0;
      case 4: return true;
      default: return true;
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all duration-500 ${
                  step <= currentStep 
                    ? "w-12 bg-primary" 
                    : "w-8 bg-primary/20"
                }`}
                data-testid={`progress-step-${step}`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <Card className="p-8 md:p-12 shadow-2xl border-0 bg-card/95 backdrop-blur">
              {currentStep === 0 && (
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Personalized Learning</span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-welcome-headline">
                    Welcome to CertGenix
                  </h1>
                  
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-welcome-supporting">
                    We're here to help you pass your exam — and master your career.
                  </p>

                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="rounded-full text-base px-8 h-14 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    data-testid="button-lets-build"
                  >
                    Let's Build Your Plan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-3 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-step1-question">
                      Which certification are you preparing for?
                    </h2>
                    <p className="text-muted-foreground" data-testid="text-step1-encouragement">
                      We cover the industry's top certifications, so you'll be exam-ready with confidence.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {certifications.map((cert) => (
                      <button
                        key={cert}
                        onClick={() => setFormData({ ...formData, certification: cert })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.certification === cert
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                        data-testid={`button-cert-${cert.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{cert}</span>
                          {formData.certification === cert && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-step2-question1">
                      When are you planning to take your exam?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {examTimelines.map((timeline) => (
                      <button
                        key={timeline.value}
                        onClick={() => setFormData({ ...formData, examTimeline: timeline.value })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.examTimeline === timeline.value
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                        data-testid={`button-timeline-${timeline.value}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{timeline.label}</span>
                          {formData.examTimeline === timeline.value && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="text-center space-y-3 pt-6">
                    <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-step2-question2">
                      How much time can you realistically commit per week?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {weeklyHours.map((hours) => (
                      <button
                        key={hours.value}
                        onClick={() => setFormData({ ...formData, weeklyHours: hours.value })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.weeklyHours === hours.value
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                        data-testid={`button-hours-${hours.value}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{hours.label}</span>
                          {formData.weeklyHours === hours.value && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="text-center text-muted-foreground" data-testid="text-step2-encouragement">
                    Even 3 hours a week is enough — our AI will adapt to your schedule.
                  </p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-3 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-step3-question">
                      Which areas do you feel least confident in?
                    </h2>
                    <p className="text-muted-foreground" data-testid="text-step3-encouragement">
                      Don't worry — these will become your strongest areas.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {domains.map((domain) => {
                      const domainId = `domain-${domain.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                      return (
                        <div
                          key={domain}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                            formData.weaknesses.includes(domain)
                              ? "border-primary bg-primary/10"
                              : "border-border hover:bg-accent"
                          }`}
                          data-testid={`checkbox-${domainId}`}
                        >
                          <Checkbox
                            checked={formData.weaknesses.includes(domain)}
                            onCheckedChange={() => handleWeaknessToggle(domain)}
                            id={domainId}
                          />
                          <Label
                            htmlFor={domainId}
                            className="flex-1 cursor-pointer text-base"
                          >
                            {domain}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center space-y-3 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-step4-question">
                      Tell us a bit about your background
                    </h2>
                    <p className="text-muted-foreground">(Optional)</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {backgrounds.map((bg) => (
                      <button
                        key={bg.value}
                        onClick={() => setFormData({ ...formData, background: bg.value })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.background === bg.value
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                        data-testid={`button-background-${bg.value}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{bg.label}</span>
                          {formData.background === bg.value && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-chart-2 mb-4 mx-auto">
                    <Rocket className="h-10 w-10 text-white" />
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-plan-headline">
                    Here's Your Personalized Roadmap 🚀
                  </h1>
                  
                  <div className="max-w-2xl mx-auto space-y-4">
                    <p className="text-lg text-muted-foreground" data-testid="text-plan-summary">
                      3 short modules + 1 quiz per week → You'll be exam-ready in{" "}
                      {formData.examTimeline === "1-3" ? "12 weeks" : 
                       formData.examTimeline === "3-6" ? "20 weeks" : "24+ weeks"}.
                    </p>
                    
                    <p className="text-lg text-muted-foreground">
                      <strong className="text-primary">Focus areas:</strong> {formData.weaknesses.join(", ")} will become your strongest domains.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <Button
                      size="lg"
                      onClick={() => setLocation("/")}
                      className="rounded-full text-base px-8 h-14 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                      data-testid="button-start-week1"
                    >
                      ✅ Start Week 1 Now
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setLocation("/")}
                      className="rounded-full text-base px-8 h-14"
                      data-testid="button-save-plan"
                    >
                      🕒 Save Plan & Come Back Later
                    </Button>
                  </div>
                </div>
              )}

              {currentStep > 0 && currentStep < 5 && (
                <div className="flex items-center justify-between mt-8 pt-8 border-t">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="rounded-full"
                    data-testid="button-back"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="rounded-full"
                    data-testid="button-next"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
