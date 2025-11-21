# CertGenix - AI-Powered Certification Exam Platform

## Overview
CertGenix is an EdTech SaaS platform designed to help professionals prepare for certification exams (PMP, CISSP, CCSP, CISM, etc.) through AI-powered personalized study plans. The platform features a diagnostic assessment to tailor learning paths based on individual strengths, weaknesses, timelines, and backgrounds, adapting in real-time to performance. It includes a modern, marketing-focused homepage, a multi-step diagnostic flow for customized study plans, and a comprehensive exam simulator. The project aims to provide a professional, trustworthy, and effective learning experience, drawing design inspiration from leading platforms.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The frontend is built with React 18 and TypeScript, using Vite for development. Wouter handles client-side routing, defining paths for the homepage, diagnostic flow, exam simulator configuration, active exams, and results. UI components leverage Radix UI primitives with shadcn/ui styling, employing a "new-york" style variant and Tailwind CSS for a consistent design system. State management is primarily handled by TanStack Query for server state and local React state for UI interactions. Form handling uses React Hook Form with Zod validation. Framer Motion is used for animations, particularly in the diagnostic flow. The design system features Deep Blue and Vibrant Teal as primary colors, Inter and Space Grotesk for typography, and a consistent spacing scale.

**Authentication & Protected Routes**: Firebase Authentication is integrated for user authentication. A ProtectedRoute component wraps all dashboard, study plan, and simulator routes to ensure only authenticated users can access them. Unauthenticated users attempting to access protected routes (e.g., `/dashboard/all-weeks`, `/study-plan-results`, `/simulator/*`) are automatically redirected to the home page. The protection system displays a loading spinner while checking authentication state and preserves wouter's route context for pages that use `useRoute()` and `useParams()` hooks.

### Backend
The backend is an Express.js server on Node.js with TypeScript, providing a RESTful API. Key API endpoints manage exam sessions, question retrieval, grading, submission, and progress tracking. Progress tracking endpoints include: POST `/api/progress/initialize` (initialize user progress), GET `/api/progress/weeks` (fetch all week progress), GET `/api/progress/weeks/:weekNumber` (fetch specific week with day details), PATCH `/api/progress/weeks/:weekNumber` (update week progress), PATCH `/api/progress/weeks/:weekNumber/days/:dayIndex` (update day progress), and GET `/api/progress/current` (get current unlocked week/day). Development features include request/response logging, error handling, and CORS support. The system is designed for PostgreSQL via Drizzle ORM, currently utilizing an in-memory storage solution (`MemStorage`) with a flexible `IStorage` interface for future database integration. The build process uses Vite for the frontend and esbuild for the backend, resulting in a single production entry point.

### Database Schema
Drizzle ORM is used with a PostgreSQL dialect, connected to Neon Database. The schema includes tables for `Users`, `Diagnostics` (certification, timeline, weekly hours, weaknesses, background), `Questions` (qid, certification, domain, difficulty, type, question, options, correct answers, explanation, references), `Exam Sessions` (certification, domains, questionCount, mode, timer settings, status, question IDs, user answers, score), `Week Progress` (userId, weekNumber, status, totalDays, completedDays, startedAt, completedAt), and `Day Progress` (userId, weekNumber, dayIndex, status, completedActivities, completedAt). Progress status uses an enum (locked/available/completed) to drive UI gating and unlocking logic. Zod schemas are generated from Drizzle tables for runtime type checking, and Drizzle Kit manages schema migrations.

### UI/UX Decisions
The platform features a modern, marketing-focused homepage. The diagnostic flow uses a scrolling multi-step design where questions appear sequentially, stacking vertically as answered, allowing users to scroll and re-edit previous responses. A sticky summary card on desktop provides real-time progress updates. 

**Transition Screen**: After completing the diagnostic and clicking "Generate My Plan", users experience a 30-40 second data-driven transition screen (35 seconds total) with 6 sequential steps displayed within the application (header and footer remain visible): (1) Profile Analysis (6s) - displays user's certification, knowledge level, learning style, and weekly hours; (2) AI Pattern Matching (7s) - compares with 850-1500 successful students with progress indicators; (3) Content Curation (7s) - shows animated counters for study modules, videos, practice questions, and activities with certification-specific numbers; (4) Timeline Construction (6s) - displays 5 fixed phase bars (Foundation Building, Core Concepts, Advanced Topics, Practice & Review, Final Prep) with week ranges based on weekly commitment; (5) Final Touches (5s) - configures reminders, tracking, and milestones; (6) Completion - shows loading state while Firebase Cloud Function generates the personalized study plan (up to 5 minutes), then displays success confirmation before navigating to results. All data is dynamically pulled from user responses with defensive fallbacks for missing values.

