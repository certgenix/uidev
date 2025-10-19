import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle2, Lock, Clock, AlertCircle, ArrowLeft, Target, BookOpen } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface DayProgress {
  id: string;
  dayIndex: number;
  dayName: string;
  status: string;
  completedAt: Date | null;
  unlockedAt: Date | null;
  timeSpent: number;
}

interface WeekProgressWithDays {
  id: string;
  weekNumber: number;
  status: string;
  startedAt: Date | null;
  completedAt: Date | null;
  completedTopics: number;
  totalTopics: number;
  timeSpent: number;
  days: DayProgress[];
}

interface DailySchedule {
  day: string;
  time: string;
  activity: string;
  type: string;
  duration: number;
}

interface Topic {
  name: string;
  estimatedTime: number;
  keyPoints: string[];
}

interface WeekData {
  weekNumber: number;
  domain: string;
  theme: string;
  priority: string;
  topics: Topic[];
  dailySchedule: DailySchedule[];
  learningObjectives: string[];
  examTips: string[];
  selfAssessment: string[];
  totalTime: number;
}

export default function WeeklyDashboard() {
  const [, params] = useRoute("/dashboard/week/:weekNumber");
  const [, setLocation] = useLocation();
  
  const weekNumber = parseInt(params?.weekNumber || "1");

  const { data: weekProgress, isLoading } = useQuery<WeekProgressWithDays[]>({
    queryKey: ["/api/progress/weeks", weekNumber],
    queryFn: async () => {
      const response = await fetch(`/api/progress/weeks?weekNumber=${weekNumber}`);
      if (!response.ok) throw new Error('Failed to fetch week progress');
      return response.json();
    },
  });

  const studyPlan = (() => {
    try {
      const stored = localStorage.getItem('studyPlanData');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error parsing study plan data:', error);
    }
    return { success: false, planObject: null };
  })();

  const plan = studyPlan?.planObject;
  const weekData: WeekData | undefined = plan?.weeks.find((w: any) => w.weekNumber === weekNumber);
  const currentWeekProgress = weekProgress?.[0];

  if (!plan || !weekData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Week Not Found</h1>
          <Button onClick={() => setLocation('/dashboard/all-weeks')} data-testid="button-back-all-weeks">
            Back to All Weeks
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const completedDays = currentWeekProgress?.days.filter(d => d.status === "completed").length || 0;
  const weekProgressPct = currentWeekProgress?.days.length ? Math.round((completedDays / 7) * 100) : 0;
  const currentDay = currentWeekProgress?.days.find(d => d.status === "available");

  const getDayStatus = (dayIndex: number) => {
    if (!currentWeekProgress) return "locked";
    const day = currentWeekProgress.days.find(d => d.dayIndex === dayIndex);
    return day?.status || "locked";
  };

  const getDayName = (dayIndex: number) => {
    if (!currentWeekProgress) return "";
    const day = currentWeekProgress.days.find(d => d.dayIndex === dayIndex);
    return day?.dayName || "";
  };

  const getDayIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case "available":
        return <Calendar className="w-6 h-6 text-primary" />;
      default:
        return <Lock className="w-6 h-6 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/dashboard/all-weeks')}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Weeks
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-page-title">
            Week {weekNumber}: {weekData.theme}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {weekData.domain}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Week Progress</span>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-week-progress">
              {weekProgressPct}%
            </div>
            <Progress value={weekProgressPct} className="h-2" />
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Days Complete</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-days-complete">
              {completedDays} / 7
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Time Spent</span>
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-time-spent">
              {Math.round((currentWeekProgress?.timeSpent || 0) / 60)}h
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Topics</span>
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-topics">
              {weekData.topics.length}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Daily Schedule</h2>
            <div className="space-y-4">
              {weekData.dailySchedule.map((schedule, index) => {
                const status = getDayStatus(index);
                const dayName = getDayName(index);
                const isClickable = status === "available";
                
                return (
                  <button
                    key={index}
                    onClick={() => isClickable && setLocation(`/dashboard/week/${weekNumber}/day/${index}`)}
                    disabled={!isClickable}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      status === "completed" ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800" :
                      status === "available" ? "bg-primary/10 dark:bg-primary/20 border-2 border-primary hover:bg-primary/20 dark:hover:bg-primary/30 cursor-pointer" :
                      "bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-60"
                    }`}
                    data-testid={`button-day-${index}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getDayIcon(status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{dayName}</h3>
                          {schedule.duration > 0 && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              {schedule.duration}m
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{schedule.time}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{schedule.activity}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm max-h-[600px] overflow-y-auto">
            <Tabs defaultValue="objectives" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="objectives" data-testid="tab-objectives">Objectives</TabsTrigger>
                <TabsTrigger value="tips" data-testid="tab-tips">Exam Tips</TabsTrigger>
                <TabsTrigger value="topics" data-testid="tab-topics">Topics</TabsTrigger>
              </TabsList>

              <TabsContent value="objectives" className="space-y-3 mt-4">
                {weekData.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-2" data-testid={`objective-${index}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{objective}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="tips" className="space-y-3 mt-4">
                {weekData.examTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2" data-testid={`tip-${index}`}>
                    <Target className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="topics" className="space-y-4 mt-4">
                {weekData.topics.map((topic, index) => (
                  <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50" data-testid={`topic-${index}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex-1">
                        {topic.name}
                      </h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded ml-2">
                        {topic.estimatedTime}m
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {topic.keyPoints.slice(0, 3).map((point, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {currentDay && (
          <div className="bg-primary/10 dark:bg-primary/20 border-2 border-primary rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to Continue?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Click on {currentDay.dayName}'s schedule above to start your daily tasks
            </p>
            <Button
              onClick={() => setLocation(`/dashboard/week/${weekNumber}/day/${currentDay.dayIndex}`)}
              size="lg"
              data-testid="button-start-today"
            >
              Start {currentDay.dayName}
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
