import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, Save, Pause, Play, CheckCircle, XCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuestionItem {
  qid: string;
  type: string;
  domain: string;
  stem: string;
  options: Array<{ id: string; text: string }>;
}

export default function ExamTaking() {
  const { sessionId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = useQuery({
    queryKey: ["/api/sessions", sessionId],
    refetchInterval: 30000
  });

  const { data: items } = useQuery<QuestionItem[]>({
    queryKey: ["/api/sessions", sessionId, "items"],
    queryFn: async () => {
      const response = await fetch(`/api/sessions/${sessionId}/items?from=0&limit=100`);
      return response.json();
    },
    enabled: !!sessionId
  });

  useEffect(() => {
    if (items) {
      setQuestions(items);
    }
  }, [items]);

  useEffect(() => {
    if (session && (session as any).answers) {
      const sessionAnswers: Record<string, string[]> = {};
      Object.entries((session as any).answers).forEach(([qid, data]: [string, any]) => {
        if (data.selected) {
          sessionAnswers[qid] = data.selected;
        }
      });
      setAnswers(sessionAnswers);
    }
    
    if (session && (session as any).timer?.enabled) {
      const timer = (session as any).timer;
      if (timer.endsAt) {
        const endsAt = new Date(timer.endsAt).getTime();
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endsAt - now) / 1000));
        setRemainingSeconds(remaining);
        setIsPaused((session as any).status === "paused");
      }
    }
  }, [session]);

  useEffect(() => {
    if ((session as any)?.timer?.enabled && !isPaused) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            submitMutation.mutate();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isPaused, session]);

  const pauseMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/sessions/${sessionId}/pause`);
    },
    onSuccess: () => {
      setIsPaused(true);
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Pause failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resumeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/sessions/${sessionId}/resume`);
    },
    onSuccess: () => {
      setIsPaused(false);
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Resume failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const gradeMutation = useMutation({
    mutationFn: async ({ qid, selected }: { qid: string; selected: string[] }) => {
      return await apiRequest("POST", `/api/sessions/${sessionId}/grade`, { qid, selected });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save answer",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/sessions/${sessionId}/submit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId] });
      setLocation(`/simulator/results/${sessionId}`);
    }
  });

  const currentQuestion = questions[currentIndex];
  const sessionMode = (session as any)?.mode || "quiz";
  const showExplanations = (session as any)?.review?.explanationsWhileTaking || sessionMode === "quiz";
  const currentQuestionGrade = (session as any)?.answers?.[currentQuestion?.qid];

  const handleAnswerChange = (qid: string, optionId: string, isChecked: boolean) => {
    const currentAnswer = answers[qid] || [];
    const updated = isChecked
      ? [...currentAnswer, optionId]
      : currentAnswer.filter(id => id !== optionId);
    
    setAnswers(prev => ({ ...prev, [qid]: updated }));
    gradeMutation.mutate(
      { qid, selected: updated },
      {
        onError: () => {
          setAnswers(prev => ({ ...prev, [qid]: currentAnswer }));
        }
      }
    );
  };

  const handleRadioChange = (qid: string, optionId: string) => {
    const currentAnswer = answers[qid] || [];
    setAnswers(prev => ({ ...prev, [qid]: [optionId] }));
    gradeMutation.mutate(
      { qid, selected: [optionId] },
      {
        onError: () => {
          setAnswers(prev => ({ ...prev, [qid]: currentAnswer }));
        }
      }
    );
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!session || !currentQuestion) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Badge variant="outline" data-testid="badge-progress">
              Question {currentIndex + 1} of {questions.length}
            </Badge>
            <Badge variant="secondary" data-testid="badge-domain">{currentQuestion.domain}</Badge>
          </div>
          {(session as any).timer?.enabled && (
            <div className="flex items-center gap-2">
              <Badge variant="default" data-testid="badge-timer">
                <Clock className="h-4 w-4 mr-1" />
                {Math.floor(remainingSeconds / 60)}:{(remainingSeconds % 60).toString().padStart(2, '0')}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => isPaused ? resumeMutation.mutate() : pauseMutation.mutate()}
                disabled={pauseMutation.isPending || resumeMutation.isPending}
                data-testid="button-pause-resume"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold" data-testid="text-question-stem">
              {currentQuestion.stem}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {currentQuestion.type === "MSQ" && "Multiple Select Question - Choose all that apply"}
            </p>
          </CardHeader>
          <CardContent>
            {currentQuestion.type === "MCQ" ? (
              <RadioGroup
                value={answers[currentQuestion.qid]?.[0] || ""}
                onValueChange={(value) => handleRadioChange(currentQuestion.qid, value)}
                className="space-y-3"
              >
                {currentQuestion.options.map(option => {
                  const isSelected = answers[currentQuestion.qid]?.[0] === option.id;
                  const isCorrect = currentQuestionGrade?.feedback?.correct?.includes(option.id);
                  const isIncorrect = currentQuestionGrade?.feedback?.incorrect?.includes(option.id);
                  const showFeedback = showExplanations && isSelected;
                  
                  return (
                    <div key={option.id} className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                      showFeedback && isCorrect ? 'bg-green-50 dark:bg-green-950 border-green-500' :
                      showFeedback && isIncorrect ? 'bg-red-50 dark:bg-red-950 border-red-500' :
                      'hover:bg-accent/50'
                    }`}>
                      <RadioGroupItem value={option.id} id={`${currentQuestion.qid}-${option.id}`} data-testid={`radio-option-${option.id}`} />
                      <Label htmlFor={`${currentQuestion.qid}-${option.id}`} className="flex-1 cursor-pointer font-normal">
                        <div className="flex items-start justify-between gap-2">
                          <span>{option.text}</span>
                          {showFeedback && isCorrect && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />}
                          {showFeedback && isIncorrect && <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />}
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {currentQuestion.options.map(option => {
                  const isSelected = answers[currentQuestion.qid]?.includes(option.id);
                  const isCorrect = currentQuestionGrade?.feedback?.correct?.includes(option.id);
                  const isIncorrect = currentQuestionGrade?.feedback?.incorrect?.includes(option.id);
                  const showFeedback = showExplanations && isSelected;
                  
                  return (
                    <div key={option.id} className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                      showFeedback && isCorrect ? 'bg-green-50 dark:bg-green-950 border-green-500' :
                      showFeedback && isIncorrect ? 'bg-red-50 dark:bg-red-950 border-red-500' :
                      'hover:bg-accent/50'
                    }`}>
                      <Checkbox
                        id={`${currentQuestion.qid}-${option.id}`}
                        checked={answers[currentQuestion.qid]?.includes(option.id) || false}
                        onCheckedChange={(checked) => handleAnswerChange(currentQuestion.qid, option.id, checked as boolean)}
                        data-testid={`checkbox-option-${option.id}`}
                      />
                      <Label htmlFor={`${currentQuestion.qid}-${option.id}`} className="flex-1 cursor-pointer font-normal">
                        <div className="flex items-start justify-between gap-2">
                          <span>{option.text}</span>
                          {showFeedback && isCorrect && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />}
                          {showFeedback && isIncorrect && <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />}
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            )}
            
            {showExplanations && currentQuestionGrade?.feedback?.explanation && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Explanation</h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  {currentQuestionGrade.feedback.explanation}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 md:relative md:border-0 md:p-0 md:mt-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              data-testid="button-previous"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="icon"
              data-testid="button-save"
            >
              <Save className="h-4 w-4" />
            </Button>
            {currentIndex === questions.length - 1 ? (
              <Button
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending}
                data-testid="button-submit"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                data-testid="button-next"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
