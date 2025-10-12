import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Rocket, Edit2, Sparkles, Clock, Calendar, Lightbulb, BookOpen, Video, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const certifications = [
  { value: "CISSP®", label: "CISSP®" },
  { value: "PMP®", label: "PMP®" },
  { value: "CCSP®", label: "CCSP®" },
  { value: "CISM®", label: "CISM®" },
  { value: "CISA®", label: "CISA®" },
  { value: "AWS Certified Solutions Architect", label: "AWS Certified Solutions Architect" },
  { value: "CompTIA Security+", label: "CompTIA Security+" },
  { value: "CompTIA Network+", label: "CompTIA Network+" }
];

const knowledgeLevels = [
  { 
    value: "beginner", 
    label: "Just starting - I'm new to this field",
    description: "Perfect! We'll start with fundamentals and build up gradually"
  },
  { 
    value: "intermediate", 
    label: "Some experience - I know the basics",
    description: "Great! We'll focus on intermediate concepts and exam strategies"
  },
  { 
    value: "advanced", 
    label: "Advanced - I'm reviewing before the exam",
    description: "Excellent! We'll concentrate on practice tests and weak areas"
  }
];

const learningStyles = [
  { 
    value: "reading", 
    label: "Reading & taking notes",
    description: "I prefer text-based content and written materials",
    icon: BookOpen
  },
  { 
    value: "videos", 
    label: "Watching videos",
    description: "I learn better with visual explanations and demonstrations",
    icon: Video
  },
  { 
    value: "hands-on", 
    label: "Hands-on practice",
    description: "I need to apply concepts immediately through exercises",
    icon: Wrench
  },
  { 
    value: "mixed", 
    label: "Mixed approach (Recommended)",
    description: "Variety keeps me engaged - use everything available",
    icon: Sparkles
  }
];

const studyStructures = [
  { 
    value: "ai-guided", 
    label: "Let AI create my plan (Recommended)",
    description: "Our AI analyzes your level and identifies the best study path"
  },
  { 
    value: "manual", 
    label: "I'll choose specific focus areas",
    description: "Select the domains where you need the most improvement"
  }
];

const domainsByExam: Record<string, Array<{name: string, description: string}>> = {
  "CISSP®": [
    { name: "Security & Risk Management", description: "Governance, compliance, legal and regulatory issues" },
    { name: "Asset Security", description: "Protecting security of assets" },
    { name: "Security Architecture & Engineering", description: "Design and secure network architecture" },
    { name: "Communication & Network Security", description: "Network components, protocols, and secure design" },
    { name: "Identity & Access Management (IAM)", description: "Access control and identity management" },
    { name: "Security Assessment & Testing", description: "Testing, assessment, and audit strategies" },
    { name: "Security Operations", description: "Operations and incident management" },
    { name: "Software Development Security", description: "Secure software development lifecycle" }
  ],
  "PMP®": [
    { name: "Initiating", description: "Project initiation and charter" },
    { name: "Planning", description: "Project planning and scheduling" },
    { name: "Executing", description: "Project execution" },
    { name: "Monitoring & Controlling", description: "Project monitoring and control" },
    { name: "Closing", description: "Project closing procedures" }
  ],
  "default": [
    { name: "Domain 1", description: "Core concepts and fundamentals" },
    { name: "Domain 2", description: "Advanced topics" },
    { name: "Domain 3", description: "Practical applications" },
    { name: "Domain 4", description: "Best practices" }
  ]
};

const previousAttempts = [
  { 
    value: "first-time", 
    label: "No, this is my first attempt",
    description: "We'll build your knowledge from the ground up"
  },
  { 
    value: "retaking", 
    label: "Yes, I didn't pass - retaking it",
    description: "We'll focus on areas that need improvement"
  },
  { 
    value: "recertifying", 
    label: "Yes, I passed but recertifying",
    description: "We'll help you refresh and stay current"
  }
];

const examTimelines = [
  { value: "scheduled", label: "I've already scheduled it", sublabel: "In 1-3 months", showDatePicker: true },
  { value: "3-6", label: "Soon", sublabel: "In 3-6 months", showDatePicker: false },
  { value: "6+", label: "Later this year", sublabel: "6+ months away", showDatePicker: false },
  { value: "deciding", label: "I'm still deciding", sublabel: "I'm exploring my options", showDatePicker: false }
];

const weeklyHours = [
  { value: "1-3", label: "1-3 hours per week", estimate: "Steady progress • 15-20 weeks to exam ready" },
  { value: "3-5", label: "3-5 hours per week", estimate: "Balanced pace • 10-15 weeks to exam ready" },
  { value: "6-10", label: "6-10 hours per week", estimate: "Focused prep • 6-10 weeks to exam ready" },
  { value: "10+", label: "10+ hours per week", estimate: "Intensive study • 4-6 weeks to exam ready" }
];

