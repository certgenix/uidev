import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Timer, Clock, Info, CheckCircle2, AlertCircle } from "lucide-react";

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

export default function Simulator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [certification, setCertification] = useState("CISSP");
  const [selectedDomains, setSelectedDomains] = useState<string[]>(CISSP_DOMAINS);
  const [questionCount, setQuestionCount] = useState(30);
  const [mode, setMode] = useState("quiz");
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(45);
  const [explanationsWhileTaking, setExplanationsWhileTaking] = useState(true);

  useEffect(() => {
    if (mode === "exam") {
      setTimerEnabled(true);
      setExplanationsWhileTaking(false);
    } else {
      setExplanationsWhileTaking(true);
    }
  }, [mode]);

  const estimatedTime = useMemo(() => {
    const avgTimePerQuestion = 1.5;
    const totalMinutes = Math.ceil(questionCount * avgTimePerQuestion);
    return totalMinutes;
  }, [questionCount]);

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/sessions", {
        certificationName: certification,
        mode,
        domains: selectedDomains,
        blueprint: CISSP_BLUEPRINT,
        questionCount,
        timer: {
          enabled: timerEnabled,
          durationMin: timerMinutes
        },
        review: {
          quickBefore: false,
          quickAfter: false,
          explanationsWhileTaking
        }
      });
      return response.json() as Promise<{ sessionId: string }>;
    },
    onSuccess: (data) => {
      toast({
        title: "Session created",
        description: `Starting your ${mode === "quiz" ? "practice quiz" : "exam simulation"}...`
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

  const buttonText = useMemo(() => {
    if (createSessionMutation.isPending) return "Creating Session...";
    return mode === "quiz" ? "Start Practice Quiz" : "Begin Exam Simulation";
  }, [mode, createSessionMutation.isPending]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <CheckCircle2 className="w-4 h-4" />
              Step 1 of 1: Configure Session
            </div>
            <h1 className="text-3xl font-bold mb-2" data-testid="heading-main">
              Let's Set Up Your Practice Session
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-subheading">
              Choose how you want to study today. Practice mode helps you learn with instant feedback, 
              while Exam mode simulates the real test experience.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Session Configuration</CardTitle>
              <CardDescription>
                Customize your study session settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="certification" data-testid="label-certification">Certification</Label>
                <Select value={certification} onValueChange={setCertification}>
                  <SelectTrigger id="certification" data-testid="select-certification">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CISSP">CISSP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label data-testid="label-domains">
                    Select Study Areas <span className="text-destructive">*</span>
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help" data-testid="icon-domains-info" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choose one or more domains to focus on</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-muted-foreground">Choose one or more domains to focus on</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="mode" data-testid="label-mode">
                    Study Mode <span className="text-destructive">*</span>
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help" data-testid="icon-mode-info" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choose between practice learning or exam simulation</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer transition-all ${mode === "quiz" ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"}`}
                    onClick={() => setMode("quiz")}
                    data-testid="card-mode-quiz"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <input
                            type="radio"
                            id="mode-quiz"
                            name="mode"
                            value="quiz"
                            checked={mode === "quiz"}
                            onChange={() => setMode("quiz")}
                            className="w-4 h-4"
                            data-testid="radio-mode-quiz"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <label htmlFor="mode-quiz" className="font-semibold cursor-pointer">
                              Quiz (Practice)
                            </label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Learn as you go - Get instant explanations after each question
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all ${mode === "exam" ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"}`}
                    onClick={() => setMode("exam")}
                    data-testid="card-mode-exam"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <input
                            type="radio"
                            id="mode-exam"
                            name="mode"
                            value="exam"
                            checked={mode === "exam"}
                            onChange={() => setMode("exam")}
                            className="w-4 h-4"
                            data-testid="radio-mode-exam"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Timer className="w-5 h-5 text-primary" />
                            <label htmlFor="mode-exam" className="font-semibold cursor-pointer">
                              Exam (Simulation)
                            </label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Test yourself - Timed exam with results at the end
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="questionCount" data-testid="label-question-count">
                      Questions per Session <span className="text-destructive">*</span>
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground cursor-help" data-testid="icon-questions-info" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Choose between 5 and 100 questions</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="questionCount"
                    type="number"
                    min={5}
                    max={100}
                    placeholder="Enter 5-100"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value) || 30)}
                    data-testid="input-question-count"
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended: 30 for practice, 100 for full simulation
                  </p>
                </div>

                <div className="space-y-2">
                  {mode === "quiz" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="timerEnabled" data-testid="label-timer-optional">Add Timer (Optional)</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" data-testid="icon-timer-info" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Challenge yourself with time pressure</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                          id="timerEnabled"
                          checked={timerEnabled}
                          onCheckedChange={(checked) => setTimerEnabled(checked as boolean)}
                          data-testid="checkbox-timer-enabled"
                        />
                        <Label htmlFor="timerEnabled" className="cursor-pointer text-sm">
                          Enable timer for this session
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Challenge yourself with time pressure
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="timerMinutes" data-testid="label-exam-duration">
                          Exam Duration <span className="text-destructive">*</span>
                        </Label>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          id="timerMinutes"
                          type="number"
                          min={1}
                          max={300}
                          value={timerMinutes}
                          onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 45)}
                          className="flex-1"
                          data-testid="input-timer-minutes"
                        />
                        <span className="text-sm text-muted-foreground">minutes</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Timer is required for exam mode
                      </p>
                    </>
                  )}
                  {timerEnabled && mode === "quiz" && (
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="timerMinutes" className="text-sm" data-testid="label-timer-minutes">Duration (minutes)</Label>
                      <Input
                        id="timerMinutes"
                        type="number"
                        min={1}
                        max={300}
                        value={timerMinutes}
                        onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 45)}
                        data-testid="input-timer-minutes"
                      />
                    </div>
                  )}
                </div>
              </div>

              {mode === "quiz" && (
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Label data-testid="label-learning-options" className="font-semibold">Learning Options</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground cursor-help" data-testid="icon-learning-info" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Available in Quiz mode only</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="explanationsWhileTaking"
                      checked={true}
                      disabled={true}
                      data-testid="checkbox-explanations-while-taking"
                    />
                    <Label htmlFor="explanationsWhileTaking" className="cursor-pointer text-sm">
                      See explanations during the session
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Always enabled in Quiz mode to help you learn
                  </p>
                </div>
              )}

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2" data-testid="heading-summary">Session Summary</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p data-testid="text-summary-details">
                          You're about to start: <span className="font-medium text-foreground">{questionCount} questions</span> from{" "}
                          <span className="font-medium text-foreground">{selectedDomains.length} domain{selectedDomains.length !== 1 ? "s" : ""}</span> in{" "}
                          <span className="font-medium text-foreground">{mode === "quiz" ? "Quiz" : "Exam"} mode</span>
                        </p>
                        <p data-testid="text-estimated-time">
                          Estimated completion time:{" "}
                          <span className="font-medium text-foreground">
                            {estimatedTime} minutes
                          </span>
                        </p>
                        {timerEnabled && (
                          <p data-testid="text-timer-info">
                            Timer duration:{" "}
                            <span className="font-medium text-foreground">{timerMinutes} minutes</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => createSessionMutation.mutate()}
                disabled={createSessionMutation.isPending || selectedDomains.length === 0}
                className="w-full"
                size="lg"
                data-testid="button-start-session"
              >
                {buttonText}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
