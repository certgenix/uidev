# CertGenix - AI-Powered Certification Exam Platform

## Overview

CertGenix is an EdTech SaaS platform that helps professionals prepare for certification exams (PMP, CISSP, CCSP, CISM, etc.) using AI-powered personalized study plans. The platform begins with a diagnostic assessment to understand each learner's strengths, weaknesses, timeline, and background, then adapts the learning path in real-time based on their performance.

The application features a modern, marketing-focused homepage that emphasizes trust and professionalism, following design patterns from leading platforms like Coursera and Udemy. It includes a multi-step diagnostic flow to collect user preferences and create customized study plans.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for lightweight client-side routing with main routes:
- `/` - Marketing homepage
- `/diagnostic` - Multi-step diagnostic assessment flow
- `/simulator` - Exam configuration page
- `/exam/:sessionId` - Active exam taking interface
- `/results/:sessionId` - Exam results with domain breakdown

**UI Components**: Radix UI primitives with shadcn/ui styling system for accessible, customizable components. The design system uses a "new-york" style variant with Tailwind CSS for styling.

**State Management**: 
- TanStack Query (React Query) for server state management and caching
- Local React state for form data and UI interactions
- No global state management library (Redux, Zustand) currently implemented

**Styling Approach**:
- Tailwind CSS with custom design tokens
- CSS variables for theming (supports light/dark modes)
- HSL color system for dynamic theme switching
- Custom spacing scale and border radius values
- Hover and active state utilities via custom CSS classes (`hover-elevate`, `active-elevate-2`)

**Form Handling**: React Hook Form with Zod validation via @hookform/resolvers for type-safe form schemas.

**Animation**: Framer Motion for page transitions and interactive elements (used in diagnostic flow).

**Design System**:
- Primary colors: Deep Blue (217 91% 35%) and Vibrant Teal (174 65% 45%)
- Typography: Inter for body/headlines, Space Grotesk for metrics
- Consistent spacing using Tailwind's 4/6/8/12/16/20/24 unit system
- Component library includes 40+ pre-built UI components (buttons, cards, forms, dialogs, etc.)

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Structure**: RESTful API with routes prefixed by `/api`. Includes:
- POST `/api/sessions` - Create new exam session
- GET `/api/sessions/:id` - Get session state
- GET `/api/sessions/:id/items` - Get paginated exam questions
- POST `/api/sessions/:id/grade` - Grade individual answer
- POST `/api/sessions/:id/pause` - Pause exam timer
- POST `/api/sessions/:id/resume` - Resume exam timer
- POST `/api/sessions/:id/submit` - Submit and score exam

**Development Features**:
- Request/response logging middleware
- Error handling middleware with status code extraction
- CORS and JSON body parsing enabled
- Vite integration in development for HMR and asset serving

**Data Storage Strategy**: 
- Designed for PostgreSQL via Drizzle ORM
- Currently implements in-memory storage (`MemStorage` class) as a temporary solution
- Storage interface (`IStorage`) abstracts CRUD operations for easy database swap
- Session management planned via `connect-pg-simple`

**Build Process**:
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- Single production entry point serves static files and API routes

### Database Schema

**ORM**: Drizzle ORM with PostgreSQL dialect, using Neon Database serverless driver.

**Schema Design** (in `shared/schema.ts`):

1. **Users Table**:
   - `id` (UUID, auto-generated)
   - `username` (unique, text)
   - `password` (text, plaintext - authentication not yet implemented)

2. **Diagnostics Table**:
   - `id` (UUID, auto-generated)
   - `certification` (text) - Selected exam (PMP, CISSP, etc.)
   - `examTimeline` (text) - When user plans to take exam
   - `weeklyHours` (text) - Available study time
   - `weaknesses` (text array) - Knowledge gaps by domain
   - `background` (text, optional) - Professional context

3. **Questions Table** (Exam Simulator):
   - `qid` (text, primary key) - Unique question identifier
   - `certification` (text) - Associated certification
   - `domain` (text) - Knowledge domain/category
   - `difficulty` (text) - Easy/Medium/Hard
   - `type` (text) - Multiple choice types
   - `question` (text) - Question text
   - `options` (JSONB array) - Answer options with IDs and text
   - `correctAnswers` (text array) - Correct option IDs
   - `explanation` (text) - Answer explanation
   - `references` (text array) - Source references

