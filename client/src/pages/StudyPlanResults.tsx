import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Calendar, Clock, Target, CheckCircle2, Lightbulb, AlertCircle, ChevronRight, Rocket } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Topic {
  name: string;
  keyPoints: string[];
  estimatedTime: number;
}

interface DailySchedule {
  day: string;
  time: string;
  activity: string;
  type: string;
  duration: number;
}

interface Week {
  weekNumber: number;
  domain: string;
  domainId: string;
  theme: string;
  priority: "critical" | "high" | "medium" | "low";
  topics: Topic[];
  dailySchedule: DailySchedule[];
  learningObjectives: string[];
  examTips: string[];
  selfAssessment: string[];
  totalTime: number;
}

interface StudyPlan {
  certification: string;
  knowledgeLevel: string;
  totalWeeks: number;
  weeklyHours: string;
  personalization: {
    weakAreas: string[];
    focusStrategy: string;
  };
  weeks: Week[];
}

interface StudyPlanResponse {
  success: boolean;
  certification: string;
  planObject: StudyPlan;
}

const priorityColors = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500"
};

const priorityLabels = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low"
};

export default function StudyPlanResults() {
  const [, setLocation] = useLocation();
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const initializeProgressMutation = useMutation({
    mutationFn: async (totalWeeks: number) => {
      const response = await fetch('/api/progress/initialize', {
        method: 'POST',
        body: JSON.stringify({ userId: 'demo-user', totalWeeks }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to initialize progress');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Study Plan Started!",
        description: "Your progress is being tracked. Good luck!",
      });
      setLocation('/dashboard/all-weeks');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start study plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Get the plan data from location state or localStorage
  const planData: StudyPlanResponse | null = (() => {
    try {
      const stored = localStorage.getItem('studyPlanData');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error parsing study plan data from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('studyPlanData');
    }
    return null;
  })();

  // Monitor loading state and data availability
  useEffect(() => {
    // If we have successful data with planObject, stop loading immediately
    if (planData && planData.success && planData.planObject) {
      setIsLoading(false);
      return;
    }
    
    // Set a timeout to stop showing loading state after 5 minutes (matching cloud function timeout)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300000); // 5 minutes = 300000ms
    
    return () => clearTimeout(timer);
  }, [planData]);

  // Show loading state while waiting for cloud function
  if (isLoading && planData && planData.success && !planData.planObject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Generating Your Study Plan...</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our AI is creating a personalized study plan for you. This may take a moment.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state if data is missing or invalid
  if (!planData || !planData.success || !planData.planObject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Study Plan Generation Failed
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We had trouble creating a study plan for you at this time, please try again.
          </p>
          <Button onClick={() => setLocation('/diagnostic')} data-testid="button-try-again">
            Try Again
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const plan = planData.planObject;
  const currentWeek = plan.weeks.find(w => w.weekNumber === selectedWeek);

  // Calculate progress phases
  const getPhaseRanges = () => {
    const totalWeeks = plan.totalWeeks;
    const foundationEnd = Math.ceil(totalWeeks * 0.2);
    const coreEnd = Math.ceil(totalWeeks * 0.5);
    const advancedEnd = Math.ceil(totalWeeks * 0.8);
    const practiceEnd = totalWeeks >= advancedEnd + 3 ? totalWeeks - 2 : totalWeeks;
    
    return {
      foundation: { start: 1, end: foundationEnd, label: "Foundation Building" },
      core: { start: foundationEnd + 1, end: coreEnd, label: "Core Concepts" },
      advanced: { start: coreEnd + 1, end: advancedEnd, label: "Advanced Topics" },
      practice: { start: advancedEnd + 1, end: practiceEnd, label: "Practice & Review" },
      final: totalWeeks >= advancedEnd + 3 ? { start: practiceEnd + 1, end: totalWeeks, label: "Final Prep" } : null
    };
  };

  const phases = getPhaseRanges();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3" data-testid="text-plan-title">
            Your Personalized{" "}
            <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
              {plan.certification} Study Plan
            </span>{" "}
            <span className="text-5xl">🎯</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {plan.totalWeeks}-Week Journey | {plan.weeklyHours} hours/week
          </p>
          <Button
            onClick={() => initializeProgressMutation.mutate(plan.totalWeeks)}
            disabled={initializeProgressMutation.isPending}
            size="lg"
            className="bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90"
            data-testid="button-start-study-plan"
          >
            <Rocket className="w-5 h-5 mr-2" />
            {initializeProgressMutation.isPending ? "Starting..." : "Start Your Study Plan"}
          </Button>
        </div>

        {/* Plan Overview */}
        <Card className="p-6 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Timeline</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300" data-testid="text-total-weeks">{plan.totalWeeks} weeks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Weekly Commitment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300" data-testid="text-weekly-hours">{plan.weeklyHours} hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Level</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 capitalize" data-testid="text-knowledge-level">{plan.knowledgeLevel}</p>
              </div>
            </div>
          </div>

          {/* Personalization Strategy */}
          <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 border border-primary/20">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Your Personalized Strategy
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300" data-testid="text-focus-strategy">
              {plan.personalization.focusStrategy}
            </p>
            {plan.personalization.weakAreas.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Focus Areas:</p>
                <div className="flex flex-wrap gap-2">
                  {plan.personalization.weakAreas.map((area, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full" data-testid={`tag-weak-area-${index}`}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Timeline Phases */}
        <Card className="p-6 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Study Timeline</h2>
          <div className="space-y-3">
            {Object.entries(phases).map(([key, phase]) => {
              if (!phase) return null;
              const progress = ((phase.end - phase.start + 1) / plan.totalWeeks) * 100;
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300" data-testid={`text-phase-${key}`}>
                      Week {phase.start}-{phase.end}: {phase.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {phase.end - phase.start + 1} weeks
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Weekly Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Week List */}
          <Card className="p-4 lg:col-span-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm max-h-[800px] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-gray-800 pb-2">
              Weeks
            </h2>
            <div className="space-y-2">
              {plan.weeks.map((week) => (
                <button
                  key={week.weekNumber}
                  onClick={() => setSelectedWeek(week.weekNumber)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedWeek === week.weekNumber
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                  data-testid={`button-week-${week.weekNumber}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Week {week.weekNumber}</div>
                      <div className={`text-xs mt-1 line-clamp-2 ${
                        selectedWeek === week.weekNumber ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {week.theme}
                      </div>
                    </div>
                    <div className="ml-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${priorityColors[week.priority]}`} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Week Details */}
          <Card className="p-6 lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm max-h-[800px] overflow-y-auto">
            {currentWeek && (
              <div>
                {/* Week Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-current-week-number">
                      Week {currentWeek.weekNumber}
                    </h2>
                    <span className={`px-3 py-1 text-xs font-medium text-white rounded-full ${priorityColors[currentWeek.priority]}`}>
                      {priorityLabels[currentWeek.priority]}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2" data-testid="text-current-week-theme">
                    {currentWeek.theme}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400" data-testid="text-current-week-domain">
                    {currentWeek.domain} • {currentWeek.totalTime} minutes total
                  </p>
                </div>

                {/* Tabs for different sections */}
                <Tabs defaultValue="topics" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="topics" data-testid="tab-topics">Topics</TabsTrigger>
                    <TabsTrigger value="schedule" data-testid="tab-schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="objectives" data-testid="tab-objectives">Goals</TabsTrigger>
                    <TabsTrigger value="tips" data-testid="tab-tips">Tips</TabsTrigger>
                  </TabsList>

                  {/* Topics Tab */}
                  <TabsContent value="topics" className="space-y-4">
                    {currentWeek.topics.map((topic, index) => (
                      <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50" data-testid={`card-topic-${index}`}>
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white flex-1">
                            {topic.name}
                          </h4>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded ml-2">
                            {topic.estimatedTime}m
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {topic.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </TabsContent>

                  {/* Schedule Tab */}
                  <TabsContent value="schedule" className="space-y-3">
                    {currentWeek.dailySchedule.map((schedule, index) => (
                      <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50" data-testid={`card-schedule-${index}`}>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{schedule.day}</h4>
                              {schedule.duration > 0 && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {schedule.duration}m
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{schedule.time}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{schedule.activity}</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-gray-200 dark:bg-gray-600 text-xs rounded capitalize">
                              {schedule.type}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  {/* Objectives Tab */}
                  <TabsContent value="objectives" className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Learning Objectives
                      </h4>
                      <ul className="space-y-2">
                        {currentWeek.learningObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300" data-testid={`text-objective-${index}`}>
                            <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        Self-Assessment Checklist
                      </h4>
                      <ul className="space-y-2">
                        {currentWeek.selfAssessment.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300" data-testid={`text-assessment-${index}`}>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Tips Tab */}
                  <TabsContent value="tips" className="space-y-3">
                    {currentWeek.examTips.map((tip, index) => (
                      <Card key={index} className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20" data-testid={`card-tip-${index}`}>
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" onClick={() => setLocation('/diagnostic')} data-testid="button-retake-diagnostic">
            Retake Diagnostic
          </Button>
          <Button 
            onClick={() => setLocation('/')} 
            className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            data-testid="button-start-week-1"
          >
            Start Week 1
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