**Firebase Cloud Function Integration**: Upon completion of the last diagnostic question or when clicking "Generate My Plan", the application calls a Firebase Cloud Function at `https://generateprepplan-qn5uv54q4a-uc.a.run.app` with diagnostic form data. The function generates a detailed week-by-week study plan based on certification, knowledge level, timeline, and learning preferences. The system includes comprehensive error handling with 5-minute timeout protection, detailed console logging for debugging, and proper state management for loading, success, and error states. The response is stored in localStorage and displayed on a dedicated study plan results page.

**Study Plan Results Page**: After successful plan generation, users are redirected to `/study-plan-results` where they can view their personalized study plan. The page displays plan overview (timeline, weekly commitment, knowledge level), personalization strategy, visual timeline phases, and detailed week-by-week breakdown. Each week includes topics with key points, daily schedule with activities, learning objectives, exam tips, and self-assessment checklists. The interface uses tabbed navigation for easy exploration and allows users to navigate between weeks. The page includes error handling for corrupted localStorage data and provides a retry option if plan generation fails. A "Start Study Plan" button initializes progress tracking and navigates to the All Weeks Dashboard.

**Progress Tracking Dashboard System**: The platform features a comprehensive three-level dashboard system for tracking study progress with progressive unlocking. (1) **All Weeks Dashboard** (`/dashboard/all-weeks`) - Shows an overview of all study weeks with stats (completed weeks, days completed, total progress), timeline phases, and week cards displaying status (locked/available/completed) with progress indicators. Week 1 is always unlocked; subsequent weeks are locked with a visual overlay (backdrop blur, lock icon, and "Complete Week X to unlock" message) until the previous week is 100% completed. (2) **Weekly Dashboard** (`/dashboard/week/:weekNumber`) - Displays a detailed 7-day view for a specific week, showing daily topics, activities, and time estimates. Days are gated based on progress: only the current day is clickable (available status) until it's completed, then the next day unlocks. Includes week overview, learning objectives, and exam tips. (3) **Daily Dashboard** (`/dashboard/week/:weekNumber/day/:dayIndex`) - Shows the task checklist for the current day with activities grouped by type (reading, practice, review). Users can check off completed activities, which are persisted to the database. The page includes progress tracking, time estimates, and back navigation to the weekly view. All progress data is stored in PostgreSQL via Drizzle ORM or Firebase (depending on authentication state), with React Query managing state and cache invalidation. The system uses a status enum (locked/available/completed) to drive progressive unlocking logic in both localStorage and Firebase data sources.

The exam simulator features a progressive disclosure design for configuration, allowing quick starts or detailed customization. The exam interface includes real-time timers, pause/resume functionality, and clear navigation. The results page provides a comprehensive breakdown of scores and question review. Accessibility features include a customization dialog for font size and high-contrast mode, robust keyboard navigation, and screen reader support with ARIA labels and semantic HTML.

## External Dependencies

### Database
- **Neon Database**: PostgreSQL-compatible serverless database.
- `@neondatabase/serverless`: Driver for Neon Database connection.

### UI Component Libraries
- **Radix UI**: Primitive components for accessibility.
- **shadcn/ui**: Pre-styled Radix components.
- **Lucide React**: Icon library.
- **cmdk**: Command palette component.
- **embla-carousel-react**: Carousel functionality.

### Utilities
- `clsx` + `tailwind-merge`: For dynamic CSS class management.
- `date-fns`: For date manipulation.
- `nanoid`: For unique ID generation.
- `class-variance-authority`: For component variant management.

### Fonts
- **Google Fonts**: Architects Daughter, DM Sans, Fira Code, Geist Mono (loaded via HTML link tags).

### External Services
- **Firebase Cloud Functions**: Used for AI-powered study plan generation. The function receives diagnostic data and returns a structured week-by-week study plan tailored to the user's certification, knowledge level, and learning preferences.

### Planned/Future Integrations (Not yet implemented)
- `connect-pg-simple`: For PostgreSQL-backed session management.
- External authentication (e.g., bcrypt/argon2).
- Email service for transactional emails.
- Payment processing (e.g., Stripe, PayPal).
- Additional AI/ML services (e.g., OpenAI, Anthropic) for adaptive learning features.