const studyTimings = [
  { value: "same-time", label: "Same time every day", description: "e.g., every morning or every evening - helps build a habit" },
  { value: "weekends", label: "Weekends only", description: "I'm busy during weekdays" },
  { value: "flexible", label: "Flexible schedule", description: "Whenever I have free time" },
  { value: "short-bursts", label: "Short bursts throughout the day", description: "15-20 minute sessions when I can" }
];

const ENCOURAGING_TEXT: Record<string, Record<string, string>> = {
  q1_certification: {
    "CISSP®": "✓ Excellent choice! CISSP is one of the most respected security certifications",
    "PMP®": "✓ Great! PMP will elevate your project management career",
    "CCSP®": "✓ Smart move! Cloud security expertise is in high demand",
    "CISM®": "✓ Perfect! CISM focuses on security management and governance",
    "CISA®": "✓ Excellent! CISA is the gold standard for IT auditors",
    "AWS Certified Solutions Architect": "✓ Great choice! AWS skills are highly sought after",
    "CompTIA Security+": "✓ Perfect starting point! Security+ is an excellent foundation",
    "CompTIA Network+": "✓ Smart choice! Networking fundamentals are essential"
  },
  q2_knowledge: {
    beginner: "✓ Perfect! We'll start with fundamentals and build step by step",
    intermediate: "✓ Great! We'll build on what you know and focus on exam strategies",
    advanced: "✓ Excellent! We'll concentrate on practice tests and reinforcing knowledge"
  },
  q3_learning: {
    reading: "✓ Great! We'll emphasize text-based materials and written exercises",
    videos: "✓ Perfect! We'll focus on video lessons and visual demonstrations",
    "hands-on": "✓ Excellent! We'll include plenty of practical exercises and labs",
    mixed: "✓ Smart choice! Variety creates better retention and keeps learning engaging"
  },
  q4_structure: {
    "ai-guided": "✓ Smart choice! Our AI will optimize your study path based on proven patterns",
    manual: "✓ Perfect! We'll customize your plan around your chosen priorities"
  },
  q5_attempts: {
    "first-time": "✓ Exciting! We'll build your knowledge from the ground up for success",
    retaking: "✓ You've got this! We'll turn your weak areas into strengths",
    recertifying: "✓ Great! We'll help you refresh your knowledge and stay current"
  },
  q6_timeline: {
    scheduled: "✓ Perfect! We'll create an intensive plan to get you exam-ready on time",
    "3-6": "✓ Great timeline! This gives you the right balance of depth and pace",
    "6+": "✓ Excellent! You have time to build deep understanding and confidence",
    deciding: "✓ No problem! We'll create a flexible plan you can adjust as you decide"
  },
  q7_hours: {
    "1-3": "✓ Perfect! Steady, consistent progress is the key to retention",
    "3-5": "✓ Great balance! This pace has helped hundreds of students succeed",
    "6-10": "✓ Excellent commitment! You'll build strong knowledge quickly",
    "10+": "✓ Impressive dedication! You'll have deep mastery in a short timeframe"
  },
  q8_timing: {
    "same-time": "✓ Excellent! Routine builds powerful study habits and consistency",
    weekends: "✓ Perfect! We'll structure longer weekend sessions for productivity",
    flexible: "✓ Great! We'll set weekly goals that fit your changing schedule",
    "short-bursts": "✓ Smart! Micro-learning sessions are proven to improve retention"
  }
};

const HELPER_TEXT: Record<string, string> = {
  q1: "💡 This helps us select the right study materials and exam strategies for your certification",
  q2: "💡 This determines your starting point, content difficulty, and study pace",
  q3: "💡 This helps us match study activities to how your brain retains information best",
  q4: "💡 Our AI has helped 800+ students pass - it knows which topics to prioritize for your level",
  q5: "💡 This helps us adjust your study plan - everyone's journey is different",
  q6: "💡 Don't worry if you haven't scheduled yet - you can adjust anytime and most students study for 2-4 months",
  q7: "💡 Studies show consistent, smaller sessions lead to better retention than cramming - even 3 hours weekly is enough!",
  q8: "💡 This helps us schedule activities at times when you're most alert and send reminders at the right moments"
};

type QuestionState = "unanswered" | "active" | "answered";

interface Question {
  id: number;
  state: QuestionState;
  title: string;
  subtitle?: string;
  type: "single" | "multi" | "date" | "summary" | "welcome";
  field?: keyof FormData;
  helpText?: string;
  conditional?: boolean;
}

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

