# CertGenix Homepage Design Guidelines

## Design Approach: Modern EdTech SaaS
**Reference-based approach** drawing inspiration from leading platforms like Coursera, Udemy, and Linear's clean aesthetic. The design emphasizes trust, professionalism, and technological sophistication to appeal to career-focused professionals.

## Core Design Elements

### A. Color Palette

**Primary Colors (from logo):**
- Deep Blue: 217 91% 35% (primary brand, headers, CTAs)
- Vibrant Teal: 174 65% 45% (accents, highlights, success states)
- Soft Gray: 220 15% 96% (backgrounds, light mode)

**Dark Mode:**
- Background: 222 47% 11% (deep navy-black)
- Surface: 217 35% 18% (cards, sections)
- Text Primary: 0 0% 98%
- Text Secondary: 220 15% 70%

**Light Mode:**
- Background: 0 0% 100%
- Surface: 220 15% 96%
- Text Primary: 222 47% 11%
- Text Secondary: 220 15% 40%

**Semantic Colors:**
- Success (certification ready): 142 76% 36%
- Warning (practice needed): 38 92% 50%
- Accent: 174 65% 45% (sparingly for key highlights)

### B. Typography

**Font Families:**
- Headlines: 'Inter', system-ui, sans-serif (bold, 600-800 weight)
- Body: 'Inter', system-ui, sans-serif (regular, 400-500 weight)
- Special/Numbers: 'Space Grotesk' for confidence scores and metrics

**Scale:**
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Headers: text-3xl md:text-4xl lg:text-5xl, font-semibold
- Sub-headlines: text-xl md:text-2xl, font-medium
- Body: text-base md:text-lg, leading-relaxed
- Small Text: text-sm, text-muted-foreground

### C. Layout System

**Spacing Primitives:** Use tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Section Padding: py-16 md:py-24 lg:py-32
- Container Max-Width: max-w-7xl mx-auto px-4 md:px-6 lg:px-8
- Card Spacing: p-6 md:p-8
- Element Gaps: gap-4, gap-6, gap-8, gap-12

**Grid Strategy:**
- Hero: Single column, centered content
- 3-Step Explainer: grid-cols-1 md:grid-cols-3 gap-8
- Benefits: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Testimonials: grid-cols-1 md:grid-cols-3 gap-6

### D. Component Library

**Navigation:**
- Sticky header with blur backdrop (backdrop-blur-lg bg-background/80)
- Logo left, navigation center/right
- Desktop: horizontal nav, Mobile: hamburger menu
- CTA button in header: primary color, rounded-full, px-6 py-2.5

**Hero Section:**
- Large hero image showing professional using laptop/studying (80vh minimum)
- Overlay gradient: from-background/95 to-background/70
- Logo prominently displayed
- Headline: gradient text effect (from-blue to-teal)
- Sub-headline: max-w-3xl, centered
- Certification badges row: flex wrap, grayscale icons with color on hover
- Primary CTA: Large button with icon, secondary outline button

**Feature Cards (Benefits):**
- Rounded-xl borders with subtle shadow
- Icon area: 48px circle with gradient background
- Title: text-xl font-semibold
- Description: text-muted-foreground
- Hover: subtle lift effect (transform translate-y-1)

**Step Cards (Explainer):**
- Numbered badges: Large circular numbers with gradient
- Connecting lines between steps (hidden on mobile)
- Icon + Title + Description layout
- Background: subtle surface color

**Testimonial Cards:**
- Quote marks as decorative element
- Avatar placeholder: 48px circle
- Name + Role typography hierarchy
- Card with border and subtle hover effect

**CTA Sections:**
- Full-width colored background sections
- Centered content with max-w-4xl
- Large button combinations (primary + outline)
- Supporting text under buttons

**Beyond Exam Section:**
- Two-column layout (md:grid-cols-2)
- Icon list on left, visual/image on right
- Each feature with check icon + bold title + description

### E. Images

**Hero Section:**
- Large hero image: Professional diverse learner confidently studying on laptop/tablet, modern workspace, natural lighting. Overlay gradient for text readability.

**Beyond Exam Section:**
- Secondary image: Professional presenting/in interview or workplace scenario showing career advancement

**Benefits Section:**
- Icon set for 6 benefits (AI brain, clock, chart, globe, rocket, target)
- Use icon library for consistency

**Logo Integration:**
- Header: standard size
- Hero: large prominent placement
- Footer: medium size with tagline

### F. Interactions

**Minimal Animations:**
- Fade-in on scroll for sections (once)
- Subtle hover states on cards (shadow + transform)
- Button hover: slight scale (scale-105)
- NO auto-playing carousels or distracting motion
- Smooth scroll behavior

**Responsive Behavior:**
- Hamburger menu: slide-in from right with backdrop
- Mobile: stack all columns to single column
- Touch-friendly targets: minimum 44px tap areas
- Collapse navigation, expand CTAs on mobile

## Quality Standards

**Viewport Management:**
- Hero: 80vh with proper content hierarchy
- Sections: Natural height based on content (py-16 to py-32)
- No forced 100vh sections except hero
- Consistent vertical rhythm throughout

**Professional Polish:**
- Consistent border-radius: rounded-lg for cards, rounded-full for buttons
- Shadow hierarchy: subtle shadows, stronger on hover
- Proper contrast ratios (WCAG AA minimum)
- Loading states for interactive elements
- Focus states for keyboard navigation

**Content Enrichment:**
- Header: Include trust indicator ("Trusted by 10,000+ learners")
- Footer: Newsletter signup, social links, quick nav, certification logos
- CTA sections: Supporting copy, visual elements, multiple entry points
- Every section purposeful and complete