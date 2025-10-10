import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
  const [quickBefore, setQuickBefore] = useState(false);
  const [quickAfter, setQuickAfter] = useState(true);
  const [explanationsWhileTaking, setExplanationsWhileTaking] = useState(false);

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/sessions", {
        method: "POST",
        body: JSON.stringify({
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
            quickBefore,
            quickAfter,
            explanationsWhileTaking
          }
        }),
        headers: { "Content-Type": "application/json" }
      });
      return response as { sessionId: string };
    },
    onSuccess: (data) => {
      toast({
        title: "Session created",
        description: "Starting your exam simulation..."
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Configure Exam Simulation</CardTitle>
            <CardDescription>
              Set up your practice session with custom options
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
              <Label data-testid="label-domains">Domains (select at least one)</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="questionCount" data-testid="label-question-count">Number of Questions (5-100)</Label>
                <Input
                  id="questionCount"
                  type="number"
                  min={5}
                  max={100}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value) || 30)}
                  data-testid="input-question-count"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mode" data-testid="label-mode">Mode</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger id="mode" data-testid="select-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz (Practice)</SelectItem>
                    <SelectItem value="exam">Exam (Simulation)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timerEnabled"
                  checked={timerEnabled}
                  onCheckedChange={(checked) => setTimerEnabled(checked as boolean)}
                  data-testid="checkbox-timer-enabled"
                />
                <Label htmlFor="timerEnabled" className="cursor-pointer">Enable Timer</Label>
              </div>
              {timerEnabled && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="timerMinutes" data-testid="label-timer-minutes">Duration (minutes)</Label>
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

            <div className="space-y-3">
              <Label data-testid="label-review-options">Review Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="quickBefore"
                    checked={quickBefore}
                    onCheckedChange={(checked) => setQuickBefore(checked as boolean)}
                    data-testid="checkbox-quick-before"
                  />
                  <Label htmlFor="quickBefore" className="cursor-pointer">Quick Review Before</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="quickAfter"
                    checked={quickAfter}
                    onCheckedChange={(checked) => setQuickAfter(checked as boolean)}
                    data-testid="checkbox-quick-after"
                  />
                  <Label htmlFor="quickAfter" className="cursor-pointer">Quick Review After</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="explanationsWhileTaking"
                    checked={explanationsWhileTaking}
                    onCheckedChange={(checked) => setExplanationsWhileTaking(checked as boolean)}
                    data-testid="checkbox-explanations-while-taking"
                  />
                  <Label htmlFor="explanationsWhileTaking" className="cursor-pointer">Show Explanations While Taking</Label>
                </div>
              </div>
            </div>

            <Button
              onClick={() => createSessionMutation.mutate()}
              disabled={createSessionMutation.isPending || selectedDomains.length === 0}
              className="w-full"
              size="lg"
              data-testid="button-start-session"
            >
              {createSessionMutation.isPending ? "Creating Session..." : "Start Session"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
