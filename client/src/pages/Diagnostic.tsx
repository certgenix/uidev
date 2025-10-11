import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Rocket, Edit2, Sparkles, Clock, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const certifications = [
  "PMP®", "CISSP®", "CCSP®", "CISM®", "PRINCE2®", 
  "AWS Certified Solutions Architect", "CompTIA Security+", 
  "CompTIA Network+", "ITIL Foundation", "CPA"
];

const examTimelines = [
  { value: "1-3", label: "1–3 months", weeks: "12 weeks" },
  { value: "3-6", label: "3–6 months", weeks: "20 weeks" },
  { value: "6+", label: "6+ months", weeks: "24+ weeks" },
  { value: "not-sure", label: "Not sure yet", weeks: "flexible" }
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

type QuestionState = "unanswered" | "active" | "answered";

interface Question {
  id: number;
  state: QuestionState;
  title: string;
  subtitle?: string;
  type: "intro" | "single" | "hours" | "multi" | "optional" | "summary";
  field?: keyof FormData;
}

interface FormData {
  certification: string;
  examTimeline: string;
  weeklyHours: string;
  weaknesses: string[];
  background: string;
}

export default function Diagnostic() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<FormData>({
    certification: "",
    examTimeline: "",
    weeklyHours: "",
    weaknesses: [],
    background: ""
  });

  const [questions, setQuestions] = useState<Question[]>([
    { id: 0, state: "active", title: "Welcome to CertGenix", type: "intro" },
    { id: 1, state: "unanswered", title: "Which certification are you preparing for?", subtitle: "We cover the industry's top certifications", type: "single", field: "certification" },
    { id: 2, state: "unanswered", title: "When are you planning to take your exam?", type: "single", field: "examTimeline" },
    { id: 3, state: "unanswered", title: "How much time can you realistically commit per week?", subtitle: "Even 3 hours a week is enough — our AI will adapt", type: "hours", field: "weeklyHours" },
    { id: 4, state: "unanswered", title: "Which areas do you feel least confident in?", subtitle: "Don't worry — these will become your strongest areas", type: "multi", field: "weaknesses" },
    { id: 5, state: "unanswered", title: "Tell us a bit about your background", subtitle: "(Optional)", type: "optional", field: "background" },
    { id: 6, state: "unanswered", title: "Here's Your Personalized Roadmap 🚀", type: "summary" }
  ]);

  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const domains = formData.certification 
    ? (domainsByExam[formData.certification] || domainsByExam.default)
    : domainsByExam.default;

  const activeQuestionId = questions.find(q => q.state === "active")?.id || 0;

  const scrollToQuestion = (questionId: number) => {
    const questionElement = questionRefs.current[questionId];
    if (questionElement && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const questionRect = questionElement.getBoundingClientRect();
      const offset = questionRect.top - containerRect.top - 100;
      
      containerRef.current.scrollBy({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  const handleAnswer = (questionId: number, value: any) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    // Update form data only if question has a field
    if (question.field) {
      setFormData(prev => ({
        ...prev,
        [question.field!]: value
      }));
    }

    // Always update question states to allow progression
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) return { ...q, state: "answered" as QuestionState };
      if (q.id === questionId + 1) return { ...q, state: "active" as QuestionState };
      return q;
    }));

    setTimeout(() => scrollToQuestion(questionId + 1), 100);
  };

  const handleEdit = (questionId: number) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) return { ...q, state: "active" as QuestionState };
      if (q.state === "active") return { ...q, state: "answered" as QuestionState };
      return q;
    }));

    setTimeout(() => scrollToQuestion(questionId), 100);
  };

  const handleWeaknessToggle = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      weaknesses: prev.weaknesses.includes(domain)
        ? prev.weaknesses.filter(w => w !== domain)
        : [...prev.weaknesses, domain]
    }));
  };

  const getAnsweredCount = () => questions.filter(q => q.state === "answered").length;
  const getTotalQuestions = () => questions.length - 2; // Excluding intro and summary

  const getTimelineWeeks = () => {
    const timeline = examTimelines.find(t => t.value === formData.examTimeline);
    return timeline?.weeks || "";
  };

  const getSummaryItems = () => {
    const items = [];
    if (formData.certification) items.push({ label: "Certification", value: formData.certification });
    if (formData.examTimeline) items.push({ label: "Timeline", value: examTimelines.find(t => t.value === formData.examTimeline)?.label || "" });
    if (formData.weeklyHours) items.push({ label: "Weekly Study", value: weeklyHours.find(h => h.value === formData.weeklyHours)?.label || "" });
    if (formData.weaknesses.length > 0) items.push({ label: "Focus Areas", value: `${formData.weaknesses.length} domains` });
    return items;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="relative flex-1 flex">
        {/* Sticky Summary Card - Desktop Only */}
        <AnimatePresence>
          {activeQuestionId > 0 && activeQuestionId < 6 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden lg:block fixed right-8 top-32 w-64 z-10"
            >
              <Card className="p-4 shadow-xl border-2 border-primary/20 bg-card/95 backdrop-blur">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Your Plan So Far</h3>
                </div>
                <div className="space-y-2">
                  {getSummaryItems().map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-muted-foreground text-xs">{item.label}</div>
                        <div className="font-medium truncate">{item.value}</div>
                      </div>
                    </div>
                  ))}
                  {formData.examTimeline && getTimelineWeeks() && (
                    <div className="flex items-start gap-2 text-sm pt-2 border-t">
                      <Clock className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <div className="text-muted-foreground text-xs">Estimated Duration</div>
                        <div className="font-medium">{getTimelineWeeks()}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
                  {getTotalQuestions() - getAnsweredCount()} questions remaining...
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto px-4 py-12 md:py-20"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {questions.map((question) => (
              <motion.div
                key={question.id}
                ref={(el) => (questionRefs.current[question.id] = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: question.state === "unanswered" ? 0 : 1,
                  y: question.state === "unanswered" ? 20 : 0,
                  scale: question.state === "answered" ? 0.96 : 1,
                  height: question.state === "answered" ? "auto" : "auto"
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`
                  ${question.state === "unanswered" ? "hidden" : "block"}
                  ${question.state === "answered" ? "opacity-75" : "opacity-100"}
                `}
                data-testid={`question-${question.id}`}
              >
                <Card 
                  className={`
                    relative overflow-hidden transition-all duration-300
                    ${question.state === "active" ? "shadow-2xl border-2 border-primary/30" : "shadow-lg border-border"}
                    ${question.state === "answered" ? "cursor-pointer hover:shadow-xl hover:border-primary/20" : ""}
                  `}
                  onClick={() => question.state === "answered" && handleEdit(question.id)}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-primary/5 to-transparent z-0" />
                  
                  <div className="relative z-10 p-6 md:p-8">
                    {/* Question Header */}
                    <div className="text-center space-y-2 mb-6">
                      {question.state === "answered" && (
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Answered</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <Edit2 className="h-3 w-3" />
                            <span>Edit</span>
                          </div>
                        </div>
                      )}
                      <h2 className={`font-bold ${question.state === "answered" ? "text-xl" : "text-2xl md:text-3xl"}`}>
                        {question.title}
                      </h2>
                      {question.subtitle && (
                        <p className="text-muted-foreground">{question.subtitle}</p>
                      )}
                    </div>

                    {/* Question Content */}
                    <AnimatePresence mode="wait">
                      {question.state === "active" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Intro */}
                          {question.type === "intro" && (
                            <div className="text-center space-y-6">
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-primary">Personalized Learning</span>
                              </div>
                              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                We're here to help you pass your exam — and master your career.
                              </p>
                              <Button
                                size="lg"
                                onClick={() => handleAnswer(0, true)}
                                className="rounded-full text-base px-8 h-14 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                                data-testid="button-lets-build"
                              >
                                Let's Build Your Plan
                              </Button>
                            </div>
                          )}

                          {/* Single Choice - Certification */}
                          {question.type === "single" && question.field === "certification" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {certifications.map((cert) => (
                                <button
                                  key={cert}
                                  onClick={() => handleAnswer(question.id, cert)}
                                  className="p-4 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-accent text-left transition-all"
                                  data-testid={`button-cert-${cert.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                >
                                  <span className="font-medium">{cert}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Single Choice - Timeline */}
                          {question.type === "single" && question.field === "examTimeline" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {examTimelines.map((timeline) => (
                                <button
                                  key={timeline.value}
                                  onClick={() => handleAnswer(question.id, timeline.value)}
                                  className="p-4 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-accent text-left transition-all"
                                  data-testid={`button-timeline-${timeline.value}`}
                                >
                                  <span className="font-medium">{timeline.label}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Hours */}
                          {question.type === "hours" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {weeklyHours.map((hours) => (
                                <button
                                  key={hours.value}
                                  onClick={() => handleAnswer(question.id, hours.value)}
                                  className="p-4 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-accent text-left transition-all"
                                  data-testid={`button-hours-${hours.value}`}
                                >
                                  <span className="font-medium">{hours.label}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Multi - Weaknesses */}
                          {question.type === "multi" && (
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
                                  >
                                    <Checkbox
                                      checked={formData.weaknesses.includes(domain)}
                                      onCheckedChange={() => handleWeaknessToggle(domain)}
                                      id={domainId}
                                      data-testid={`checkbox-${domainId}`}
                                    />
                                    <Label htmlFor={domainId} className="flex-1 cursor-pointer text-base">
                                      {domain}
                                    </Label>
                                  </div>
                                );
                              })}
                              {formData.weaknesses.length > 0 && (
                                <Button
                                  onClick={() => handleAnswer(question.id, formData.weaknesses)}
                                  className="w-full rounded-full mt-4"
                                  data-testid="button-continue-weaknesses"
                                >
                                  Continue
                                </Button>
                              )}
                            </div>
                          )}

                          {/* Optional - Background */}
                          {question.type === "optional" && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                  { value: "student", label: "Student" },
                                  { value: "professional", label: "Working Professional" },
                                  { value: "career-switcher", label: "Career Switcher" },
                                  { value: "manager", label: "Manager" }
                                ].map((bg) => (
                                  <button
                                    key={bg.value}
                                    onClick={() => handleAnswer(question.id, bg.value)}
                                    className="p-4 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-accent text-left transition-all"
                                    data-testid={`button-background-${bg.value}`}
                                  >
                                    <span className="font-medium">{bg.label}</span>
                                  </button>
                                ))}
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => handleAnswer(question.id, "")}
                                className="w-full rounded-full"
                                data-testid="button-skip-background"
                              >
                                Skip this step
                              </Button>
                            </div>
                          )}

                          {/* Summary */}
                          {question.type === "summary" && (
                            <div className="text-center space-y-6">
                              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-chart-2 mb-4 mx-auto">
                                <Rocket className="h-10 w-10 text-white" />
                              </div>
                              <div className="max-w-2xl mx-auto space-y-4">
                                <p className="text-lg text-muted-foreground" data-testid="text-plan-summary">
                                  3 short modules + 1 quiz per week → You'll be exam-ready in {getTimelineWeeks()}.
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
                        </motion.div>
                      )}

                      {/* Answered State - Show selected value */}
                      {question.state === "answered" && question.field && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-2"
                        >
                          {formData[question.field] && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {(() => {
                                  const field = question.field;
                                  if (field === "weaknesses") {
                                    return `${(formData[field] as string[]).length} domains selected`;
                                  } else if (field === "examTimeline") {
                                    return examTimelines.find(t => t.value === formData[field])?.label;
                                  } else if (field === "weeklyHours") {
                                    return weeklyHours.find(h => h.value === formData[field])?.label;
                                  } else {
                                    return formData[field];
                                  }
                                })()}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
