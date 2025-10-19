import { type User, type InsertUser, type Question, type InsertQuestion, type Session, type InsertSession, type WeekProgress, type InsertWeekProgress, type DayProgress, type InsertDayProgress } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getQuestion(id: string): Promise<Question | undefined>;
  getQuestionsByDomains(domains: string[], status?: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  createQuestions(questions: InsertQuestion[]): Promise<Question[]>;
  clearQuestions(): Promise<void>;
  
  getSession(id: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  getUserSessions(userId: string): Promise<Session[]>;

  getWeekProgress(userId: string, weekNumber?: number): Promise<WeekProgress[]>;
  getWeekProgressById(id: string): Promise<WeekProgress | undefined>;
  createWeekProgress(weekProgress: InsertWeekProgress): Promise<WeekProgress>;
  updateWeekProgress(id: string, updates: Partial<WeekProgress>): Promise<WeekProgress | undefined>;
  initializeUserProgress(userId: string, totalWeeks: number): Promise<void>;
  
  getDayProgress(weekProgressId: string): Promise<DayProgress[]>;
  getDayProgressById(id: string): Promise<DayProgress | undefined>;
  createDayProgress(dayProgress: InsertDayProgress): Promise<DayProgress>;
  updateDayProgress(id: string, updates: Partial<DayProgress>): Promise<DayProgress | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questions: Map<string, Question>;
  private sessions: Map<string, Session>;
  private weekProgress: Map<string, WeekProgress>;
  private dayProgress: Map<string, DayProgress>;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.sessions = new Map();
    this.weekProgress = new Map();
    this.dayProgress = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getQuestion(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestionsByDomains(domains: string[], status: string = "published"): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(
      (q) => domains.includes(q.domain) && q.status === status
    );
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const now = new Date();
    const newQuestion: Question = { 
      ...question,
      status: question.status || "published",
      createdAt: now, 
      updatedAt: now 
    };
    this.questions.set(question.id, newQuestion);
    return newQuestion;
  }

  async createQuestions(questions: InsertQuestion[]): Promise<Question[]> {
    const created: Question[] = [];
    for (const q of questions) {
      const question = await this.createQuestion(q);
      created.push(question);
    }
    return created;
  }

  async clearQuestions(): Promise<void> {
    this.questions.clear();
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const now = new Date();
    const session: Session = { 
      ...insertSession,
      status: insertSession.status || "active",
      index: insertSession.index || 0,
      answers: insertSession.answers || {},
      id, 
      createdAt: now, 
      updatedAt: now,
      submittedAt: null
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updatedSession: Session = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (s) => s.userId === userId
    );
  }

  async getWeekProgress(userId: string, weekNumber?: number): Promise<WeekProgress[]> {
    const userProgress = Array.from(this.weekProgress.values()).filter(
      (wp) => wp.userId === userId
    );
    if (weekNumber !== undefined) {
      return userProgress.filter((wp) => wp.weekNumber === weekNumber);
    }
    return userProgress;
  }

  async getWeekProgressById(id: string): Promise<WeekProgress | undefined> {
    return this.weekProgress.get(id);
  }

  async createWeekProgress(insertWeekProgress: InsertWeekProgress): Promise<WeekProgress> {
    const id = randomUUID();
    const now = new Date();
    const weekProgress: WeekProgress = {
      userId: insertWeekProgress.userId,
      weekNumber: insertWeekProgress.weekNumber,
      status: insertWeekProgress.status || "locked",
      startedAt: insertWeekProgress.startedAt ?? null,
      completedAt: insertWeekProgress.completedAt ?? null,
      completedTopics: insertWeekProgress.completedTopics ?? 0,
      totalTopics: insertWeekProgress.totalTopics ?? 0,
      timeSpent: insertWeekProgress.timeSpent ?? 0,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.weekProgress.set(id, weekProgress);
    return weekProgress;
  }

  async updateWeekProgress(id: string, updates: Partial<WeekProgress>): Promise<WeekProgress | undefined> {
    const weekProgress = this.weekProgress.get(id);
    if (!weekProgress) return undefined;

    const updatedWeekProgress: WeekProgress = {
      ...weekProgress,
      ...updates,
      updatedAt: new Date(),
    };
    this.weekProgress.set(id, updatedWeekProgress);
    return updatedWeekProgress;
  }

  async initializeUserProgress(userId: string, totalWeeks: number): Promise<void> {
    const existingProgress = await this.getWeekProgress(userId);
    if (existingProgress.length > 0) return;

    for (let i = 1; i <= totalWeeks; i++) {
      const weekProgress = await this.createWeekProgress({
        userId,
        weekNumber: i,
        status: i === 1 ? "available" : "locked",
        startedAt: i === 1 ? new Date() : null,
        completedAt: null,
        completedTopics: 0,
        totalTopics: 0,
        timeSpent: 0,
      });

      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      for (let j = 0; j < days.length; j++) {
        await this.createDayProgress({
          weekProgressId: weekProgress.id,
          dayIndex: j,
          dayName: days[j],
          status: i === 1 && j === 0 ? "available" : "locked",
          unlockedAt: i === 1 && j === 0 ? new Date() : null,
          completedAt: null,
          completedActivities: [],
          timeSpent: 0,
        });
      }
    }
  }

  async getDayProgress(weekProgressId: string): Promise<DayProgress[]> {
    return Array.from(this.dayProgress.values()).filter(
      (dp) => dp.weekProgressId === weekProgressId
    );
  }

  async getDayProgressById(id: string): Promise<DayProgress | undefined> {
    return this.dayProgress.get(id);
  }

  async createDayProgress(insertDayProgress: InsertDayProgress): Promise<DayProgress> {
    const id = randomUUID();
    const now = new Date();
    const dayProgress: DayProgress = {
      weekProgressId: insertDayProgress.weekProgressId,
      dayIndex: insertDayProgress.dayIndex,
      dayName: insertDayProgress.dayName,
      status: insertDayProgress.status || "locked",
      unlockedAt: insertDayProgress.unlockedAt ?? null,
      completedAt: insertDayProgress.completedAt ?? null,
      completedActivities: insertDayProgress.completedActivities ?? [],
      timeSpent: insertDayProgress.timeSpent ?? 0,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.dayProgress.set(id, dayProgress);
    return dayProgress;
  }

  async updateDayProgress(id: string, updates: Partial<DayProgress>): Promise<DayProgress | undefined> {
    const dayProgress = this.dayProgress.get(id);
    if (!dayProgress) return undefined;

    const updatedDayProgress: DayProgress = {
      ...dayProgress,
      ...updates,
      updatedAt: new Date(),
    };
    this.dayProgress.set(id, updatedDayProgress);
    return updatedDayProgress;
  }
}

export const storage = new MemStorage();
