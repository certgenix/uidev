import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Rocket } from "lucide-react";

interface FormData {
  certification: string;
  knowledgeLevel: string;
  learningStyle: string;
  studyStructure: string;
  focusAreas: string[];
  previousAttempts: string;
  failedDomains: string[];
  examTimeline: string;
  examDate: string;
  weeklyHours: string;
  studyTimes: string;
}

interface TransitionScreenProps {
  formData: FormData;
  onComplete: () => void;
  isGeneratingPlan?: boolean;
  planGenerationError?: string;
  onRetry?: () => void;
}

interface CertificationData {
  modules: number;
  videos: number;
  questions: number;
  activities: number;
  activityLabel: string;
  socialProof: number;
}

const certificationDataMap: Record<string, CertificationData> = {
  "CISSP®": {
    modules: 47,
    videos: 89,
    questions: 4847,
    activities: 23,
    activityLabel: "Hands-on labs",
    socialProof: 124
  },
  "PMP®": {
    modules: 38,
    videos: 76,
    questions: 4650,
    activities: 15,
    activityLabel: "Case studies",
    socialProof: 124
  },
  "CCSP®": {
    modules: 52,
    videos: 94,
    questions: 3920,
    activities: 38,
    activityLabel: "Hands-on labs",
    socialProof: 87
  },
  "CISM®": {
    modules: 36,
    videos: 71,
    questions: 2580,
    activities: 22,
    activityLabel: "Case studies",
    socialProof: 87
  },
  "CISA®": {
    modules: 42,
    videos: 68,
    questions: 2715,
    activities: 18,
    activityLabel: "Audit scenarios",
    socialProof: 87
  },
  "AWS Certified Solutions Architect": {
    modules: 54,
    videos: 98,
    questions: 4965,
    activities: 42,
    activityLabel: "Hands-on labs",
    socialProof: 156
  },
  "CompTIA Security+": {
    modules: 34,
    videos: 82,
    questions: 2750,
    activities: 28,
    activityLabel: "Hands-on labs",
    socialProof: 124
  },
  "CompTIA Network+": {
    modules: 32,
    videos: 79,
    questions: 2685,
    activities: 31,
    activityLabel: "Hands-on labs",
    socialProof: 156
  }
};

const defaultCertData: CertificationData = {
  modules: 45,
  videos: 85,
  questions: 2800,
  activities: 25,
  activityLabel: "Practice exercises",
  socialProof: 95
};

const getCertificationData = (certification: string): CertificationData => {
  const upperCert = certification.toUpperCase();
  
  if (certificationDataMap[certification]) {
    return certificationDataMap[certification];
  }
  
  for (const [key, value] of Object.entries(certificationDataMap)) {
    if (upperCert.includes(key.toUpperCase().replace("®", ""))) {
      return value;
    }
  }
  
  if (upperCert.includes("AWS")) {
    return certificationDataMap["AWS Certified Solutions Architect"];
  }
  if (upperCert.includes("SECURITY+")) {
    return certificationDataMap["CompTIA Security+"];
  }
  if (upperCert.includes("NETWORK+")) {
    return certificationDataMap["CompTIA Network+"];
  }
  
  return defaultCertData;
};

const getWeeksFromHours = (weeklyHours: string): { weeks: string; minWeeks: number; maxWeeks: number } => {
  switch (weeklyHours) {
    case "1-3":
      return { weeks: "15-20", minWeeks: 15, maxWeeks: 20 };
    case "3-5":
      return { weeks: "10-15", minWeeks: 10, maxWeeks: 15 };
    case "6-10":
      return { weeks: "6-10", minWeeks: 6, maxWeeks: 10 };
    case "10+":
      return { weeks: "4-6", minWeeks: 4, maxWeeks: 6 };
    default:
      return { weeks: "10-15", minWeeks: 10, maxWeeks: 15 };
  }
};

const getTimingPreference = (studyTimes: string): string => {
  switch (studyTimes) {
    case "same-time":
      return "daily";
    case "weekends":
      return "weekend";
    case "flexible":
      return "flexible";
    case "short-bursts":
      return "micro-learning";
    default:
      return "flexible";
  }
};

