import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Timer, Clock, CheckCircle2, ChevronDown, ChevronRight, ArrowLeft, BarChart3 } from "lucide-react";

const CISSP_DOMAINS = [
  "Security & Risk Management",
  "Asset Security",
  "Security Architecture & Engineering",
  "Communication & Network Security",
  "Identity & Access Management (IAM)",
  "Security Assessment & Testing",
  "Security Operations",
  "Software Development Security"
];

const CISSP_BLUEPRINT = {
  "Security & Risk Management": 0.15,
  "Asset Security": 0.10,
  "Security Architecture & Engineering": 0.13,
  "Communication & Network Security": 0.13,
  "Identity & Access Management (IAM)": 0.13,
  "Security Assessment & Testing": 0.12,
  "Security Operations": 0.13,
  "Software Development Security": 0.11
};

type ViewMode = "quick-start" | "customize";

export default function Simulator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [view, setView] = useState<ViewMode>("quick-start");
  const [selectedMode, setSelectedMode] = useState<"quiz" | "exam">("quiz");
  
  const [certification] = useState("CISSP");
  const [selectedDomains, setSelectedDomains] = useState<string[]>(CISSP_DOMAINS);
  const [questionCount, setQuestionCount] = useState(30);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(45);
  const [reviewAll, setReviewAll] = useState(true);
  const [showPerformance, setShowPerformance] = useState(true);
  const [showExplanations, setShowExplanations] = useState(true);
  const [domainsExpanded, setDomainsExpanded] = useState(false);

  const estimatedTime = useMemo(() => {
    const avgTimePerQuestion = 1.5;
    const totalMinutes = Math.ceil(questionCount * avgTimePerQuestion);
    return totalMinutes;
  }, [questionCount]);

  const createSessionMutation = useMutation({
    mutationFn: async (payload?: {
      mode: "quiz" | "exam";
      domains: string[];
      questionCount: number;
      timerEnabled: boolean;
      timerMinutes: number;
      showExplanations: boolean;
    }) => {
      const config = payload || {
        mode: selectedMode,
        domains: selectedDomains,
        questionCount,
        timerEnabled,
        timerMinutes,
        showExplanations
      };
      
      const response = await apiRequest("POST", "/api/sessions", {
        certificationName: certification,
        mode: config.mode,
        domains: config.domains,
        blueprint: CISSP_BLUEPRINT,
        questionCount: config.questionCount,
        timer: {
          enabled: config.timerEnabled,
          durationMin: config.timerMinutes
        },
        review: {
          quickBefore: false,
          quickAfter: reviewAll,
          explanationsWhileTaking: config.showExplanations
        }
      });
      return response.json() as Promise<{ sessionId: string }>;
    },
    onSuccess: (data) => {
      toast({
        title: "Session created",
        description: `Starting your ${selectedMode === "quiz" ? "practice quiz" : "exam simulation"}...`
      });
      setLocation(`/simulator/exam/${data.sessionId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const handleQuickStart = (mode: "quiz" | "exam") => {
    const defaults = mode === "quiz" 
      ? {
          mode: "quiz" as const,
          domains: CISSP_DOMAINS,
          questionCount: 30,
          timerEnabled: false,
          timerMinutes: 45,
          showExplanations: true
        }
      : {
          mode: "exam" as const,
          domains: CISSP_DOMAINS,
          questionCount: 100,
          timerEnabled: true,
          timerMinutes: 180,
          showExplanations: false
        };
    
    setSelectedMode(mode);
    setSelectedDomains(defaults.domains);
    setQuestionCount(defaults.questionCount);
    setTimerEnabled(defaults.timerEnabled);
    setTimerMinutes(defaults.timerMinutes);
    setShowExplanations(defaults.showExplanations);
    
    createSessionMutation.mutate(defaults);
  };

  const handleCustomize = (mode: "quiz" | "exam") => {
    setSelectedMode(mode);
    
    if (mode === "quiz") {
      setQuestionCount(30);
      setTimerEnabled(false);
      setShowExplanations(true);
    } else {
      setQuestionCount(100);
      setTimerEnabled(true);
      setTimerMinutes(180);
      setShowExplanations(false);
    }
    
    setView("customize");
  };

  const incrementQuestions = () => {
    setQuestionCount(prev => Math.min(100, prev + 5));
  };

  const decrementQuestions = () => {
    setQuestionCount(prev => Math.max(5, prev - 5));
  };

  if (view === "quick-start") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3" data-testid="heading-main">
              Let's Set Up Your Practice Session
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-subheading">
              Choose how you'd like to study today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow" data-testid="card-practice-mode">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-8 h-8 text-primary" />
                  <CardTitle className="text-2xl">Practice Quiz</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Perfect for learning and skill building
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Get instant feedback after each question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>See detailed explanations as you go</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Track your progress in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>No time pressure - learn at your pace</span>
                  </li>
                </ul>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">Default Settings:</p>
                  <p className="text-sm text-muted-foreground">30 questions from all domains</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => handleQuickStart("quiz")}
                    disabled={createSessionMutation.isPending}
                    className="w-full"
                    size="lg"
                    data-testid="button-start-practice"
                  >
                    {createSessionMutation.isPending && selectedMode === "quiz" ? "Starting..." : "Start Practice"}
                  </Button>
                  <button
                    onClick={() => handleCustomize("quiz")}
                    className="w-full text-sm text-primary hover:underline"
                    data-testid="link-customize-practice"
                  >
                    Customize →
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-exam-mode">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Timer className="w-8 h-8 text-primary" />
                  <CardTitle className="text-2xl">Exam Simulation</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Test yourself under real exam conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Timed session mimics actual CISSP exam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>No hints or feedback during the test</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Review all answers at the end</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Get your final score and performance report</span>
                  </li>
                </ul>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">Default Settings:</p>
                  <p className="text-sm text-muted-foreground">100 questions, 180 minutes, all 8 domains</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => handleQuickStart("exam")}
                    disabled={createSessionMutation.isPending}
                    className="w-full"
                    size="lg"
                    data-testid="button-start-exam"
                  >
                    {createSessionMutation.isPending && selectedMode === "exam" ? "Starting..." : "Start Exam"}
                  </Button>
                  <button
                    onClick={() => handleCustomize("exam")}
                    className="w-full text-sm text-primary hover:underline"
                    data-testid="link-customize-exam"
                  >
                    Customize →
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => setView("quick-start")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          data-testid="link-back-to-quick-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quick Start
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" data-testid="heading-customize">
            Customize Your {selectedMode === "quiz" ? "Practice Quiz" : "Exam Simulation"}
          </h1>
          <p className="text-muted-foreground" data-testid="text-customize-subheading">
            Adjust your session settings (or use our recommended defaults)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Areas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  By default, questions cover all domains:
                </p>
                
                <div className="space-y-2">
                  {CISSP_DOMAINS.slice(0, 3).map(domain => (
                    <div key={domain} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>{domain}</span>
                    </div>
                  ))}
                </div>

                <Collapsible open={domainsExpanded} onOpenChange={setDomainsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      data-testid="button-toggle-domains"
                    >
                      Select Specific Domains
                      {domainsExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-3">
                    {CISSP_DOMAINS.map(domain => (
                      <div key={domain} className="flex items-center space-x-2">
                        <Checkbox
                          id={domain}
                          checked={selectedDomains.includes(domain)}
                          onCheckedChange={() => handleDomainToggle(domain)}
                          data-testid={`checkbox-domain-${domain}`}
                        />
                        <label
                          htmlFor={domain}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {domain}
                        </label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Length</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="questionCount" data-testid="label-question-count">
                    Number of Questions
                  </Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuestions}
                      data-testid="button-decrease-questions"
                    >
                      -
                    </Button>
                    <Input
                      id="questionCount"
                      type="number"
                      min={5}
                      max={100}
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value) || 30)}
                      className="text-center w-24"
                      data-testid="input-question-count"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuestions}
                      data-testid="button-increase-questions"
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Range: 5-100 questions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Recommended: 30 for practice, 100 for exam simulation
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timer Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMode === "quiz" ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="timerEnabled"
                        checked={timerEnabled}
                        onCheckedChange={(checked) => setTimerEnabled(checked as boolean)}
                        data-testid="checkbox-timer-enabled"
                      />
                      <Label htmlFor="timerEnabled" className="cursor-pointer">
                        Add Timer (Optional)
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Challenge yourself with time pressure
                    </p>
                    {timerEnabled && (
                      <div className="space-y-2 pt-2">
                        <Label htmlFor="timerMinutes" className="text-sm">Duration (minutes)</Label>
                        <Input
                          id="timerMinutes"
                          type="number"
                          min={1}
                          max={300}
                          value={timerMinutes}
                          onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 45)}
                          className="w-32"
                          data-testid="input-timer-minutes"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium">Timer Enabled (Required for exam simulation)</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timerMinutes" className="text-sm">Duration (minutes)</Label>
                      <Input
                        id="timerMinutes"
                        type="number"
                        min={1}
                        max={300}
                        value={timerMinutes}
                        onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 180)}
                        className="w-32"
                        data-testid="input-timer-minutes"
                      />
                      <p className="text-xs text-muted-foreground">
                        Note: Actual CISSP exam allows 1.5 minutes per question
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium">After Completing This Session:</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reviewAll"
                        checked={reviewAll}
                        onCheckedChange={(checked) => setReviewAll(checked as boolean)}
                        data-testid="checkbox-review-all"
                      />
                      <Label htmlFor="reviewAll" className="cursor-pointer text-sm">
                        Review all questions and answers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showPerformance"
                        checked={showPerformance}
                        onCheckedChange={(checked) => setShowPerformance(checked as boolean)}
                        data-testid="checkbox-show-performance"
                      />
                      <Label htmlFor="showPerformance" className="cursor-pointer text-sm">
                        See detailed performance breakdown by domain
                      </Label>
                    </div>
                  </div>
                </div>

                {selectedMode === "quiz" && (
                  <div className="space-y-3 pt-3 border-t">
                    <p className="text-sm font-medium">During Quiz (Practice Mode Only):</p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showExplanations"
                        checked={showExplanations}
                        onCheckedChange={(checked) => setShowExplanations(checked as boolean)}
                        data-testid="checkbox-show-explanations"
                      />
                      <Label htmlFor="showExplanations" className="cursor-pointer text-sm">
                        Show explanations immediately after each answer
                      </Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4 bg-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Your Session Setup</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Mode:</p>
                    <p className="font-medium" data-testid="text-summary-mode">
                      {selectedMode === "quiz" ? "Practice Quiz" : "Exam Simulation"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Questions:</p>
                    <p className="font-medium" data-testid="text-summary-questions">
                      {questionCount} from {selectedDomains.length} domain{selectedDomains.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Timer:</p>
                    <p className="font-medium" data-testid="text-summary-timer">
                      {timerEnabled ? `${timerMinutes} minutes` : "Not enabled"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated time:</p>
                    <p className="font-medium" data-testid="text-summary-estimated">
                      ~{estimatedTime} minutes
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => createSessionMutation.mutate(undefined)}
                  disabled={createSessionMutation.isPending || selectedDomains.length === 0}
                  className="w-full"
                  size="lg"
                  data-testid="button-start-custom-session"
                >
                  {createSessionMutation.isPending
                    ? "Creating Session..."
                    : selectedMode === "quiz"
                    ? "Start Practice Quiz"
                    : "Begin Exam Simulation"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
