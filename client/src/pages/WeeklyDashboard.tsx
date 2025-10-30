import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
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

interface Topic {
  name: string;
  estimatedTime: number;
  keyPoints: string[];
}

interface DailySchedule {
  day: string;
  time: string;
  activity: string;
  type: string;
  duration: number;
  topic: Topic;
}

interface WeekData {
  weekNumber: number;
  domain: string;
  theme: string;
  priority: string;
  dailySchedule: DailySchedule[];
  learningObjectives: string[];
  examTips: string[];
  selfAssessment: string[];
  totalTime: number;
}

export default function WeeklyDashboard() {
  const [, params] = useRoute("/dashboard/week/:weekNumber");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [firebaseData, setFirebaseData] = useState<any>(null);
  // Initialize loadingFirebase to true if user exists, so we show loading screen first
  const [loadingFirebase, setLoadingFirebase] = useState(!!user?.uid);
  
  const weekNumber = parseInt(params?.weekNumber || "1");

  useEffect(() => {
    const loadFirebaseData = async () => {
      if (user?.uid) {
        setLoadingFirebase(true);
        try {
          const response = await fetch('https://us-central1-certply-56653.cloudfunctions.net/getAllTasksByUid', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: user.uid
            })
          });

          if (!response.ok) {
            throw new Error(`Firebase function error: ${response.status}`);
          }

          const data = await response.json();
          console.log('Fetched weeks and tasks from Firebase Cloud Function:', data);
          setFirebaseData(data || null);
        } catch (error) {
          console.error('Error loading Firebase weeks:', error);
          setFirebaseData(null);
        } finally {
          setLoadingFirebase(false);
        }
      }
    };
    
    loadFirebaseData();
  }, [user]);

  const { data: weekProgress, isLoading } = useQuery<WeekProgressWithDays[]>({
    queryKey: ["/api/progress/weeks", weekNumber],
    queryFn: async () => {
      const response = await fetch(`/api/progress/weeks?weekNumber=${weekNumber}`);
      if (!response.ok) throw new Error('Failed to fetch week progress');
      return response.json();
    },
    enabled: !firebaseData?.success,
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
  
  const isFirebaseMode = !!(firebaseData?.success && firebaseData?.tasksByWeek);
  
  const currentWeekProgress = (() => {
    if (isFirebaseMode && firebaseData?.tasksByWeek[weekNumber]) {
      const weekTasks = firebaseData.tasksByWeek[weekNumber] || {};
      const allTasks = Object.values(weekTasks).flat() as any[];
      const completedTasks = allTasks.filter((task: any) => task.completedAt).length;
      
      const days = Object.entries(weekTasks).map(([dayName, tasks]: [string, any]) => {
        const dayTasks = tasks as any[];
        const dayIndex = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].indexOf(dayName);
        const allCompleted = dayTasks.length > 0 && dayTasks.every((t: any) => t.completedAt);
        const hasAvailableTask = dayTasks.some((t: any) => !t.completedAt);
        
        return {
          id: `${weekNumber}-${dayName}`,
          dayIndex,
          dayName,
          status: allCompleted ? 'completed' : hasAvailableTask ? 'available' : 'locked',
          completedAt: null,
          unlockedAt: null,
          timeSpent: 0
        };
      });
      
      const hasAvailableTask = allTasks.some((task: any) => !task.completedAt);
      const allCompleted = allTasks.length > 0 && allTasks.every((task: any) => task.completedAt);
      const status = allCompleted ? 'completed' : hasAvailableTask ? 'available' : 'locked';
      
      return {
        id: `week-${weekNumber}`,
        weekNumber,
        status,
        startedAt: null,
        completedAt: null,
        completedTopics: completedTasks,
        totalTopics: allTasks.length,
        timeSpent: 0,
        days
      };
    }
    return weekProgress?.[0];
  })();

  // Show loading screen while Firebase data is being fetched
  if (loadingFirebase || isLoading) {
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

  // After loading is complete, check if we have data (either from localStorage or Firebase)
  if ((!plan || !weekData) && !isFirebaseMode) {
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
  
  // Get the scheduled day indices from the study plan
  const scheduledDayIndices = weekData?.dailySchedule?.map((_, index) => index) || [];
  
  // Find the next available day that is actually in the scheduled days
  const currentDay = currentWeekProgress?.days.find(d => 
    d.status === "available" && (scheduledDayIndices.length === 0 || scheduledDayIndices.includes(d.dayIndex))
  );
  
  // Check if all scheduled days are complete
  const scheduledDays = scheduledDayIndices.length > 0 
    ? currentWeekProgress?.days.filter(d => scheduledDayIndices.includes(d.dayIndex)) || []
    : currentWeekProgress?.days || [];
  const allScheduledDaysComplete = scheduledDays.length > 0 && 
    scheduledDays.every(d => d.status === "completed");

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
            Week {weekNumber}{weekData ? `: ${weekData.theme}` : ''}
          </h1>
          {weekData && (
            <p className="text-gray-600 dark:text-gray-300">
              {weekData.domain}
            </p>
          )}
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
              {isFirebaseMode ? currentWeekProgress?.totalTopics || 0 : weekData?.dailySchedule?.length || 0}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Daily Schedule</h2>
            <div className="space-y-4">
              {isFirebaseMode && currentWeekProgress?.days ? (
                currentWeekProgress.days.map((day, index) => {
                  const status = day.status;
                  const dayName = day.dayName;
                  const isClickable = status === "available";
                  
                  return (
                    <button
                      key={day.id}
                      onClick={() => isClickable && setLocation(`/dashboard/week/${weekNumber}/day/${day.dayIndex}`)}
                      disabled={!isClickable}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        status === "completed" ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800" :
                        status === "available" ? "bg-primary/10 dark:bg-primary/20 border-2 border-primary hover:bg-primary/20 dark:hover:bg-primary/30 cursor-pointer" :
                        "bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-60"
                      }`}
                      data-testid={`button-day-${day.dayIndex}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {getDayIcon(status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{dayName}</h3>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">Click to view tasks</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : weekData?.dailySchedule ? (
                weekData.dailySchedule.map((schedule, index) => {
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
              })
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No schedule data available</p>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm max-h-[600px] overflow-y-auto">
            {isFirebaseMode ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Week {weekNumber} Overview</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Click on any day to view detailed tasks and learning materials.
                </p>
                <div className="text-left space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {currentWeekProgress?.completedTopics || 0} of {currentWeekProgress?.totalTopics || 0} tasks completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {completedDays} of 7 days completed
                    </span>
                  </div>
                </div>
              </div>
            ) : weekData ? (
              <Tabs defaultValue="objectives" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="objectives" data-testid="tab-objectives">Objectives</TabsTrigger>
                  <TabsTrigger value="tips" data-testid="tab-tips">Exam Tips</TabsTrigger>
                  <TabsTrigger value="topics" data-testid="tab-topics">Topics</TabsTrigger>
                </TabsList>

                <TabsContent value="objectives" className="space-y-3 mt-4">
                  {weekData.learningObjectives?.map((objective, index) => (
                    <div key={index} className="flex items-start gap-2" data-testid={`objective-${index}`}>
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">{objective}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="tips" className="space-y-3 mt-4">
                  {weekData.examTips?.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2" data-testid={`tip-${index}`}>
                      <Target className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="topics" className="space-y-4 mt-4">
                  {weekData.dailySchedule?.map((schedule, index) => (
                    <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50" data-testid={`topic-${index}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex-1">
                          {schedule.topic.name}
                        </h4>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded ml-2">
                          {schedule.topic.estimatedTime}m
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {schedule.topic.keyPoints.slice(0, 3).map((point, idx) => (
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
            ) : null}
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
              className="bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90"
              data-testid="button-start-today"
            >
              Start {currentDay.dayName}
            </Button>
          </div>
        )}
        
        {!currentDay && allScheduledDaysComplete && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-700 rounded-lg p-6 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Week Complete!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Great job! You've completed all scheduled study days for this week.
            </p>
            <Button
              onClick={() => setLocation(`/dashboard/week/${weekNumber + 1}`)}
              size="lg"
              className="bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90"
              data-testid="button-next-week"
            >
              Continue to Next Week
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
