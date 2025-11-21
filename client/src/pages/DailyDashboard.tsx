import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle2, Clock, Target, BookOpen, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DayProgress {
  id: string;
  dayIndex: number;
  dayName: string;
  status: string;
  completedAt: Date | null;
  unlockedAt: Date | null;
  completedActivities: string[];
  timeSpent: number;
}

interface WeekProgressWithDays {
  id: string;
  weekNumber: number;
  status: string;
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
  dailySchedule: DailySchedule[];
  learningObjectives: string[];
}

interface DailyDashboardProps {
  weekNumber?: string;
  dayIndex?: string;
}

export default function DailyDashboard({ weekNumber: weekNumberProp, dayIndex: dayIndexProp }: DailyDashboardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [firebaseData, setFirebaseData] = useState<any>(null);
  const [loadingFirebase, setLoadingFirebase] = useState(!!user?.uid);
  
  const weekNumber = parseInt(weekNumberProp || "1");
  const dayIndex = parseInt(dayIndexProp || "0");

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
          console.log('Fetched daily data from Firebase Cloud Function:', data);
          setFirebaseData(data || null);
        } catch (error) {
          console.error('Error loading Firebase data:', error);
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

  const updateDayProgressMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await fetch(`/api/progress/weeks/${weekNumber}/days/${dayIndex}`, {
        method: 'PATCH',
        body: JSON.stringify({ updates }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to update day progress');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress/weeks", weekNumber] });
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

  const isFirebaseMode = !!(firebaseData?.success && firebaseData?.tasksByWeek);
  const plan = studyPlan?.planObject;
  const weekData: WeekData | undefined = plan?.weeks.find((w: any) => w.weekNumber === weekNumber);
  const currentWeekProgress = weekProgress?.[0];
  const currentDayProgress = currentWeekProgress?.days.find(d => d.dayIndex === dayIndex);
  
  const dayNames = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const currentDayName = dayNames[dayIndex];
  
  let dailySchedule: DailySchedule | undefined;
  let firebaseDayTasks: any[] = [];
  
  if (isFirebaseMode && firebaseData?.tasksByWeek[weekNumber]) {
    const weekTasks = firebaseData.tasksByWeek[weekNumber];
    firebaseDayTasks = weekTasks[currentDayName] || [];
    
    if (firebaseDayTasks.length > 0) {
      const firstTask = firebaseDayTasks[0];
      dailySchedule = {
        day: currentDayName,
        time: firstTask.time || "9:00 AM - 11:00 AM",
        activity: firstTask.activity || "Study Session",
        type: firstTask.type || "learning",
        duration: firstTask.duration || 120,
        topic: {
          name: firstTask.topic || "Study Topic",
          estimatedTime: firstTask.duration || 120,
          keyPoints: firebaseDayTasks.map((task: any) => task.task || task.description || "Study task")
        }
      };
    }
  } else {
    dailySchedule = weekData?.dailySchedule[dayIndex];
  }

  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [completingTask, setCompletingTask] = useState(false);

  useEffect(() => {
    if (isFirebaseMode && firebaseDayTasks.length > 0) {
      const completed = firebaseDayTasks
        .filter((task: any) => task.completedAt)
        .map((task: any) => task.taskId);
      setCompletedActivities(completed);
    } else if (currentDayProgress?.completedActivities) {
      setCompletedActivities(currentDayProgress.completedActivities as string[]);
    }
  }, [currentDayProgress, firebaseDayTasks, isFirebaseMode]);

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

  if (!dailySchedule && !isFirebaseMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Day Not Found</h1>
          <Button onClick={() => setLocation(`/dashboard/week/${weekNumber}`)} data-testid="button-back-week">
            Back to Week
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (isFirebaseMode && firebaseDayTasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Day Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No tasks found for {currentDayName} in Week {weekNumber}
          </p>
          <Button onClick={() => setLocation(`/dashboard/week/${weekNumber}`)} data-testid="button-back-week">
            Back to Week
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const todayTasks = isFirebaseMode && firebaseDayTasks.length > 0
    ? firebaseDayTasks.map((task: any) => ({
        taskId: task.taskId,
        topic: task.topic || 'Study Topic',
        task: task.keyPoint || task.task || task.description || 'Study task'
      }))
    : dailySchedule?.topic.keyPoints.map((point, index) => ({ 
        taskId: `task-${dayIndex}-${index}`,
        topic: dailySchedule?.topic.name || '', 
        task: point 
      })) || [];

  const handleToggleActivity = async (taskId: string) => {
    if (isFirebaseMode && user?.uid) {
      const isCompleted = completedActivities.includes(taskId);
      
      if (isCompleted) {
        toast({
          title: "Cannot uncomplete tasks",
          description: "Once a task is completed, it cannot be unmarked in Firebase mode.",
          variant: "destructive",
        });
        return;
      }
      
      setCompletingTask(true);
      try {
        const response = await fetch('https://us-central1-certply-56653.cloudfunctions.net/completeTasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            taskIds: [taskId]
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to complete task: ${response.status}`);
        }

        const result = await response.json();
        console.log('Task completed:', result);
        
        setCompletedActivities([...completedActivities, taskId]);
        
        toast({
          title: "Task Completed!",
          description: "Great work! Keep up the progress.",
        });
        
        const loadResponse = await fetch('https://us-central1-certply-56653.cloudfunctions.net/getAllTasksByUid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid
          })
        });
        
        if (loadResponse.ok) {
          const data = await loadResponse.json();
          setFirebaseData(data || null);
        }
      } catch (error) {
        console.error('Error completing task:', error);
        toast({
          title: "Error",
          description: "Failed to complete task. Please try again.",
          variant: "destructive",
        });
      } finally {
        setCompletingTask(false);
      }
    } else {
      const newCompleted = completedActivities.includes(taskId)
        ? completedActivities.filter(id => id !== taskId)
        : [...completedActivities, taskId];
      
      setCompletedActivities(newCompleted);
    }
  };

  const handleCompleteDay = async () => {
    if (todayTasks.length === 0) {
      toast({
        title: "No tasks available",
        description: "There are no tasks to complete for this day.",
        variant: "destructive",
      });
      return;
    }

    if (isFirebaseMode && user?.uid) {
      const incompleteTasks = todayTasks
        .filter(task => !completedActivities.includes(task.taskId))
        .map(task => task.taskId);

      if (incompleteTasks.length === 0) {
        toast({
          title: "All tasks already completed!",
          description: "You've already completed all tasks for today.",
        });
        setTimeout(() => {
          setLocation(`/dashboard/week/${weekNumber}`);
        }, 1500);
        return;
      }

      setCompletingTask(true);
      try {
        const response = await fetch('https://us-central1-certply-56653.cloudfunctions.net/completeTasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            taskIds: incompleteTasks
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to complete tasks: ${response.status}`);
        }

        const result = await response.json();
        console.log('All tasks completed:', result);
        
        setCompletedActivities([...completedActivities, ...incompleteTasks]);
        
        toast({
          title: "Day Complete!",
          description: `Great work! You've completed all ${todayTasks.length} tasks for today.`,
        });
        
        const loadResponse = await fetch('https://us-central1-certply-56653.cloudfunctions.net/getAllTasksByUid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid
          })
        });
        
        if (loadResponse.ok) {
          const data = await loadResponse.json();
          setFirebaseData(data || null);
        }

        setTimeout(() => {
          setLocation(`/dashboard/week/${weekNumber}`);
        }, 1500);
      } catch (error) {
        console.error('Error completing day:', error);
        toast({
          title: "Error",
          description: "Failed to complete all tasks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setCompletingTask(false);
      }
    } else {
      if (completedActivities.length === 0) {
        toast({
          title: "Complete at least one activity",
          description: "Please complete some activities before marking the day as done.",
          variant: "destructive",
        });
        return;
      }

      await updateDayProgressMutation.mutateAsync({
        status: "completed",
        completedAt: new Date().toISOString(),
        completedActivities,
        timeSpent: dailySchedule?.duration || 0,
      });

      toast({
        title: "Day Complete!",
        description: "Great work! You've completed today's study session.",
      });

      setTimeout(() => {
        setLocation(`/dashboard/week/${weekNumber}`);
      }, 1500);
    }
  };

  const progressPct = todayTasks.length > 0 
    ? Math.round((completedActivities.length / todayTasks.length) * 100) 
    : 0;

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
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation(`/dashboard/week/${weekNumber}`)}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Week {weekNumber}
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-page-title">
            {dailySchedule?.day} - Week {weekNumber}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {dailySchedule?.time} • {dailySchedule?.activity}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Progress Today</span>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-progress">
              {progressPct}%
            </div>
            <Progress value={progressPct} className="h-2" />
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tasks Complete</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-tasks-complete">
              {completedActivities.length} / {todayTasks.length}
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Time</span>
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-time">
              {dailySchedule?.duration}m
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today's Learning Tasks</h2>
          </div>

          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Review the week's learning objectives and prepare for tomorrow.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayTasks.map((task, index) => {
                const isCompleted = completedActivities.includes(task.taskId);

                return (
                  <div 
                    key={task.taskId}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCompleted 
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                    data-testid={`task-${index}`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        id={task.taskId}
                        checked={isCompleted}
                        onCheckedChange={() => handleToggleActivity(task.taskId)}
                        className="mt-1"
                        disabled={completingTask}
                        data-testid={`checkbox-task-${index}`}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={task.taskId}
                          className={`block font-medium mb-1 cursor-pointer ${
                            isCompleted 
                              ? "text-green-700 dark:text-green-300 line-through" 
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {task.topic}
                        </label>
                        <p className={`text-sm ${
                          isCompleted 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-gray-600 dark:text-gray-400"
                        }`}>
                          {task.task}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {!isFirebaseMode && weekData?.learningObjectives && weekData.learningObjectives.length > 0 && (
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Learning Objectives for This Week</h3>
            <div className="space-y-2">
              {weekData.learningObjectives.slice(0, 3).map((objective, index) => (
                <div key={index} className="flex items-start gap-2" data-testid={`objective-${index}`}>
                  <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{objective}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setLocation(`/dashboard/week/${weekNumber}`)}
            className="flex-1"
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCompleteDay}
            disabled={completingTask || updateDayProgressMutation.isPending || currentDayProgress?.status === "completed"}
            className="flex-1 bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90"
            data-testid="button-complete-day"
          >
            {completingTask ? "Completing tasks..." :
             updateDayProgressMutation.isPending ? "Saving..." : 
             currentDayProgress?.status === "completed" ? "Already Completed" : "Complete Day"}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
