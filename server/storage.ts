import { type User, type InsertUser, type Question, type InsertQuestion, type Session, type InsertSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getQuestion(id: string): Promise<Question | undefined>;
  getQuestionsByDomains(domains: string[], status?: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  createQuestions(questions: InsertQuestion[]): Promise<Question[]>;
  
  getSession(id: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  getUserSessions(userId: string): Promise<Session[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questions: Map<string, Question>;
  private sessions: Map<string, Session>;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.sessions = new Map();
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
}

export const storage = new MemStorage();
