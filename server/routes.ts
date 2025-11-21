import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { allocateQuestions, gradeQuestion, calculateFinalScore } from "./examLogic";
import type { Question } from "@shared/schema";
import { generateCertificate } from "./certificateGenerator";
import { join } from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create exam session
  app.post("/api/sessions", async (req, res) => {
    try {
      const { certificationName, mode, domains, blueprint, questionCount, timer, review } = req.body;
      const userId = req.body.userId || "demo-user";
      
      // Get available questions for selected domains
      const availableByDomain = new Map<string, Question[]>();
      for (const domain of domains) {
        const questions = await storage.getQuestionsByDomains([domain]);
        availableByDomain.set(domain, questions);
      }
      
      // Allocate questions
      const { allocations, selectedQuestions } = allocateQuestions(
        blueprint,
        domains,
        questionCount,
        availableByDomain
      );
      
      // Create session
      const session = await storage.createSession({
        userId,
        certificationName,
        mode,
        domains,
        blueprint,
        questionCount,
        timer: timer.enabled ? {
          enabled: true,
          durationMin: timer.durationMin,
          endsAt: new Date(Date.now() + timer.durationMin * 60000).toISOString(),
          remainingSec: timer.durationMin * 60
        } : { enabled: false },
        review,
        status: "active",
        index: 0,
        questions: selectedQuestions.map(q => ({ qid: q.id, domain: q.domain, type: q.type })),
        answers: {}
      });
      
      res.json({
        sessionId: session.id,
        certificationName,
        summary: {
          allocations: allocations.map(a => ({
            domain: a.domain,
            count: a.count,
            weight: a.weight
          }))
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get session state
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const timer = session.timer as any;
      res.json({
        certificationName: session.certificationName,
        mode: session.mode,
        status: session.status,
        index: session.index,
        questions: session.questions,
        answers: session.answers,
        review: session.review,
        timer: timer.enabled ? {
          enabled: true,
          endsAt: timer.endsAt,
          remainingSec: timer.remainingSec
        } : { enabled: false }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get paginated items (redacted)
  app.get("/api/sessions/:id/items", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const from = parseInt(req.query.from as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;
      const questions = session.questions as any[];
      const slice = questions.slice(from, from + limit);
      
      const items = [];
      for (const q of slice) {
        const question = await storage.getQuestion(q.qid);
        if (question) {
          const options = (question.options as any[]).map(o => ({ id: o.id, text: o.text }));
          items.push({
            qid: question.id,
            type: question.type,
            domain: question.domain,
            stem: question.stem,
            options
          });
        }
      }
      
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Grade a single item
  app.post("/api/sessions/:id/grade", async (req, res) => {
    try {
      const { qid, selected } = req.body;
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const question = await storage.getQuestion(qid);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      const { score, feedback } = gradeQuestion(question, selected);
      const review = session.review as any;
      const mode = session.mode;
      
      // Show feedback in quiz mode or when explanationsWhileTaking is enabled in exam mode
      const shouldShowFeedback = mode === "quiz" || review.explanationsWhileTaking;
      
      // Update answers
      const answers = session.answers as any;
      answers[qid] = {
        selected,
        perItemScore: score,
        feedback: shouldShowFeedback ? feedback : {}
      };
      
      await storage.updateSession(req.params.id, { answers });
      
      res.json({
        certificationName: session.certificationName,
        perItemScore: score,
        feedbackAllowed: shouldShowFeedback,
        feedback: shouldShowFeedback ? feedback : undefined
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Pause timer
  app.post("/api/sessions/:id/pause", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const timer = session.timer as any;
      if (timer.enabled) {
        const now = Date.now();
        const endsAt = new Date(timer.endsAt).getTime();
        const remainingSec = Math.max(0, Math.floor((endsAt - now) / 1000));
        
        await storage.updateSession(req.params.id, {
          status: "paused",
          timer: { ...timer, remainingSec }
        });
        
        res.json({
          certificationName: session.certificationName,
          remainingSec
        });
      } else {
        res.json({ certificationName: session.certificationName });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Resume timer
  app.post("/api/sessions/:id/resume", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const timer = session.timer as any;
      if (timer.enabled && timer.remainingSec) {
        const endsAt = new Date(Date.now() + timer.remainingSec * 1000).toISOString();
        
        await storage.updateSession(req.params.id, {
          status: "active",
          timer: { ...timer, endsAt }
        });
        
        res.json({
          certificationName: session.certificationName,
          endsAt
        });
      } else {
        res.json({ certificationName: session.certificationName });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Submit and score
  app.post("/api/sessions/:id/submit", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const questions = session.questions as any[];
      const answers = session.answers as any;
      const blueprint = session.blueprint as Record<string, number>;
      
      // Calculate final score
      const { overallScorePct, perDomain } = calculateFinalScore(questions, answers, blueprint);
      
      // Get full item details
      const items = [];
      for (const q of questions) {
        const question = await storage.getQuestion(q.qid);
        if (question) {
          const answer = answers[q.qid] || {};
          const options = question.options as any[];
          const weights: Record<string, number> = {};
          options.forEach(o => { weights[o.id] = o.weight; });
          
          items.push({
            qid: q.qid,
            yourSelection: answer.selected || [],
            perItemScore: answer.perItemScore || 0,
            weights,
            explanation: question.explanation
          });
        }
      }
      
      await storage.updateSession(req.params.id, {
        status: "submitted",
        submittedAt: new Date()
      });
      
      res.json({
        certificationName: session.certificationName,
        overallScorePct,
        perDomain,
        items
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Initialize user progress
  app.post("/api/progress/initialize", async (req, res) => {
    try {
      const { userId, totalWeeks } = req.body;
      await storage.initializeUserProgress(userId || "demo-user", totalWeeks);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all week progress for user or specific week
  app.get("/api/progress/weeks", async (req, res) => {
    try {
      const userId = req.query.userId as string || "demo-user";
      const weekNumber = req.query.weekNumber ? parseInt(req.query.weekNumber as string) : undefined;
      
      const weekProgress = await storage.getWeekProgress(userId, weekNumber);
      
      const progressWithDays = await Promise.all(
        weekProgress.map(async (wp) => {
          const days = await storage.getDayProgress(wp.id);
          return { ...wp, days };
        })
      );
      
      res.json(progressWithDays);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get current progress (first available week and day)
  app.get("/api/progress/current", async (req, res) => {
    try {
      const userId = req.query.userId as string || "demo-user";
      const allProgress = await storage.getWeekProgress(userId);
      
      const currentWeek = allProgress.find(wp => wp.status === "available") || allProgress[0];
      if (!currentWeek) {
        return res.json({ currentWeek: null, currentDay: null });
      }
      
      const days = await storage.getDayProgress(currentWeek.id);
      const currentDay = days.find(d => d.status === "available") || days[0];
      
      res.json({ currentWeek, currentDay, days });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update week progress
  app.patch("/api/progress/weeks/:weekNumber", async (req, res) => {
    try {
      const userId = req.body.userId || "demo-user";
      const weekNumber = parseInt(req.params.weekNumber);
      const updates = req.body.updates;
      
      const weekProgress = await storage.getWeekProgress(userId, weekNumber);
      if (weekProgress.length === 0) {
        return res.status(404).json({ message: "Week progress not found" });
      }
      
      const updated = await storage.updateWeekProgress(weekProgress[0].id, updates);
      
      if (updated?.status === "completed") {
        const nextWeek = await storage.getWeekProgress(userId, weekNumber + 1);
        if (nextWeek.length > 0 && nextWeek[0].status === "locked") {
          await storage.updateWeekProgress(nextWeek[0].id, { 
            status: "available", 
            startedAt: new Date() 
          });
          
          const nextWeekDays = await storage.getDayProgress(nextWeek[0].id);
          if (nextWeekDays.length > 0 && nextWeekDays[0].status === "locked") {
            await storage.updateDayProgress(nextWeekDays[0].id, { 
              status: "available", 
              unlockedAt: new Date() 
            });
          }
        }
      }
      
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update day progress
  app.patch("/api/progress/weeks/:weekNumber/days/:dayIndex", async (req, res) => {
    try {
      const userId = req.body.userId || "demo-user";
      const weekNumber = parseInt(req.params.weekNumber);
      const dayIndex = parseInt(req.params.dayIndex);
      const updates = req.body.updates;
      
      const weekProgress = await storage.getWeekProgress(userId, weekNumber);
      if (weekProgress.length === 0) {
        return res.status(404).json({ message: "Week progress not found" });
      }
      
      const days = await storage.getDayProgress(weekProgress[0].id);
      const day = days.find(d => d.dayIndex === dayIndex);
      if (!day) {
        return res.status(404).json({ message: "Day progress not found" });
      }
      
      const updated = await storage.updateDayProgress(day.id, updates);
      
      if (updated?.status === "completed") {
        const nextDay = days.find(d => d.dayIndex === dayIndex + 1);
        if (nextDay && nextDay.status === "locked") {
          await storage.updateDayProgress(nextDay.id, { 
            status: "available", 
            unlockedAt: new Date() 
          });
        } else if (dayIndex === 6) {
          const allCompleted = days.every(d => d.status === "completed");
          if (allCompleted) {
            await storage.updateWeekProgress(weekProgress[0].id, { 
              status: "completed", 
              completedAt: new Date() 
            });
          }
        }
      }
      
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/certificates", async (req, res) => {
    try {
      const { userId, userName, planName, isFirebaseMode } = req.body;
      
      const existing = await storage.getCertificate(userId, planName);
      if (existing) {
        return res.json(existing);
      }

      if (!isFirebaseMode) {
        const allWeeks = await storage.getWeekProgress(userId);
        const allCompleted = allWeeks.length > 0 && allWeeks.every(w => w.status === "completed");
        
        if (!allCompleted) {
          return res.status(400).json({ message: "Not all weeks are completed yet", type: "incomplete" });
        }
      }

      const filePath = await generateCertificate({
        userId,
        userName,
        planName,
        completedAt: new Date()
      });

      const certificate = await storage.createCertificate({
        userId,
        planName,
        completedAt: new Date(),
        filePath
      });

      res.json(certificate);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/certificates", async (req, res) => {
    try {
      const userId = req.query.userId as string || "demo-user";
      const certificates = await storage.getUserCertificates(userId);
      res.json(certificates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/certificates/download/:fileName", async (req, res) => {
    try {
      const fileName = req.params.fileName;
      const filePath = join(process.cwd(), 'attached_assets', 'certificates', fileName);
      res.download(filePath);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