4. **Exam Sessions Table**:
   - `id` (UUID, auto-generated)
   - `certification` (text) - Exam type
   - `domains` (text array) - Selected domains
   - `questionCount` (integer) - Number of questions
   - `mode` (text) - Quiz or Exam mode
   - `timerEnabled` (boolean) - Timer on/off
   - `timerMinutes` (integer) - Timer duration
   - `status` (text) - active/paused/completed
   - `questionIds` (text array) - Selected question IDs
   - `answers` (JSONB) - User answers and grading
   - `score` (JSONB) - Overall and domain scores
   - `startedAt`, `endsAt`, `completedAt` - Timestamps

**Validation**: Zod schemas generated from Drizzle tables via `drizzle-zod` for runtime type checking.

**Migration Strategy**: Drizzle Kit configured to output migrations to `./migrations` directory with `db:push` script for schema deployment.

### External Dependencies

**Database**: 
- Neon Database (PostgreSQL-compatible serverless database)
- Connection via `@neondatabase/serverless` package
- DATABASE_URL environment variable required

**UI Component Libraries**:
- Radix UI (40+ primitive components for accessibility)
- shadcn/ui component system (pre-styled Radix components)
- Lucide React (icon library)
- cmdk (command palette component)
- embla-carousel-react (carousel functionality)

**Development Tools**:
- Replit-specific plugins: runtime error modal, cartographer, dev banner
- TypeScript with strict mode enabled
- ESLint and Prettier (implied by project structure)

**Utilities**:
- clsx + tailwind-merge via custom `cn()` utility
- date-fns for date manipulation
- nanoid for unique ID generation
- class-variance-authority for component variant management

**Session Management** (planned):
- connect-pg-simple for PostgreSQL-backed sessions
- Express session middleware (not yet configured)

**Asset Management**:
- Static images stored in `attached_assets` directory
- Imported via Vite's asset handling with @assets alias
- Includes 3D renders, logos, and marketing imagery

**Fonts**:
- Google Fonts: Architects Daughter, DM Sans, Fira Code, Geist Mono
- Loaded via HTML link tags in `client/index.html`

**No External Authentication**: Authentication system not yet implemented. Password storage is plaintext, requiring bcrypt/argon2 integration before production use.

**No Email Service**: No transactional email or notification system currently integrated.

**No Payment Processing**: No Stripe, PayPal, or other payment gateway integration present.

**No AI/ML Services**: Despite AI-powered features in the product description, no OpenAI, Anthropic, or other AI service integration exists yet. This would be a critical addition for the adaptive learning features.

## Recent Changes

### Exam Simulator Feature (October 10, 2025)

Added comprehensive Exam Simulator functionality for certification exam practice:

**Navigation**:
- Updated Header with Products dropdown menu containing "Simulator" link
- Mobile-responsive navigation with proper keyboard accessibility

**Configuration Page** (`/simulator`) - Progressive Disclosure Design:

**Step 1: Quick Start (Landing View)**
- Two-card layout for instant decision making
- Practice Quiz card: 30 questions, all domains, no timer, instant explanations
- Exam Simulation card: 100 questions, 180 minutes, all 8 domains
- Smart defaults allow users to start in 5 seconds
- "Customize" links for power users who need control

**Step 2: Customize (Optional View)**
- Collapsible domain selection (collapsed by default, showing first 3)
- Question count with +/- increment buttons (5-100 range)
- Conditional timer settings (optional for Quiz, required for Exam)
- Simplified review preferences (removed Quick Review options)
- Sticky summary box showing current configuration
- Back navigation to return to Quick Start
- Estimated completion time calculation

**Exam Taking Interface** (`/exam/:sessionId`):
- Real-time countdown timer with setInterval implementation
- Pause/Resume functionality with timer continuity
- Auto-submit when timer expires
- Question display with domain badges
- Multiple choice and checkbox question support
- Previous/Next navigation with progress tracking
- Sticky bottom navigation bar for mobile
- Error handling with toast notifications
- Optimistic UI updates with rollback on failure

**Results Page** (`/results/:sessionId`):
- Overall score percentage
- Domain-weighted scoring breakdown
- Question-by-question review
- Correct/incorrect status indicators
- Answer explanations and references
- Mobile-responsive grid layout

**Sample Data**:
- 30 CISSP sample questions imported from CSV
- Covers all 8 CISSP domains with varying difficulty levels
- Includes explanations and references for each question

**Technical Implementation**:
- In-memory storage (MemStorage) for exam sessions and questions
- Domain-weighted scoring algorithm in `server/examLogic.ts`
- Paginated question loading for performance
- Timer synchronization using endsAt timestamp
- Comprehensive error handling and user feedback