const getLearningStyleLabel = (learningStyle: string): string => {
  switch (learningStyle) {
    case "reading":
      return "reading";
    case "videos":
      return "video";
    case "hands-on":
      return "hands-on";
    case "mixed":
      return "mixed";
    default:
      return "mixed";
  }
};

export default function TransitionScreen({ formData, onComplete, isGeneratingPlan = false, planGenerationError = "", onRetry }: TransitionScreenProps) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Items, setStep1Items] = useState<number[]>([]);
  const [step2Progress, setStep2Progress] = useState(0);
  const [step2Stage, setStep2Stage] = useState(0);
  const [step2Complete, setStep2Complete] = useState(false);
  const [step3Counters, setStep3Counters] = useState({ modules: 0, videos: 0, questions: 0, activities: 0 });
  const [step4Phases, setStep4Phases] = useState<number[]>([]);
  const [step5Items, setStep5Items] = useState<number[]>([]);
  const [randomStudents, setRandomStudents] = useState(0);
  const [generatingProgress, setGeneratingProgress] = useState(0);

  const certData = getCertificationData(formData.certification);
  const { weeks, minWeeks, maxWeeks } = getWeeksFromHours(formData.weeklyHours);
  const timingPref = getTimingPreference(formData.studyTimes);
  const learningStyleLabel = getLearningStyleLabel(formData.learningStyle);

  useEffect(() => {
    setRandomStudents(Math.floor(Math.random() * (1500 - 850 + 1)) + 850);
  }, []);

  useEffect(() => {
    if (currentStep === 1) {
      const timers = [0, 1000, 2000, 3000];
      timers.forEach((delay, index) => {
        setTimeout(() => {
          setStep1Items(prev => [...prev, index]);
        }, delay);
      });
      
      setTimeout(() => setCurrentStep(2), 6000);
    }
    
    if (currentStep === 2) {
      const stages = [0, 1500, 3000, 4500];
      stages.forEach((delay, index) => {
        setTimeout(() => {
          setStep2Stage(index + 1);
          setStep2Progress((index + 1) * 25);
        }, delay);
      });
      
      setTimeout(() => setStep2Complete(true), 6700);
      setTimeout(() => setCurrentStep(3), 7000);
    }
    
    if (currentStep === 3) {
      const duration = 6000;
      const steps = 60;
      const interval = duration / steps;
      
      let currentCount = 0;
      const timer = setInterval(() => {
        currentCount++;
        const progress = currentCount / steps;
        
        setStep3Counters({
          modules: Math.floor(certData.modules * progress),
          videos: Math.floor(certData.videos * progress),
          questions: Math.floor(certData.questions * progress),
          activities: Math.floor(certData.activities * progress)
        });
        
        if (currentCount >= steps) {
          clearInterval(timer);
          setStep3Counters({
            modules: certData.modules,
            videos: certData.videos,
            questions: certData.questions,
            activities: certData.activities
          });
        }
      }, interval);
      
      setTimeout(() => setCurrentStep(4), 7000);
      
      return () => clearInterval(timer);
    }
    
    if (currentStep === 4) {
      const phases = [0, 1000, 2000, 3000, 4000];
      phases.forEach((delay, index) => {
        setTimeout(() => {
          setStep4Phases(prev => [...prev, index]);
        }, delay);
      });
      
      setTimeout(() => setCurrentStep(5), 6000);
    }
    
    if (currentStep === 5) {
      const timers = [0, 1000, 2000, 3000];
      timers.forEach((delay, index) => {
        setTimeout(() => {
          setStep5Items(prev => [...prev, index]);
        }, delay);
      });
      
      setTimeout(() => setCurrentStep(6), 5000);
    }
    
    // Step 6 stays visible - don't auto-complete anymore
  }, [currentStep, certData, formData, onComplete]);

  useEffect(() => {
    if (isGeneratingPlan && currentStep === 6) {
      setGeneratingProgress(0);
      const duration = 120000;
      const steps = 120;
      const interval = duration / steps;
      
      let currentCount = 0;
      const timer = setInterval(() => {
        currentCount++;
        const progress = Math.min((currentCount / steps) * 90, 90);
        setGeneratingProgress(progress);
        
        if (currentCount >= steps) {
          clearInterval(timer);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [isGeneratingPlan, currentStep]);

  const progressPercentage = ((currentStep - 1) / 6) * 100 + (1 / 6) * 100 * 0.5;

  return (
    <div className="w-full py-12 min-h-[600px] flex flex-col" data-testid="transition-screen">
      <div className="max-w-4xl mx-auto w-full px-4 flex-1 flex flex-col justify-center">
        {currentStep !== 6 && (
          <div className="mb-8">
            <Progress value={progressPercentage} className="h-2" data-testid="progress-transition" />
            <p className="text-sm text-muted-foreground mt-2 text-center" data-testid="text-step-indicator">
              Step {currentStep} of 6
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              data-testid="step-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center" data-testid="text-step1-header">
                Analyzing Your Profile
              </h2>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                {step1Items.includes(0) && formData.certification && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                    data-testid="step1-item-0"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">{formData.certification} detected</span>
                  </motion.div>
                )}
                
                {step1Items.includes(1) && formData.knowledgeLevel && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                    data-testid="step1-item-1"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">{formData.knowledgeLevel} knowledge level confirmed</span>
                  </motion.div>
                )}
                
                {step1Items.includes(2) && formData.learningStyle && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                    data-testid="step1-item-2"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">{getLearningStyleLabel(formData.learningStyle)} learning style preferences captured</span>
                  </motion.div>
                )}
                
                {step1Items.includes(3) && formData.weeklyHours && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                    data-testid="step1-item-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">{formData.weeklyHours} hours weekly availability noted</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              data-testid="step-2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center" data-testid="text-step2-header">
                Comparing with {randomStudents} Successful Students
              </h2>
              
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className={step2Stage >= 1 ? "text-primary font-medium" : "text-muted-foreground"}>
                      Matching certification...
                    </span>
                    {step2Stage >= 1 && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={step2Stage >= 2 ? "text-primary font-medium" : "text-muted-foreground"}>
                      Matching knowledge level...
                    </span>
                    {step2Stage >= 2 && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={step2Stage >= 3 ? "text-primary font-medium" : "text-muted-foreground"}>
                      Matching timeline...
                    </span>
                    {step2Stage >= 3 && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={step2Stage >= 4 ? "text-primary font-medium" : "text-muted-foreground"}>
                      {step2Stage < 4 ? "Identifying optimal path..." : "Identifying optimal path..."}
                    </span>
                    {step2Stage >= 4 && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                </div>
                
                <Progress value={step2Progress} className="h-3" data-testid="progress-step2" />
                
                {step2Complete && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-muted-foreground"
                    data-testid="text-step2-social-proof"
                  >
                    Found {certData.socialProof} students with similar profiles who passed on first attempt
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              data-testid="step-3"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center" data-testid="text-step3-header">
                Selecting Your Study Materials
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="text-center p-6 bg-primary/5 rounded-lg" data-testid="counter-modules">
                  <div className="text-4xl font-bold text-primary mb-2">{step3Counters.modules}</div>
                  <div className="text-sm text-muted-foreground">📚 Study modules selected</div>
                </div>
                
                <div className="text-center p-6 bg-primary/5 rounded-lg" data-testid="counter-videos">
                  <div className="text-4xl font-bold text-primary mb-2">{step3Counters.videos}</div>
                  <div className="text-sm text-muted-foreground">🎥 Video lessons selected</div>
                </div>
                
                <div className="text-center p-6 bg-primary/5 rounded-lg" data-testid="counter-questions">
                  <div className="text-4xl font-bold text-primary mb-2">{step3Counters.questions}</div>
                  <div className="text-sm text-muted-foreground">💻 Practice questions selected</div>
                </div>
                
                <div className="text-center p-6 bg-primary/5 rounded-lg" data-testid="counter-activities">
                  <div className="text-4xl font-bold text-primary mb-2">{step3Counters.activities}</div>
                  <div className="text-sm text-muted-foreground">🔬 {certData.activityLabel} selected</div>
                </div>
              </div>
              
              <p className="text-center text-muted-foreground" data-testid="text-step3-subtext">
                Prioritizing high-yield topics for {formData.knowledgeLevel} level
              </p>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              data-testid="step-4"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center" data-testid="text-step4-header">
                Building Your {weeks}-Week Timeline
              </h2>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                {[
                  "Week 1-3: Foundation Building",
                  "Week 4-6: Core Concepts",
                  "Week 7-9: Advanced Topics",
                  "Week 10-11: Practice & Review",
                  "Week 12: Final Prep"
                ].map((phase, index) => (
                  <div key={index} className="space-y-2" data-testid={`phase-${index}`}>
                    <div className="text-sm font-medium">{phase}</div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: step4Phases.includes(index) ? "100%" : "0%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-center text-muted-foreground" data-testid="text-step4-subtext">
                Scheduling {formData.weeklyHours} hours weekly across {learningStyleLabel} formats
              </p>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              data-testid="step-5"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center" data-testid="text-step5-header">
                Finalizing Your Success Roadmap
              </h2>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                {step5Items.includes(0) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                    data-testid="step5-item-0"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">Study reminders configured for {timingPref} schedule</span>
                  </motion.div>
                )}
                
                {step5Items.includes(1) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                    data-testid="step5-item-1"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">Progress tracking milestones set</span>
                  </motion.div>
                )}
                
                {step5Items.includes(2) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                    data-testid="step5-item-2"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">Weakness detection algorithms activated</span>
                  </motion.div>
                )}
                
                {step5Items.includes(3) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                    data-testid="step5-item-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">Celebration checkpoints scheduled</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
              data-testid="step-6"
            >
              {isGeneratingPlan ? (
                <>
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-chart-2 mb-4 mx-auto animate-pulse">
                    <Rocket className="h-10 w-10 text-white" />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-generating">
                    Generating Your Study Plan...
                  </h2>
                  
                  <p className="text-muted-foreground max-w-md mx-auto" data-testid="text-generating-subtitle">
                    Our AI is creating your personalized study plan. This may take up to 5 minutes.
                  </p>
                  
                  <div className="max-w-md mx-auto">
                    <Progress value={generatingProgress} className="h-2" data-testid="progress-generating" />
                  </div>
                </>
              ) : planGenerationError ? (
                <>
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-4 mx-auto">
                    <span className="text-4xl">⚠️</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400" data-testid="text-error">
                    Oops! Something Went Wrong
                  </h2>
                  
                  <p className="text-muted-foreground max-w-md mx-auto" data-testid="text-error-message">
                    {planGenerationError}
                  </p>
                  
                  <Button onClick={onRetry} size="lg" className="mt-4" data-testid="button-retry">
                    Try Again
                  </Button>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-chart-2 mb-4 mx-auto">
                    <Rocket className="h-10 w-10 text-white" />
                  </div>
                  
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="p-6 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-semibold">Your Personalized Plan</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><strong>Certification:</strong> {formData.certification}</p>
                        <p><strong>Study approach:</strong> {formData.studyStructure === "ai-guided" ? "AI-guided learning path" : `Custom focus on ${formData.focusAreas.length} areas`}</p>
                        <p><strong>Time commitment:</strong> {formData.weeklyHours} hours per week</p>
                        <p><strong>Target:</strong> Exam ready in {getWeeksFromHours(formData.weeklyHours).weeks} weeks</p>
                      </div>
                    </div>
                    
                    <p className="text-lg text-muted-foreground" data-testid="text-plan-summary">
                      We've created a personalized study plan tailored to your goals, schedule, and learning style.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <Button
                      size="lg"
                      onClick={() => setLocation("/")}
                      className="rounded-full text-base px-8 h-14 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                      data-testid="button-start-learning"
                    >
                      ✅ Start Learning Now
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setLocation("/")}
                      className="rounded-full text-base px-8 h-14"
                      data-testid="button-view-dashboard"
                    >
                      📊 View Dashboard
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