export default function Diagnostic() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<FormData>({
    certification: "",
    knowledgeLevel: "",
    learningStyle: "",
    studyStructure: "",
    focusAreas: [],
    previousAttempts: "",
    failedDomains: [],
    examTimeline: "",
    examDate: "",
    weeklyHours: "",
    studyTimes: ""
  });

  const [questions, setQuestions] = useState<Question[]>([
    { id: 0, state: "active", title: "Let's Build Your Study Plan! 🎯", type: "welcome" },
    { id: 1, state: "unanswered", title: "Which certification are you preparing for?", type: "single", field: "certification" },
    { id: 2, state: "unanswered", title: "What's your current knowledge level?", type: "single", field: "knowledgeLevel" },
    { id: 3, state: "unanswered", title: "How do you learn best?", type: "single", field: "learningStyle" },
    { id: 4, state: "unanswered", title: "How do you want to structure your study?", type: "single", field: "studyStructure" },
    { id: 5, state: "unanswered", title: "Have you taken this exam before?", type: "single", field: "previousAttempts" },
    { id: 6, state: "unanswered", title: "When's your target exam date?", type: "single", field: "examTimeline", helpText: "💡 Don't worry if you haven't scheduled yet - you can adjust this anytime\n💡 Most CISSP candidates study for 2-4 months" },
    { id: 7, state: "unanswered", title: "How much time can you commit weekly?", subtitle: "Consider your current schedule, work, and other commitments.", type: "single", field: "weeklyHours", helpText: "💡 Even 3 hours a week is enough — our AI will adapt to your schedule.\n💡 Studies show consistent, smaller sessions lead to better retention than cramming." },
    { id: 8, state: "unanswered", title: "Final question! You're almost there...", subtitle: "When do you prefer to study?", type: "single", field: "studyTimes", helpText: "💡 This helps us send you study reminders at the right time" },
    { id: 9, state: "unanswered", title: "Here's Your Personalized Study Plan 🚀", type: "summary" }
  ]);

  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [encouragingText, setEncouragingText] = useState<string>("");
  const [showEncouraging, setShowEncouraging] = useState(false);
  const [showConfirmationPanel, setShowConfirmationPanel] = useState(false);
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const domains = formData.certification 
    ? (domainsByExam[formData.certification] || domainsByExam.default)
    : domainsByExam.default;

  const activeQuestionId = questions.find(q => q.state === "active")?.id || 0;
  const totalQuestions = 8;
  const answeredCount = questions.filter(q => q.state === "answered").length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  const scrollToQuestion = (questionId: number) => {
    const questionElement = questionRefs.current[questionId];
    if (questionElement) {
      const rect = questionElement.getBoundingClientRect();
      const offset = window.pageYOffset + rect.top - 180; // Account for sticky header and progress bar
      
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  const getEncouragingText = (questionId: number, value: any): string => {
    const questionKey = `q${questionId}`;
    const textMap: Record<number, string> = {
      1: "q1_certification",
      2: "q2_knowledge",
      3: "q3_learning",
      4: "q4_structure",
      5: "q5_attempts",
      6: "q6_timeline",
      7: "q7_hours",
      8: "q8_timing"
    };
    
    const key = textMap[questionId];
    if (key && ENCOURAGING_TEXT[key] && ENCOURAGING_TEXT[key][value]) {
      return ENCOURAGING_TEXT[key][value];
    }
    return "";
  };

  const handleAnswer = (questionId: number, value: any) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    // Step 1: Instantly show selected state and encouraging text (0ms)
    setSelectedValue(value);
    const encouragement = getEncouragingText(questionId, value);
    if (encouragement) {
      setEncouragingText(encouragement);
      setShowEncouraging(true);
    }

    // Step 2: Hold for 600ms, then update sidebar & progress bar
    setTimeout(() => {
      if (question.field) {
        setFormData(prev => ({
          ...prev,
          [question.field!]: value
        }));
      }

      // Step 3: After 300ms more, transition to next question or show confirmation
      setTimeout(() => {
        setQuestions(prev => prev.map(q => {
          if (q.id === questionId) return { ...q, state: "answered" as QuestionState };
          // Don't auto-activate Q9 if we're on Q8 - show confirmation panel instead
          if (questionId !== 8 && q.id === questionId + 1) return { ...q, state: "active" as QuestionState };
          return q;
        }));

        // Clear selected value and hide encouraging text
        setSelectedValue(null);
        setShowEncouraging(false);
        setEncouragingText("");
        
        // If this was Q8, show confirmation panel instead of scrolling to next
        if (questionId === 8) {
          setTimeout(() => setShowConfirmationPanel(true), 100);
        } else {
          setTimeout(() => scrollToQuestion(questionId + 1), 100);
        }
      }, 300);
    }, 600);
  };

  const handleEdit = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    
    // Hide confirmation panel if it's showing
    setShowConfirmationPanel(false);
    
    // Clear the previous answer from formData when editing
    if (question?.field) {
      setFormData(prev => ({
        ...prev,
        [question.field!]: Array.isArray(prev[question.field!]) ? [] : ""
      }));
    }
    
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) return { ...q, state: "active" as QuestionState };
      if (q.state === "active") return { ...q, state: "answered" as QuestionState };
      return q;
    }));

    setTimeout(() => scrollToQuestion(questionId), 100);
  };

  const handleGeneratePlan = () => {
    // Hide confirmation panel
    setShowConfirmationPanel(false);
    
    // Activate the summary question (Q9)
    setQuestions(prev => prev.map(q => {
      if (q.id === 9) return { ...q, state: "active" as QuestionState };
      return q;
    }));
    
    // Scroll to summary
    setTimeout(() => scrollToQuestion(9), 100);
  };

  const handleReviewAnswers = () => {
    // Hide confirmation panel
    setShowConfirmationPanel(false);
    
    // Find the first answered question (skip welcome question 0)
    const firstAnsweredQuestion = questions.find(q => q.id > 0 && q.state === "answered");
    
    if (firstAnsweredQuestion) {
      // Reactivate the first answered question for editing
      setQuestions(prev => prev.map(q => {
        if (q.id === firstAnsweredQuestion.id) return { ...q, state: "active" as QuestionState };
        return q;
      }));
      
      // Scroll to that question
      setTimeout(() => scrollToQuestion(firstAnsweredQuestion.id), 100);
    } else {
      // If no answered questions found, just scroll to welcome
      setTimeout(() => scrollToQuestion(0), 100);
    }
  };

  const handleToggle = (field: "focusAreas" | "failedDomains", value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const getSummaryItems = () => {
    const items = [];
    if (formData.certification) items.push({ icon: CheckCircle2, label: formData.certification });
    if (formData.knowledgeLevel) {
      const level = knowledgeLevels.find(k => k.value === formData.knowledgeLevel);
      if (level) items.push({ icon: CheckCircle2, label: level.label.split(' - ')[0] });
    }
    if (formData.learningStyle) {
      const style = learningStyles.find(s => s.value === formData.learningStyle);
      if (style) items.push({ icon: style.icon, label: style.label.split(' ')[0] + " style" });
    }
    if (formData.studyStructure === "ai-guided") {
      items.push({ icon: Sparkles, label: "AI-guided" });
    } else if (formData.focusAreas.length > 0) {
      items.push({ icon: CheckCircle2, label: `${formData.focusAreas.length} focus areas` });
    }
    if (formData.examDate) {
      items.push({ icon: Calendar, label: `Exam: ${new Date(formData.examDate).toLocaleDateString()}` });
    } else if (formData.examTimeline) {
      const timeline = examTimelines.find(t => t.value === formData.examTimeline);
      if (timeline) items.push({ icon: Calendar, label: timeline.label });
    }
    if (formData.weeklyHours) {
      items.push({ icon: Clock, label: formData.weeklyHours + " hrs/week" });
    }
    return items;
  };

  const getEstimatedWeeks = () => {
    if (formData.weeklyHours === "1-3") return "15-20 weeks";
    if (formData.weeklyHours === "3-5") return "10-15 weeks";
    if (formData.weeklyHours === "6-10") return "6-10 weeks";
    if (formData.weeklyHours === "10+") return "4-6 weeks";
    return "12 weeks";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      {/* Sticky Progress Bar */}
      <div className="sticky top-[72px] z-20 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={progressPercentage} className="h-2" data-testid="progress-bar" />
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap" data-testid="text-progress">
              {answeredCount} of {totalQuestions}
            </div>
          </div>
        </div>
      </div>

      <main className="relative flex-1 px-4 py-8 md:py-12">
        {/* Sticky Summary Card - Desktop Only */}
        <AnimatePresence>
          {activeQuestionId > 0 && activeQuestionId < 9 && getSummaryItems().length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden lg:block fixed right-8 top-[200px] w-72 z-10"
            >
              <Card className="p-5 shadow-xl border-2 border-primary/20 bg-card/95 backdrop-blur">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Your Plan So Far</h3>
                </div>
                <div className="space-y-3">
                  {getSummaryItems().map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                  {formData.weeklyHours && (
                    <div className="flex items-start gap-3 pt-3 border-t">
                      <Clock className="h-4 w-4 text-primary mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium">{getEstimatedWeeks()}</div>
                        <div className="text-xs text-muted-foreground">to exam ready</div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div 
          ref={containerRef}
          className="max-w-3xl mx-auto space-y-6"
        >
          {questions.map((question) => (
              <motion.div
                key={question.id}
                ref={(el) => (questionRefs.current[question.id] = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: question.state === "unanswered" ? 0 : 1,
                  y: question.state === "unanswered" ? 20 : 0,
                  scale: question.state === "answered" ? 0.98 : 1
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className={`
                  ${question.state === "unanswered" ? "hidden" : "block"}
                  ${question.state === "answered" ? "opacity-70" : "opacity-100"}
                `}
                data-testid={`question-${question.id}`}
              >
                <Card 
                  className={`
                    relative overflow-hidden transition-all duration-300
                    ${question.state === "active" ? "shadow-2xl border-2 border-primary/40 ring-4 ring-primary/10" : "shadow-md border-border"}
                    ${question.state === "answered" ? "cursor-pointer hover:shadow-xl hover:border-2 hover:border-primary/60 hover:ring-2 hover:ring-primary/20" : ""}
                  `}
                  onClick={() => question.state === "answered" && handleEdit(question.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                  
                  <div className="relative p-6 md:p-8">
                    {/* Question Header */}
                    <div className="mb-6">
                      {question.state === "answered" && (
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm text-primary font-medium">
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
                        <p className="text-muted-foreground mt-2">{question.subtitle}</p>
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
                          {/* Welcome Screen */}
                          {question.id === 0 && (
                            <div className="space-y-6">
                              <div className="space-y-4 text-center md:text-left">
                                <p className="text-lg text-muted-foreground">
                                  We'll ask you <span className="font-semibold text-foreground">8 quick questions</span> (takes 2 minutes) to create a personalized study plan just for you.
                                </p>
                                
                                <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 space-y-3">
                                  <p className="font-semibold text-foreground mb-3">Your answers help us:</p>
                                  <div className="space-y-2.5">
                                    <div className="flex items-start gap-3">
                                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                      <span className="text-foreground">Match content to your experience level</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                      <span className="text-foreground">Optimize your study schedule</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                      <span className="text-foreground">Focus on areas that matter most</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-medium">Takes less than 2 minutes</span>
                                  </div>
                                  <div className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                                    <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>Once you answer a question, the next question opens automatically.</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-center pt-2">
                                <Button
                                  size="lg"
                                  onClick={() => handleAnswer(question.id, "started")}
                                  className="rounded-full text-base px-8 h-14 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                                  data-testid="button-start-plan"
                                >
                                  <Rocket className="h-5 w-5 mr-2" />
                                  Start Building My Plan
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Question 1: Certification */}
                          {question.id === 1 && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {certifications.map((cert) => (
                                  <button
                                    key={cert.value}
                                    onClick={() => handleAnswer(question.id, cert.value)}
                                    className={`p-4 rounded-lg border-2 text-left transition-all font-medium ${
                                      selectedValue === cert.value
                                        ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                                    }`}
                                    data-testid={`button-cert-${cert.value.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{cert.label}</span>
                                      {selectedValue === cert.value && <CheckCircle2 className="h-5 w-5 ml-2" />}
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <AnimatePresence>
                                {showEncouraging && selectedValue && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg p-3"
                                    data-testid="text-encouraging"
                                  >
                                    {encouragingText}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <div className="text-sm text-muted-foreground pt-2">
                                {HELPER_TEXT.q1}
                              </div>
                            </div>
                          )}

                          {/* Question 2: Knowledge Level */}
                          {question.id === 2 && (
                            <div className="space-y-4">
                              <div className="space-y-3">
                                {knowledgeLevels.map((level) => (
                                  <button
                                    key={level.value}
                                    onClick={() => handleAnswer(question.id, level.value)}
                                    className={`w-full p-5 rounded-lg border-2 text-left transition-all group ${
                                      selectedValue === level.value
                                        ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                                    }`}
                                    data-testid={`button-level-${level.value}`}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="font-medium text-base">{level.label}</div>
                                      {selectedValue === level.value && <CheckCircle2 className="h-5 w-5" />}
                                    </div>
                                    <div className={`text-sm italic ${
                                      selectedValue === level.value
                                        ? "text-primary-foreground/90"
                                        : "text-muted-foreground group-hover:text-primary/80"
                                    } transition-colors`}>
                                      "{level.description}"
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <AnimatePresence>
                                {showEncouraging && selectedValue && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg p-3"
                                    data-testid="text-encouraging"
                                  >
                                    {encouragingText}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <div className="text-sm text-muted-foreground pt-2">
                                {HELPER_TEXT.q2}
                              </div>
                            </div>
                          )}

                          {/* Question 3: Learning Style */}
                          {question.id === 3 && (
                            <div className="space-y-4">
                              <div className="space-y-3">
                                {learningStyles.map((style) => {
                                  const Icon = style.icon;
                                  return (
                                    <button
                                      key={style.value}
                                      onClick={() => handleAnswer(question.id, style.value)}
                                      className={`w-full p-5 rounded-lg border-2 text-left transition-all group ${
                                        selectedValue === style.value
                                          ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                                          : "border-border hover:border-primary/50 hover:bg-primary/5"
                                      }`}
                                      data-testid={`button-style-${style.value}`}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-3">
                                          <Icon className={`h-5 w-5 ${selectedValue === style.value ? "text-primary-foreground" : "text-primary"}`} />
                                          <div className="font-medium text-base">{style.label}</div>
                                        </div>
                                        {selectedValue === style.value && <CheckCircle2 className="h-5 w-5" />}
                                      </div>
                                      <div className={`text-sm italic ml-8 ${
                                        selectedValue === style.value
                                          ? "text-primary-foreground/90"
                                          : "text-muted-foreground group-hover:text-primary/80"
                                      } transition-colors`}>
                                        "{style.description}"
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                              <AnimatePresence>
                                {showEncouraging && selectedValue && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg p-3"
                                    data-testid="text-encouraging"
                                  >
                                    {encouragingText}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <div className="text-sm text-muted-foreground pt-2">
                                {HELPER_TEXT.q3}
                              </div>
                            </div>
                          )}

                          {/* Question 4: Study Structure */}
                          {question.id === 4 && (
                            <div className="space-y-4">
                              {studyStructures.map((structure) => (
                                <button
                                  key={structure.value}
                                  onClick={() => {
                                    if (structure.value === "ai-guided") {
                                      setFormData(prev => ({ ...prev, focusAreas: [], studyStructure: structure.value }));
                                      handleAnswer(question.id, structure.value);
                                    } else {
                                      setFormData(prev => ({ ...prev, studyStructure: structure.value, focusAreas: [] }));
                                    }
                                  }}
                                  className={`w-full p-5 rounded-lg border-2 text-left transition-all group ${
                                    selectedValue === structure.value
                                      ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                                  }`}
                                  data-testid={`button-structure-${structure.value}`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="font-medium text-base">{structure.label}</div>
                                    {selectedValue === structure.value && <CheckCircle2 className="h-5 w-5" />}
                                  </div>
                                  <div className={`text-sm italic ${
                                    selectedValue === structure.value
                                      ? "text-primary-foreground/90"
                                      : "text-muted-foreground group-hover:text-primary/80"
                                  } transition-colors`}>
                                    "{structure.description}"
                                  </div>
                                </button>
                              ))}

                              <AnimatePresence>
                                {showEncouraging && selectedValue && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg p-3"
                                    data-testid="text-encouraging"
                                  >
                                    {encouragingText}
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Domain Selection - Conditional */}
                              {formData.studyStructure === "manual" && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  transition={{ duration: 0.3 }}
                                  className="pt-4 border-t space-y-3"
                                >
                                  <h3 className="font-semibold text-base">Select areas you want to focus on:</h3>
                                  {domains.map((domain) => {
                                    const domainId = `focus-${domain.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                                    return (
                                      <div
                                        key={domain.name}
                                        className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                                          formData.focusAreas.includes(domain.name)
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:bg-accent"
                                        }`}
                                      >
                                        <Checkbox
                                          checked={formData.focusAreas.includes(domain.name)}
                                          onCheckedChange={() => handleToggle("focusAreas", domain.name)}
                                          id={domainId}
                                          data-testid={`checkbox-${domainId}`}
                                        />
                                        <Label htmlFor={domainId} className="flex-1 cursor-pointer">
                                          <div className="font-medium">{domain.name}</div>
                                          <div className="text-sm text-muted-foreground">{domain.description}</div>
                                        </Label>
                                      </div>
                                    );
                                  })}
                                  
                                  {formData.certification === "CISSP®" && formData.focusAreas.length === 0 && (
                                    <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                                      <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                      <p className="text-sm text-muted-foreground">
                                        <strong>New to CISSP?</strong> We recommend letting AI create your plan. It will assess your knowledge and prioritize the most important topics first.
                                      </p>
                                    </div>
                                  )}

                                  {formData.focusAreas.length > 0 && (
                                    <Button
                                      onClick={() => handleAnswer(question.id, formData.studyStructure)}
                                      className="w-full rounded-full mt-4"
                                      data-testid="button-continue-focus"
                                    >
                                      Continue with {formData.focusAreas.length} area{formData.focusAreas.length > 1 ? 's' : ''}
                                    </Button>
                                  )}
                                </motion.div>
                              )}
                              
                              <div className="text-sm text-muted-foreground pt-2">
                                {HELPER_TEXT.q4}
                              </div>
                            </div>
                          )}

                          {/* Question 5: Previous Attempts */}
                          {question.id === 5 && (
                            <div className="space-y-4">
                              {previousAttempts.map((attempt) => (
                                <button
                                  key={attempt.value}
                                  onClick={() => {
                                    if (attempt.value !== "retaking") {
                                      setFormData(prev => ({ ...prev, failedDomains: [] }));
                                      handleAnswer(question.id, attempt.value);
                                    } else {
                                      setFormData(prev => ({ ...prev, previousAttempts: attempt.value }));
                                    }
                                  }}
                                  className={`w-full p-5 rounded-lg border-2 text-left transition-all group ${
                                    selectedValue === attempt.value
                                      ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                                  }`}
                                  data-testid={`button-attempt-${attempt.value}`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="font-medium text-base">{attempt.label}</div>
                                    {selectedValue === attempt.value && <CheckCircle2 className="h-5 w-5" />}
                                  </div>
                                  <div className={`text-sm italic ${
                                    selectedValue === attempt.value
                                      ? "text-primary-foreground/90"
                                      : "text-muted-foreground group-hover:text-primary/80"
                                  } transition-colors`}>
                                    "{attempt.description}"
                                  </div>
                                </button>
                              ))}

                              <AnimatePresence>
                                {showEncouraging && selectedValue && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg p-3"
                                    data-testid="text-encouraging"
                                  >
                                    {encouragingText}
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Failed Domains - Conditional */}
                              {formData.previousAttempts === "retaking" && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  transition={{ duration: 0.3 }}
                                  className="pt-4 border-t space-y-3"
                                >
                                  <h3 className="font-semibold text-base">Which areas did you struggle with most?</h3>
                                  {domains.map((domain) => {
                                    const domainId = `failed-${domain.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                                    return (
                                      <div
                                        key={domain.name}
                                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                          formData.failedDomains.includes(domain.name)
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:bg-accent"
                                        }`}
                                      >
                                        <Checkbox
                                          checked={formData.failedDomains.includes(domain.name)}
                                          onCheckedChange={() => handleToggle("failedDomains", domain.name)}
                                          id={domainId}
                                          data-testid={`checkbox-${domainId}`}
                                        />
                                        <Label htmlFor={domainId} className="flex-1 cursor-pointer font-medium">
                                          {domain.name}
                                        </Label>
                                      </div>
                                    );
                                  })}
                                  
                                  <div className="flex items-start gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                    <Sparkles className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Don't worry</strong> - we'll turn these into your strongest areas
                                    </p>
                                  </div>

                                  {formData.failedDomains.length > 0 && (
                                    <Button
                                      onClick={() => handleAnswer(question.id, formData.previousAttempts)}
                                      className="w-full rounded-full mt-4"
                                      data-testid="button-continue-failed"
                                    >
                                      Continue
                                    </Button>
                                  )}
                                </motion.div>
                              )}
                              
                              <div className="text-sm text-muted-foreground pt-2">
                                {HELPER_TEXT.q5}
                              </div>
                            </div>
                          )}

                          {/* Question 6: Exam Timeline */}
                          {question.id === 6 && (
                            <div className="space-y-4">
                              {examTimelines.map((timeline) => (
                                <div key={timeline.value}>
                                  <button
                                    onClick={() => {
                                      if (!timeline.showDatePicker) {
                                        handleAnswer(question.id, timeline.value);
                                      } else {
                                        setFormData(prev => ({ ...prev, examTimeline: timeline.value }));
                                      }
                                    }}
                                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                                      selectedValue === timeline.value
                                        ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                                    }`}
                                    data-testid={`button-timeline-${timeline.value}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="font-medium text-base">{timeline.label}</div>
                                        <div className={`text-sm mt-1 ${
                                          selectedValue === timeline.value ? "text-primary-foreground/90" : "text-muted-foreground"
                                        }`}>{timeline.sublabel}</div>
                                      </div>
                                      {selectedValue === timeline.value && <CheckCircle2 className="h-5 w-5" />}
                                    </div>
                                  </button>
                                  
                                  {timeline.showDatePicker && formData.examTimeline === "scheduled" && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      transition={{ duration: 0.3 }}
                                      className="mt-3 p-4 bg-accent/50 rounded-lg space-y-3"
                                    >
                                      <Label htmlFor="exam-date" className="text-sm font-medium">When is your exam?</Label>
                                      <Input
                                        id="exam-date"
                                        type="date"
                                        value={formData.examDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
                                        className="w-full"
                                        data-testid="input-exam-date"
                                      />
                                      {formData.examDate && (
                                        <Button
                                          onClick={() => handleAnswer(question.id, formData.examTimeline)}
                                          className="w-full rounded-full"
                                          data-testid="button-confirm-date"
                                        >
                                          Continue
                                        </Button>
                                      )}
                                    </motion.div>
                                  )}
                                </div>
                              ))}
                              
                              <AnimatePresence>
                                {showEncouraging && selectedValue && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg p-3"
                                    data-testid="text-encouraging"
                                  >
                                    {encouragingText}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              <div className="text-sm text-muted-foreground pt-2">
                                {HELPER_TEXT.q6}
                              </div>
                            </div>
                          )}

                          {/* Question 7: Weekly Hours */}
                          {question.id === 7 && (
                            <div className="space-y-3">
                              {weeklyHours.map((hours) => (
                                <button
                                  key={hours.value}
                                  onClick={() => handleAnswer(question.id, hours.value)}
                                  className={`w-full p-4 rounded-lg border-2 text-left transition-all group ${
                                    selectedValue === hours.value
                                      ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                                  }`}
                                  data-testid={`button-hours-${hours.value}`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="font-medium text-base">{hours.label}</div>
                                    {selectedValue === hours.value && <CheckCircle2 className="h-5 w-5" />}
                                  </div>
                                  <div className={`text-sm ${
                                    selectedValue === hours.value
                                      ? "text-primary-foreground/90"
                                      : "text-muted-foreground group-hover:text-primary/80"
                                  }`}>
                                    {hours.estimate}
                                  </div>
                                </button>
                              ))}
                              
                              <AnimatePresence>
                                {showEncouraging && selectedValue && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg p-3"
                                    data-testid="text-encouraging"
                                  >
                                    {encouragingText}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              <div className="text-sm text-muted-foreground pt-2">
                                {HELPER_TEXT.q7}
                              </div>
                            </div>
                          )}

                          {/* Question 8: Study Timing */}
                          {question.id === 8 && (
                            <div className="space-y-3">
                              {studyTimings.map((timing) => (
                                <button
                                  key={timing.value}
                                  onClick={() => handleAnswer(question.id, timing.value)}
                                  className={`w-full p-5 rounded-lg border-2 text-left transition-all group ${
                                    selectedValue === timing.value
                                      ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                                  }`}
                                  data-testid={`button-timing-${timing.value}`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="font-medium text-base">{timing.label}</div>
                                    {selectedValue === timing.value && <CheckCircle2 className="h-5 w-5" />}
                                  </div>
                                  <div className={`text-sm ${
                                    selectedValue === timing.value
                                      ? "text-primary-foreground/90"
                                      : "text-muted-foreground group-hover:text-primary/80"
                                  } transition-colors`}>
                                    {timing.description}
                                  </div>
                                </button>
                              ))}
                              
                              <AnimatePresence>
                                {showEncouraging && selectedValue && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg p-3"
                                    data-testid="text-encouraging"
                                  >
                                    {encouragingText}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              <div className="text-sm text-muted-foreground pt-2">
                                {HELPER_TEXT.q8}
                              </div>
                            </div>
                          )}

                          {/* Question 9: Summary */}
                          {question.id === 9 && (
                            <div className="text-center space-y-6">
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
                                    <p><strong>Target:</strong> Exam ready in {getEstimatedWeeks()}</p>
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
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Answered State - Show selected value */}
                      {question.state === "answered" && question.field && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="py-2"
                        >
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">
                              {(() => {
                                const field = question.field;
                                const value = formData[field];
                                
                                if (field === "certification") return value;
                                if (field === "knowledgeLevel") return knowledgeLevels.find(k => k.value === value)?.label.split(' - ')[0];
                                if (field === "learningStyle") return learningStyles.find(s => s.value === value)?.label;
                                if (field === "studyStructure") return value === "ai-guided" ? "AI-guided plan" : `Manual (${formData.focusAreas.length} areas)`;
                                if (field === "previousAttempts") return previousAttempts.find(p => p.value === value)?.label;
                                if (field === "examTimeline") {
                                  const timeline = examTimelines.find(t => t.value === value);
                                  return formData.examDate ? `Scheduled: ${formData.examDate}` : timeline?.label;
                                }
                                if (field === "weeklyHours") return weeklyHours.find(h => h.value === value)?.label;
                                if (field === "studyTimes") return studyTimings.find(t => t.value === value)?.label;
                                return String(value);
                              })()}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            ))}

          {/* Confirmation Panel - Shows after Q8 */}
          <AnimatePresence>
            {showConfirmationPanel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="mt-8"
                data-testid="confirmation-panel"
              >
                <Card className="relative overflow-hidden shadow-2xl border-2 border-primary/40">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
                  
                  <div className="relative p-8 md:p-12 text-center space-y-6">
                    {/* Heading */}
                    <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-confirmation-heading">
                      🎉 Great job!
                    </h2>
                    
                    {/* Subheading */}
                    <p className="text-xl md:text-2xl font-medium text-muted-foreground" data-testid="text-confirmation-subheading">
                      You've completed the diagnostic
                    </p>
                    
                    {/* Body text */}
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-confirmation-body">
                      ✨ Next, we'll analyze your profile and build a personalized study plan optimized for your goals.
                    </p>
                    
                    {/* Timing indicator */}
                    <p className="text-sm text-muted-foreground/80" data-testid="text-confirmation-timing">
                      This takes about 15 seconds
                    </p>
                    
                    {/* Primary button */}
                    <div className="pt-4">
                      <Button
                        size="lg"
                        onClick={handleGeneratePlan}
                        className="rounded-full text-base px-10 h-14 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                        data-testid="button-generate-plan"
                      >
                        Generate My Plan →
                      </Button>
                    </div>
                    
                    {/* Secondary link */}
                    <button
                      onClick={handleReviewAnswers}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
                      data-testid="link-review-answers"
                    >
                      or review your answers
                    </button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
