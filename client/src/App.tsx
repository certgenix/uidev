import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
      <Route path="/study-plan-results">
        {() => (
          <ProtectedRoute>
            <StudyPlanResults />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/all-weeks">
        {() => (
          <ProtectedRoute>
            <AllWeeksDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/week/:weekNumber">
        {(params) => {
          if (!params?.weekNumber) return null;
          return (
            <ProtectedRoute>
              <WeeklyDashboard weekNumber={params.weekNumber} />
            </ProtectedRoute>
          );
        }}
      </Route>
      <Route path="/dashboard/week/:weekNumber/day/:dayIndex">
        {(params) => {
          if (!params?.weekNumber || !params?.dayIndex) return null;
          return (
            <ProtectedRoute>
              <DailyDashboard weekNumber={params.weekNumber} dayIndex={params.dayIndex} />
            </ProtectedRoute>
          );
        }}
      </Route>
      <Route path="/simulator">
        {() => (
          <ProtectedRoute>
            <Simulator />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/simulator/exam/:sessionId">
        {(params) => {
          if (!params?.sessionId) return null;
          return (
            <ProtectedRoute>
              <ExamTaking sessionId={params.sessionId} />
            </ProtectedRoute>
          );
        }}
      </Route>
      <Route path="/simulator/results/:sessionId">
        {(params) => {
          if (!params?.sessionId) return null;
          return (
            <ProtectedRoute>
              <ExamResults sessionId={params.sessionId} />
            </ProtectedRoute>
          );
        }}
      </Route>
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
