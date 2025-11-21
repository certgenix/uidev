import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle2, Lock, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface DayProgress {
  id: string;
  dayIndex: number;
  dayName: string;
  status: string;
  completedAt: Date | null;
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

export default function AllWeeksDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [firebaseData, setFirebaseData] = useState<any>(null);
  const [loadingFirebase, setLoadingFirebase] = useState(false);

  // Fetch from API (fallback)
  const { data: allWeeks = [], isLoading } = useQuery<WeekProgressWithDays[]>({
    queryKey: ["/api/progress/weeks"],
  });

  // Fetch from Firebase Cloud Function when user is logged in
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

  // Use Firebase data if available
  const isFirebaseMode = firebaseData?.success && firebaseData?.tasksByWeek;

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

  // Show error only if both localStorage and Firebase data are missing
  if (!plan && !isFirebaseMode && !loadingFirebase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No Study Plan Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please complete the diagnostic questionnaire first.
          </p>
          <Button 
            onClick={() => setLocation('/diagnostic')} 
            className="bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90"
            data-testid="button-back-diagnostic"
          >
            Back to Diagnostic
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const getWeekData = (weekNumber: number) => {
    return plan?.weeks?.find((w: any) => w.weekNumber === weekNumber);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "available":
        return <Clock className="w-5 h-5 text-primary" />;
      default:
        return <Lock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "available":
        return "In Progress";
      default:
        return "Locked";
    }
  };

  // Convert Firebase weeks to the same format as API weeks for display
  const formattedWeeks = isFirebaseMode && firebaseData?.weeks
    ? firebaseData.weeks.map((weekNum: number) => {
        const weekTasks = firebaseData.tasksByWeek[weekNum] || {};
        const allTasks = Object.values(weekTasks).flat();
        const completedTasks = allTasks.filter((task: any) => task.completedAt).length;
        
        // Determine week status based on tasks
        const hasAvailableTask = allTasks.some((task: any) => !task.completedAt);
        const allCompleted = allTasks.length > 0 && allTasks.every((task: any) => task.completedAt);
        const status = allCompleted ? 'completed' : hasAvailableTask ? 'available' : 'locked';
        
        return {
          id: `week-${weekNum}`,
          weekNumber: weekNum,
          status,
          startedAt: null,
          completedAt: null,
          completedTopics: completedTasks,
          totalTopics: allTasks.length,
          timeSpent: 0,
          days: Object.entries(weekTasks).map(([day, tasks]: [string, any]) => ({
            id: `${weekNum}-${day}`,
            dayIndex: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].indexOf(day),
            dayName: day,
            status: tasks.every((t: any) => t.completedAt) ? 'completed' : 'available',
            completedAt: null
          }))
        };
      })
    : allWeeks;

  const calculateOverallProgress = () => {
    if (formattedWeeks.length === 0) return 0;
    const completed = formattedWeeks.filter(w => w.status === "completed").length;
    return Math.round((completed / formattedWeeks.length) * 100);
  };

  const totalTimeSpent = formattedWeeks.reduce((sum, w) => sum + (w.timeSpent || 0), 0);
  const completedWeeks = formattedWeeks.filter(w => w.status === "completed").length;

  if (isLoading || loadingFirebase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-gray-600 dark:text-gray-300">
            {loadingFirebase ? 'Loading your study plan from Firebase...' : 'Loading...'}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-page-title">
            Study Plan Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your progress across all {plan?.totalWeeks || formattedWeeks.length} weeks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</span>
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-overall-progress">
              {calculateOverallProgress()}%
            </div>
            <Progress value={calculateOverallProgress()} className="h-2" />
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Weeks Completed</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-completed-weeks">
              {completedWeeks} / {plan?.totalWeeks || formattedWeeks.length}
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Time Invested</span>
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-time-spent">
              {Math.round(totalTimeSpent / 60)}h
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formattedWeeks.map((week) => {
            const weekData = getWeekData(week.weekNumber);
            const completedDays = week.days.filter(d => d.status === "completed").length;
            const totalDays = week.days.length;
            const weekProgress = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

            return (
              <Card 
                key={week.id} 
                className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all hover:shadow-lg ${
                  week.status === "available" ? "border-2 border-primary" : ""
                }`}
                data-testid={`card-week-${week.weekNumber}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Week {week.weekNumber}
                      </h3>
                      {getStatusIcon(week.status)}
                    </div>
                    {weekData && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {weekData.theme}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-gray-900 dark:text-white font-medium">{weekProgress}%</span>
                    </div>
                    <Progress value={weekProgress} className="h-2" />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Days</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {completedDays} / {totalDays}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`font-medium ${
                      week.status === "completed" ? "text-green-500" :
                      week.status === "available" ? "text-primary" :
                      "text-gray-400"
                    }`}>
                      {getStatusText(week.status)}
                    </span>
                  </div>
                </div>

                <Button
                  className={`w-full ${week.status !== "locked" ? "bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90" : ""}`}
                  onClick={() => setLocation(`/dashboard/week/${week.weekNumber}`)}
                  disabled={week.status === "locked"}
                  data-testid={`button-view-week-${week.weekNumber}`}
                >
                  {week.status === "locked" ? "Locked" : "View Week"}
                  {week.status !== "locked" && <ChevronRight className="w-4 h-4 ml-2" />}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
