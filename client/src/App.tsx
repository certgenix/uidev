import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import Diagnostic from "@/pages/Diagnostic";
import StudyPlanResults from "@/pages/StudyPlanResults";
import AllWeeksDashboard from "@/pages/AllWeeksDashboard";
import WeeklyDashboard from "@/pages/WeeklyDashboard";
import DailyDashboard from "@/pages/DailyDashboard";
import Simulator from "@/pages/Simulator";
import ExamTaking from "@/pages/ExamTaking";
import ExamResults from "@/pages/ExamResults";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/diagnostic" component={Diagnostic} />
      <Route path="/study-plan-results" component={StudyPlanResults} />
      <Route path="/dashboard/all-weeks" component={AllWeeksDashboard} />
      <Route path="/dashboard/week/:weekNumber" component={WeeklyDashboard} />
      <Route path="/dashboard/week/:weekNumber/day/:dayIndex" component={DailyDashboard} />
      <Route path="/simulator" component={Simulator} />
      <Route path="/simulator/exam/:sessionId" component={ExamTaking} />
      <Route path="/simulator/results/:sessionId" component={ExamResults} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
