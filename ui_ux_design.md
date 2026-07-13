# HireTrack AI — Complete UI/UX Design System

> **Version:** 1.0.0
> **Date:** 2026-07-12
> **Classification:** Engineering + Design Reference
> **Status:** Approved for Development
> **Companion Documents:** [auth_design.md](./auth_design.md) · [database_design.md](./database_design.md) · [plan.md](./plan.md)

---

## Table of Contents

1. [Design System Foundations](#1-design-system-foundations)
2. [Layout Architecture](#2-layout-architecture)
3. [Topbar](#3-topbar)
4. [Sidebar](#4-sidebar)
5. [Complete Screen List](#5-complete-screen-list)
6. [Auth Screens](#6-auth-screens)
7. [Onboarding Screens](#7-onboarding-screens)
8. [Dashboard](#8-dashboard)
9. [Jobs Screens](#9-jobs-screens)
10. [Candidates Screens](#10-candidates-screens)
11. [Pipeline / Kanban Screen](#11-pipeline--kanban-screen)
12. [Interviews Screens](#12-interviews-screens)
13. [Reports & Analytics Screens](#13-reports--analytics-screens)
14. [Settings Screens](#14-settings-screens)
15. [Profile & Security Screens](#15-profile--security-screens)
16. [Public Careers Page](#16-public-careers-page)
17. [Component Library](#17-component-library)
18. [Navigation Flow](#18-navigation-flow)
19. [Loading States](#19-loading-states)
20. [Error States](#20-error-states)
21. [Empty States](#21-empty-states)
22. [Dark Mode](#22-dark-mode)
23. [Mobile Responsiveness](#23-mobile-responsiveness)

---

## 1. Design System Foundations

### 1.1 Design Philosophy

HireTrack AI follows three core design principles:

- **Clarity over density** — Every screen must communicate its primary action within 3 seconds of first glance
- **Data-forward** — Numbers, status indicators, and progress are always visible without clicks
- **Progressive disclosure** — Complex features (bulk actions, advanced filters, AI tools) are revealed on demand, not cluttering primary views

### 1.2 Color Palette

#### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `--brand-600` | `#4F46E5` | Primary actions, active nav items, links |
| `--brand-500` | `#6366F1` | Hover states, focus rings |
| `--brand-400` | `#818CF8` | Subtle accents, icons |
| `--brand-50` | `#EEF2FF` | Light backgrounds, tags, badges |
| `--brand-700` | `#4338CA` | Pressed button states |

#### Semantic Colors

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--success-600` | `#16A34A` | `#4ADE80` | Hired, active, success badges |
| `--success-50` | `#F0FDF4` | `#052E16` | Success backgrounds |
| `--warning-600` | `#D97706` | `#FCD34D` | Pending, paused, warnings |
| `--warning-50` | `#FFFBEB` | `#1C1400` | Warning backgrounds |
| `--danger-600` | `#DC2626` | `#F87171` | Rejected, errors, destructive |
| `--danger-50` | `#FEF2F2` | `#1F0000` | Error backgrounds |
| `--info-600` | `#2563EB` | `#60A5FA` | Info banners, links |
| `--info-50` | `#EFF6FF` | `#0C1A3B` | Info backgrounds |

#### Neutral Scale

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--neutral-900` | `#0F172A` | `#F8FAFC` | Primary text |
| `--neutral-700` | `#334155` | `#CBD5E1` | Secondary text |
| `--neutral-500` | `#64748B` | `#94A3B8` | Placeholder, hint text |
| `--neutral-300` | `#CBD5E1` | `#334155` | Borders |
| `--neutral-100` | `#F1F5F9` | `#1E293B` | Subtle backgrounds |
| `--neutral-50` | `#F8FAFC` | `#0F172A` | Page backgrounds |
| `--white` | `#FFFFFF` | `#1E293B` | Card surfaces |

### 1.3 Typography

| Role | Font | Weight | Size | Line Height |
|---|---|---|---|---|
| Display / Hero | Inter | 800 | 36–48px | 1.1 |
| H1 (Page title) | Inter | 700 | 28px | 1.25 |
| H2 (Section title) | Inter | 600 | 20px | 1.3 |
| H3 (Card title) | Inter | 600 | 16px | 1.4 |
| Body / Default | Inter | 400 | 14px | 1.6 |
| Body Small | Inter | 400 | 13px | 1.5 |
| Caption / Meta | Inter | 400 | 12px | 1.5 |
| Label / Overline | Inter | 500 | 11px | 1.4 (uppercase, 0.05em tracking) |
| Code / Mono | JetBrains Mono | 400 | 13px | 1.5 |
| Number / Stat | Inter | 700 | 32–40px | 1.0 |

### 1.4 Spacing System

Base unit: `4px`. All spacing values are multiples.

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128`

### 1.5 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `4px` | Badges, tags, small inputs |
| `--radius-md` | `8px` | Buttons, input fields |
| `--radius-lg` | `12px` | Cards, dropdowns |
| `--radius-xl` | `16px` | Modals, sheets |
| `--radius-2xl` | `24px` | Large panels |
| `--radius-full` | `9999px` | Avatars, pills, toggles |

### 1.6 Shadows

| Token | CSS Shadow | Usage |
|---|---|---|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | Input fields, small elements |
| `--shadow-sm` | `0 2px 4px rgba(0,0,0,0.07)` | Cards at rest |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.1)` | Cards on hover, dropdowns |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Modals, drawers |
| `--shadow-xl` | `0 16px 48px rgba(0,0,0,0.16)` | Command palette, elevated modals |
| `--shadow-brand` | `0 4px 16px rgba(79,70,229,0.3)` | Primary button hover glow |

### 1.7 Motion & Animation

| Scenario | Duration | Easing |
|---|---|---|
| Micro (button press) | 80ms | `ease-out` |
| Default (modal, tooltip) | 150ms | `ease-out` |
| Enter animation (page, panel) | 200ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Exit animation | 120ms | `ease-in` |
| Skeleton shimmer | 1.5s | `linear`, looping |
| Progress bar | 400ms | `ease-in-out` |
| Toast slide-in | 300ms | Spring (`cubic-bezier(0.34, 1.56, 0.64, 1)`) |

---

## 2. Layout Architecture

### 2.1 App Shell

The app uses a **fixed sidebar + fixed topbar + scrollable main content** layout:

```
┌──────────────────────────────────────────────────────────────────┐
│                         TOPBAR (64px)                            │
├─────────────┬────────────────────────────────────────────────────┤
│             │                                                    │
│  SIDEBAR    │              MAIN CONTENT AREA                     │
│  (240px)    │         (scrollable, full remaining height)        │
│             │                                                    │
│             │                                                    │
│             │                                                    │
│             │                                                    │
│             │                                                    │
│             │                                                    │
└─────────────┴────────────────────────────────────────────────────┘
```

### 2.2 Breakpoints

| Name | Min Width | Layout Behavior |
|---|---|---|
| `xs` | 0px | Mobile: topbar only, sidebar hidden (drawer) |
| `sm` | 640px | Mobile: topbar only, sidebar as drawer |
| `md` | 768px | Tablet: sidebar collapses to icon rail (64px) |
| `lg` | 1024px | Desktop: full sidebar (240px) |
| `xl` | 1280px | Desktop: full sidebar + wider content |
| `2xl` | 1536px | Desktop: full sidebar + max-width container |

### 2.3 Content Widths

| Context | Max Width |
|---|---|
| Full-width (Kanban, tables) | `100%` with padding |
| Standard page (most screens) | `1200px` |
| Narrow (settings, profile) | `768px` |
| Auth pages | `480px` form, centered |
| Public careers page | `1100px` |

### 2.4 Page Anatomy

Every internal page follows this structure:

```
[Topbar — fixed, 64px tall]
[Sidebar — fixed, 240px wide]

[Main Content]
  ├── [Page Header] — 56px tall
  │     ├── Page title (H1)
  │     ├── Breadcrumb (if nested)
  │     ├── Description / subtitle (optional)
  │     └── Page-level actions (buttons, right-aligned)
  │
  ├── [Filter / Search Bar] — conditional, 56px
  │
  └── [Content Body]
        └── [Cards / Tables / Kanban / Forms]
```

---

## 3. Topbar

### 3.1 Structure

The topbar is 64px tall, fixed, full-width, sits above the sidebar.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [≡ Logo]   [Org Switcher ▼]      [⌘K Search]      [🔔] [?] [Avatar ▼]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Elements (Left → Right)

**Left Zone:**
- **Sidebar toggle button** — hamburger icon on mobile/tablet, hidden on desktop
- **HireTrack AI logo** — SVG logomark (stylized "H" with gradient) + wordmark "HireTrack AI". Clicking goes to dashboard.

**Center-Left Zone:**
- **Organization Switcher** — Displays current org logo (24px avatar) + org name. Clicking opens a dropdown:
  - List of all user's orgs (name, plan badge, role)
  - "Create new organization" at the bottom
  - Keyboard shortcut `⌘ Shift O`

**Center Zone:**
- **Global Search Bar** — 320px wide on desktop. Shows placeholder "Search candidates, jobs, interviews... ⌘K". On click/keypress opens the Command Palette overlay.

**Right Zone (left to right):**
- **Notification bell** — Badge shows unread count (capped at "9+"). On click, opens notification panel (240px right-anchored drawer).
- **Help button** — `?` icon. Opens contextual help panel or links to docs.
- **User Avatar** — 32px circular avatar. Shows initials if no photo. On click, opens user menu dropdown:
  - User name + email (non-interactive header)
  - "Profile Settings"
  - "Security & Sessions"
  - "Keyboard Shortcuts"
  - Separator
  - "Switch to Dark Mode" toggle
  - Separator
  - "Log out"

### 3.3 Command Palette

Activated by `⌘K` (Mac) / `Ctrl+K` (Windows). Full-screen overlay with centered modal (640px wide):

```
┌────────────────────────────────────────────────────────┐
│  🔍  Search HireTrack AI...                    [Esc]   │
├────────────────────────────────────────────────────────┤
│  RECENT                                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  👤  Alex Johnson — Sr. Engineer (Apple)         │  │
│  │  💼  Senior Backend Engineer — Engineering       │  │
│  │  📅  Interview: Alex J. — System Design          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  QUICK ACTIONS                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  ✚  Add new candidate                    ⌘N      │  │
│  │  ✚  Create job requisition               ⌘J      │  │
│  │  📅  Schedule interview                  ⌘I      │  │
│  │  📧  Send email to candidate             ⌘E      │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

- Results update instantly as user types
- Categories: Candidates, Jobs, Interviews, Pages, Actions
- Arrow keys to navigate, Enter to select, Esc to close
- Shows 5 results per category, "See all results →" link at bottom

---

## 4. Sidebar

### 4.1 Structure

240px wide on desktop, fixed, full-height. Collapses to 64px icon rail on `md` breakpoint. Hidden on mobile (drawer overlay).

```
┌──────────────────┐
│ [Org logo + name]│  ← 56px org header
├──────────────────┤
│                  │
│  MAIN NAVIGATION │
│                  │
│  ■ Dashboard     │
│  ■ Jobs          │  ← With badge: open count
│  ■ Candidates    │  ← With badge: new today
│  ■ Pipeline      │
│  ■ Interviews    │  ← With badge: today's count
│  ■ Reports       │
│                  │
├──────────────────┤
│  QUICK FILTERS   │
│                  │
│  My Open Jobs    │
│  My Interviews   │
│  My Candidates   │
│                  │
├──────────────────┤
│  SETTINGS        │
│                  │
│  Organization    │
│  Team Members    │
│  Billing         │
│  Integrations    │
│                  │
├──────────────────┤
│  [User avatar]   │  ← 56px footer
│  Name            │
│  role badge      │
└──────────────────┘
```

### 4.2 Navigation Item Anatomy

Each nav item is 40px tall, with:
- 16px left padding
- Icon (20px, `--neutral-500` default, `--brand-600` active)
- Label text (14px, medium weight, `--neutral-700` default, `--neutral-900` active)
- Badge (right-aligned, small pill) — for counts and notifications
- Active state: `--brand-50` background, `--brand-600` text + icon, 3px left border in `--brand-600`
- Hover state: `--neutral-100` background (100ms transition)

### 4.3 Collapsed Icon Rail (768px–1024px)

- Shows only icons, no labels
- Active item: icon in `--brand-600` with `--brand-50` circular background
- Hover: tooltip appears to the right showing label
- All badges remain visible as dots on icon corners

### 4.4 Mobile Drawer

- Slides in from left (200ms)
- Full sidebar content (240px wide)
- Dark overlay behind (50% opacity)
- Tap overlay or swipe left to close

---

## 5. Complete Screen List

### Auth Screens (Public)
1. Login
2. Register
3. Forgot Password
4. Reset Password
5. Email Verification (pending state)
6. Email Verified (success state)
7. MFA Verification
8. Org Selection (multi-org users)
9. Invitation Accept

### Onboarding Screens
10. Welcome / Create or Join Org
11. Create Organization
12. Invite Team Members
13. Configure First Pipeline
14. Onboarding Complete

### Core App Screens
15. Dashboard (Executive Overview)
16. Jobs List
17. Create Job (Step 1: Details)
18. Create Job (Step 2: Pipeline)
19. Create Job (Step 3: Team)
20. Create Job (Step 4: Review & Publish)
21. Job Detail
22. Job Edit
23. Candidates Pool (List View)
24. Candidates Pool (Table View)
25. Candidate Detail / Profile
26. Add Candidate (Manual)
27. Import Candidates (CSV)
28. Pipeline / Kanban Board
29. Interviews Calendar
30. Interview Detail
31. Scorecard Form
32. Scorecard View (Aggregated)

### Analytics Screens
33. Reports Overview
34. Hiring Funnel Report
35. Source Effectiveness Report
36. Time-to-Hire Report
37. Interviewer Performance Report
38. DEI Report
39. Custom Report Builder

### Settings Screens
40. Organization Settings (General)
41. Team Members (List)
42. Team Members (Invite)
43. Billing & Plans
44. Pipeline Templates
45. Email Templates
46. API Keys
47. Webhooks
48. Audit Log

### Profile Screens
49. Profile Settings
50. Security (Password, MFA, Sessions)

### Public Screens
51. Careers Page (Company Portal)
52. Job Listing (Public)
53. Application Form

### Utility Screens
54. 404 — Not Found
55. 403 — Forbidden
56. 500 — Server Error
57. Maintenance Mode
58. Account Suspended

---

## 6. Auth Screens

### 6.1 Login Screen

**URL:** `/auth/login`
**Layout:** Centered card (480px) on a full-bleed branded background

**Left Panel (hidden on mobile):** Full-height illustrated gradient panel (`--brand-600` to `#7C3AED`) showing:
- HireTrack AI logo (white version)
- Hero tagline: "Hire faster. Hire smarter."
- 3 animated feature pills floating in: "AI Resume Scoring", "Pipeline Automation", "Team Collaboration"
- Subtle particle or mesh gradient animation
- Social proof strip at bottom: "Join 2,400+ companies worldwide"

**Right Panel (the form card):**
- HireTrack AI logo (dark version), 32px, centered at top
- Heading: "Welcome back" (H1, 28px, semibold)
- Subtext: "Sign in to your HireTrack AI account" (body, `--neutral-500`)
- **Google Sign In button** — Full-width, white background, Google logo, "Continue with Google". Elevated with `--shadow-sm`. Hover lifts shadow.
- **Divider:** `─────── or ───────` in `--neutral-300`
- **Email field:** Label "Work email", placeholder "name@company.com"
- **Password field:** Label "Password", placeholder "••••••••", toggle to show/hide (eye icon, right of field)
- **"Forgot password?" link** — right-aligned below password field, `--brand-600`
- **Sign in button** — Full-width, `--brand-600` background, white text, "Sign in". Shows spinner inside button on submit.
- **"Don't have an account? Create one"** — centered below button, link in `--brand-600`
- Footer: "By signing in you agree to our Terms of Service and Privacy Policy" (12px, `--neutral-400`)

**Form States:**
- Default: all fields empty, button disabled until email + password filled
- Loading: button shows spinner, all inputs disabled
- Error (wrong credentials): red error banner above button: "Incorrect email or password. Please try again."
- Error (account locked): amber banner with lock icon: "Account temporarily locked. Try again in 12 minutes."
- Error (email not verified): info banner with mail icon: "Please verify your email. [Resend verification email]"

---

### 6.2 Register Screen

**URL:** `/auth/register`
**Layout:** Same 2-panel as login

**Form:**
- Heading: "Create your account" (H1)
- Subtext: "Start your free 14-day trial. No credit card required."
- **Google Sign Up button** — same as login
- Divider
- **Full Name field** — placeholder "Alex Rivera"
- **Work email field** — placeholder "name@company.com"
- **Password field** — with password strength meter:
  - 4-segment bar below field: gray → red → orange → yellow → green
  - Label updates: "Weak", "Fair", "Good", "Strong"
  - Requirement checklist appears on focus:
    - ✓ / ✗ At least 8 characters
    - ✓ / ✗ Uppercase letter
    - ✓ / ✗ Number or special character
- **Confirm Password field**
- **Create account button** — full width, `--brand-600`
- "Already have an account? Sign in" link

---

### 6.3 Forgot Password Screen

**URL:** `/auth/forgot-password`
**Layout:** Minimal centered card (420px), no split panel

**Card:**
- Back arrow link → `/auth/login`
- Mail icon illustration (64px, `--brand-600` colored)
- Heading: "Forgot your password?"
- Body: "Enter your email and we'll send you a reset link. The link expires in 1 hour."
- **Email field**
- **Send reset link button** — full width, `--brand-600`
- After submit (any email): Transitions to success state:
  - Green checkmark illustration
  - "Check your inbox"
  - Body: "We sent a reset link to **alex@company.com**. Check your spam folder if you don't see it."
  - "Resend email" link (disabled for 60 seconds with countdown)
  - "Back to login" link

---

### 6.4 Reset Password Screen

**URL:** `/auth/reset-password?token=...`

**States:**

**Validating token** (initial load):
- Spinner centered on page
- "Verifying your reset link..."

**Invalid/expired token:**
- Red X illustration
- "This link has expired or is invalid"
- Body: "Password reset links expire after 1 hour. Request a new one."
- "Request new reset link" button → `/auth/forgot-password`

**Valid token (form):**
- Lock icon illustration
- Heading: "Set new password"
- **New password field** (with strength meter)
- **Confirm new password field**
- **Reset password button**
- On success → redirect to `/auth/login` with success toast: "Password updated. Please sign in."

---

### 6.5 Email Verification Screen

**URL:** `/auth/verify-email`

**Pending state** (after registration):
- Full-page with envelope animation (CSS: envelope opens, letter comes out)
- Heading: "Verify your email"
- Body: "We sent a verification link to **alex@company.com**. Click the link to activate your account."
- "Open Gmail / Open Outlook" shortcut buttons (detect email provider from domain)
- "Didn't receive it?" → resend link (rate-limited, shows countdown after first send)
- "Wrong email? Back to registration" link

**Success state** (after clicking link):
- Green checkmark animation (scale-in bounce)
- Heading: "Email verified!"
- Body: "Your account is ready. Welcome to HireTrack AI."
- Auto-redirects to `/onboarding` after 2 seconds
- Manual "Go to onboarding →" button

---

### 6.6 MFA Verification Screen

**URL:** `/auth/mfa-verify`

- Shield icon with 6 dots (conveying TOTP code)
- Heading: "Two-factor authentication"
- Body: "Enter the 6-digit code from your authenticator app."
- **6-digit OTP input** — 6 individual digit boxes, auto-focus advances on each digit, paste fills all
- **Verify button** — full width, activates when 6 digits entered
- "Use a backup code instead" link → shows single-field text input for backup code
- Error: "Incorrect code. 2 attempts remaining." in red below input
- After 3 failed: show backup code form automatically

---

### 6.7 Org Selection Screen

**URL:** `/auth/select-org`

For users belonging to multiple organizations:
- Heading: "Choose a workspace"
- Subtext: "You belong to multiple organizations. Which one would you like to enter?"
- **Org cards** in a responsive grid (2 columns on desktop, 1 on mobile):
  - Org logo (48px) + name (H3) + plan badge + user's role badge
  - Member count, active jobs count
  - "Enter →" button (full card is clickable)
- "Create a new organization" link at bottom (dashed border card)

---

## 7. Onboarding Screens

**URL:** `/onboarding`
**Layout:** Centered, no sidebar. Progress indicator at top (step N of 4).

### 7.1 Step 1 — Welcome

- HireTrack AI logo
- Large heading: "Let's set up your workspace"
- Two option cards (side by side):
  - **Create organization** — briefcase icon, "I'm starting a new workspace for my company"
  - **Join with invitation** — envelope icon, "I have an invitation from my team"
- If "Create" selected → advances to Step 2
- If "Join" selected → shows invitation code field

### 7.2 Step 2 — Create Organization

**Fields:**
- Company name
- Company website (optional)
- Industry (searchable dropdown)
- Company size (segmented control: 1–10 / 11–50 / 51–200 / 201–500 / 500+)
- Logo upload (drag-and-drop zone with "Upload logo" text, preview after upload, 2MB limit)
- Timezone (searchable dropdown, auto-detected)

**Live preview panel on right:** Shows a preview of how the org card will look in the sidebar.

### 7.3 Step 3 — Invite Team

- Heading: "Invite your team"
- Subtext: "You can always invite more people later from Settings."
- Multi-email invite field: type email, press Enter to add another. Shows email chips.
- Role selector for each invite (dropdown: admin / recruiter / hiring_manager / interviewer / viewer)
- "Skip for now" link, "Send invitations →" button

### 7.4 Step 4 — Configure First Pipeline

- Heading: "Set up your first hiring pipeline"
- Shows 3 template options as cards:
  - **Standard** — Applied → Screening → Interview → Offer → Hired
  - **Technical** — Applied → Phone Screen → Technical Screen → System Design → Panel → Offer → Hired
  - **High-Volume** — Applied → AI Screen → Recruiter Screen → Interview → Offer → Hired
- Each card shows stage pills in the preview
- "Customize later" text note

### 7.5 Step 5 — Complete

- Confetti animation (subtle, branded colors)
- Heading: "You're all set, {name}! 🎉"
- 3 quick-start cards:
  - "Post your first job →"
  - "Add a candidate →"
  - "Explore the dashboard →"
- Bottom: "Take a 2-minute product tour" button (launches in-app tour)

---

## 8. Dashboard

**URL:** `/[org]/dashboard`
**Layout:** Standard app shell, full-width content

### 8.1 Page Header

- Title: "Good morning, Alex 👋" (time-sensitive greeting)
- Subtext: "Here's what's happening with your hiring today"
- Actions: "Create job" button (primary), "View reports" link

### 8.2 Dashboard Widgets

The dashboard uses a **responsive masonry / grid layout** (12-column grid, widgets span 3–6 columns).

#### Row 1 — KPI Stats Bar

4 metric cards in a row, each:
- Icon (24px, colored per metric type)
- Large number (stat typography, 36px, bold)
- Label (small, `--neutral-500`)
- Delta badge: "+12% vs last month" in green/red

| Widget | Metric | Color |
|---|---|---|
| Open Requisitions | Total count | Blue |
| Active Pipeline | Total candidates in process | Purple |
| Interviews Today | Count of today's scheduled | Amber |
| Time to Hire | Avg days (rolling 30) | Green |

#### Row 2 — Pipeline Funnel + Activity Feed

**Left (8 cols): Pipeline Funnel Visualization**
- Horizontal funnel chart showing candidate drop-off at each stage
- X-axis: stage names, Y-axis: candidate count
- Each bar has a conversion % label below it
- Hovering a bar shows: "43 candidates entered, 28 passed → 65% conversion"
- Filter dropdown: "All Jobs" or select specific job
- Time range selector: 7d / 30d / 90d / Custom

**Right (4 cols): Activity Feed**
- Heading: "Recent Activity"
- Chronological list of events (today + yesterday, grouped):
  - Avatar + name + action + time ago
  - Examples:
    - "Sarah moved **Alex Johnson** to Offer stage · 2h ago"
    - "You scheduled an interview with **Maya Patel** · 4h ago"
    - "**David Kim** submitted scorecard for Backend role · 5h ago"
  - Clicking any item deep-links to the relevant entity
- "View all activity →" link at bottom

#### Row 3 — Jobs Status + Upcoming Interviews

**Left (6 cols): Active Jobs Overview**
- Table-style list of top 5 active jobs:
  - Job title + department tag
  - Pipeline stage pills showing candidate counts per stage (mini Kanban preview)
  - "Days open" badge (turns amber at 30d, red at 60d)
  - Clicking opens the job detail page
- "View all jobs →" footer link

**Right (6 cols): Today's Interviews**
- Calendar-style list of all interviews scheduled today
- Each row:
  - Time + duration (9:00 AM · 60 min)
  - Candidate avatar + name
  - Interview type badge (Phone Screen, Technical, etc.)
  - Interviewers listed (up to 3 avatars, "+2 more" overflow)
  - Meeting link shortcut (Zoom/Meet icon, clickable)
  - "Submit scorecard" button (appears if interview time has passed)
- Empty state: "No interviews scheduled today. [Schedule one →]"

#### Row 4 — AI Insights + Source Breakdown

**Left (6 cols): AI Insights Panel**
- Heading: "AI Insights" with ✨ icon
- Background: subtle gradient `--brand-50`
- 3–4 rotating insight cards (carousel dots at bottom):
  - "⚡ 3 candidates have been in the Offer stage for 7+ days without action"
  - "📈 LinkedIn is your top source this month (38% of hires)"
  - "🔴 The Backend Engineer role has a 92% drop-off at the technical screen"
  - "✅ Your time-to-hire is 23% faster than the industry average"
- Each insight has a "Take action →" link

**Right (6 cols): Candidate Sources**
- Donut chart of candidate sources (last 30 days)
- Legend: each source with color dot, count, % of total
- Hover state on chart segments highlights the legend row
- "View full source report →" link

#### Row 5 — Team Workload

- Full-width widget
- Table showing each recruiter/hiring manager:
  - Avatar + name + role
  - Active candidates they own (number)
  - Interviews this week (number)
  - Avg response time to scorecards
  - Progress bar: workload indicator (green = normal, amber = heavy, red = overloaded)
- Helps managers spot bandwidth issues

---

## 9. Jobs Screens

### 9.1 Jobs List Screen

**URL:** `/[org]/jobs`

#### Page Header
- Title: "Jobs" with count badge "(24 open)"
- Actions: "Create Job" (primary button), "Import from CSV" (secondary), "Archived Jobs" (ghost button)

#### Filter & Search Bar

```
[Search: "Search jobs..."]  [Status ▼]  [Department ▼]  [Recruiter ▼]  [Date ▼]  [Clear filters]
```

- Search: full-text across title, department, location
- Status filter: All / Draft / Open / Paused / Closed (multi-select checkboxes in dropdown)
- Department filter: searchable list of org departments
- Recruiter filter: list of active members in recruiter+ roles
- Date filter: date range picker for creation date
- Active filters shown as removable chips above the table

#### View Toggle

Top right of content: **List view** icon (default) | **Table view** icon | **Board view** icon (groups by status)

#### Jobs List (Card View)

Each job card (full width, stacked vertically):

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Engineering]  [Remote]  [Full-time]                    ● OPEN         │
│                                                                         │
│  Senior Backend Engineer                                                │
│  Engineering · Platform Team                                            │
│                                                                         │
│  ████░ Applied: 48  ████ Screening: 12  ██ Interview: 5  █ Offer: 2   │
│  [stage mini-kanban bar]                                               │
│                                                                         │
│  Sarah Chen (Recruiter) · David Kim (HM)  ·  Posted 14 days ago  ·  🔖  │
└─────────────────────────────────────────────────────────────────────────┘
```

Elements:
- Status badge (top right): pill badge in semantic color (green=Open, amber=Paused, gray=Draft, red=Closed)
- Department + Work type + Employment type tags
- Job title (H3, bold)
- Team info (department, sub-team if applicable)
- **Pipeline mini-bar:** horizontal bar segments per stage, each segment width proportional to candidate count, color-coded. Hovering shows "12 candidates in Screening"
- Footer: recruiter avatar + name, hiring manager avatar + name, days since posted, bookmark icon
- Entire card is clickable → goes to job detail

#### Jobs Table View

Sortable columns:
| # | Column | Default | Sortable |
|---|---|---|---|
| 1 | Job Title | — | ✓ |
| 2 | Department | — | ✓ |
| 3 | Status | — | ✓ |
| 4 | Candidates | Total count | ✓ |
| 5 | Stage Distribution | Mini bar | ✗ |
| 6 | Recruiter | Avatar + name | ✓ |
| 7 | Days Open | Number + color | ✓ |
| 8 | Actions | ··· menu | ✗ |

Row actions menu (`···`): View, Edit, Duplicate, Pause, Close, Archive, Delete

---

### 9.2 Create Job — 4-Step Wizard

**URL:** `/[org]/jobs/new`

**Top:** Horizontal step indicator showing 4 steps, currently completed steps are checked.

#### Step 1: Job Details

Sections on a single long-form (no pagination within step):

**Basic Information:**
- Job title field (required)
- Internal job code (optional)
- Department (searchable dropdown)
- Hiring for: count input ("1 opening" / "Multiple openings")

**Employment Details (2-col grid):**
- Employment type (Full-time / Part-time / Contract / etc.)
- Experience level (Entry / Mid / Senior / etc.)
- Work location type (Remote / Hybrid / On-site)
- Location (city/country — appears if hybrid/on-site selected)

**Job Description:**
- Rich text editor (toolbar: Bold, Italic, Bullet list, Numbered list, H2, H3, Link, Undo/Redo)
- "Generate with AI ✨" button above editor:
  - Clicking opens a side panel:
    - Pre-filled prompt with job title
    - Editable bullet points for "Key requirements"
    - "Generate description" button
    - AI-generated draft appears in a preview pane with "Use this", "Regenerate", "Dismiss" actions

**Compensation (optional, collapsible section):**
- Salary currency selector + min/max range inputs
- "Show to candidates" toggle (public or internal-only)

**Next →** button (disabled until required fields filled)

#### Step 2: Pipeline

- Heading: "Select a hiring pipeline"
- Shows the org's pipeline templates as cards (same as onboarding selection)
- "Preview pipeline" button on each card → expands to show all stages
- Option to clone + customize: "Use this and customize →" opens an inline stage editor:
  - Stage list (draggable handles, ≡ icon)
  - Each stage: name input + type selector + color picker + delete button
  - "+ Add stage" button at bottom
- "Create a new pipeline from scratch" link

#### Step 3: Hiring Team

- **Recruiter** — single-select from active members with recruiter+ role. Defaults to the current user.
- **Hiring Manager** — single-select from active members
- **Interviewers** — multi-select, searchable, shows avatars in selected list
- **Stage assignments (advanced, collapsible):** Assign specific interviewers to specific pipeline stages

#### Step 4: Review & Publish

Side-by-side preview of all job details:
- Left: summary of all settings with "Edit" links per section
- Right: a preview of how the job will look on the public careers page

**Publish options at bottom:**
- "Save as Draft" (ghost button)
- "Schedule publish" — date/time picker appears
- "Publish now" (primary, `--brand-600`)

On publish: success animation, then redirect to the new job's detail page with a success toast.

---

### 9.3 Job Detail Screen

**URL:** `/[org]/jobs/[id]`

#### Job Detail Header

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to Jobs                                                          │
│                                                                         │
│ Senior Backend Engineer                          [Edit] [···]           │
│ Engineering · Platform Team · Remote · Full-time                        │
│                                                                         │
│ ● OPEN  ·  Posted 14 days ago  ·  1 opening  ·  Senior level           │
│                                                                         │
│ Recruiter: [Sarah Chen ▾]    Hiring Manager: [David Kim ▾]             │
└─────────────────────────────────────────────────────────────────────────┘
```

`[···]` menu: Duplicate, Pause, Close, Share job link, View on careers page, Delete

#### Tab Navigation

```
[Pipeline]  [Candidates (48)]  [Job Details]  [Hiring Team]  [Activity]
```

**Pipeline tab** → Opens the Kanban board view filtered to this job (see Section 11)

**Candidates tab** → Filtered candidates list for this job with stage column

**Job Details tab:**
- Full job description (rendered HTML)
- Compensation details
- Internal notes (visible to team only)

**Hiring Team tab:**
- List of team members with roles
- "+ Add team member" button
- Can remove members (recruiter+)

**Activity tab:**
- Chronological audit log for this job
- Filter by: stage changes, comments, edits, system events

---

## 10. Candidates Screens

### 10.1 Candidates Pool (List/Table)

**URL:** `/[org]/candidates`

The master candidate database — all candidates across all jobs.

#### Filter & Search Bar

```
[🔍 Search candidates...]  [Job ▼]  [Stage ▼]  [Source ▼]  [Tags ▼]  [AI Score ▼]  [Date Added ▼]  [Filters (3) ●]
```

All filters combine (AND logic). Active filter count shown in "Filters" button badge.
"Save as view" option: saves current filter combination as a named view in sidebar.

**Saved Views (in sidebar below main nav):**
- "All Candidates" (default)
- "New This Week"
- "In Final Round"
- "Awaiting Scorecard"
- + "Create view" link

#### View Toggle

List / Table / Split (list on left, profile preview on right)

#### Candidate Cards (List View)

Each row card:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [Avatar]  Alex Johnson                        [AI: 87/100] ● Interview  │
│           Senior Backend Engineer                                        │
│           3 yrs exp · Apple, Google · Stanford CS                        │
│                                                                         │
│           🏷 "Strong React" 🏷 "Referred"    Added Jan 12 · LinkedIn    │
└──────────────────────────────────────────────────────────────────────────┘
```

Elements:
- Avatar (40px, initials fallback with color based on name hash)
- Full name (bold)
- Most recent job title + company
- Experience summary (years, key past companies, highest education)
- Tags (custom labels as colored pill badges)
- AI Score badge (right-aligned): color-coded (green ≥ 80, amber 60–79, red < 60)
- Stage badge: current pipeline stage name
- Source tag (LinkedIn icon, etc.)
- Date added

**Hover state:** Subtle shadow lift, "View profile →" appears on right

**Row selection:** Checkbox on left, appears on hover. Selecting enables bulk action bar.

#### Bulk Action Bar (appears when 1+ selected)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ✓ 12 candidates selected   [Move stage ▼]  [Send email]  [Add tag]  [Reject]  [Export]  [✕]  │
└──────────────────────────────────────────────────────────────────────────┘
```

Sticky at bottom of viewport. `✕` deselects all.

#### Candidate Table View

Sortable columns:
| Column | Type | Sortable |
|---|---|---|
| Name + Avatar | Text | ✓ |
| Current Job | Text | ✓ |
| Applied Job | Linked text | ✓ |
| Stage | Badge | ✓ |
| AI Score | Score bar | ✓ |
| Source | Icon + text | ✓ |
| Tags | Pills | ✗ |
| Date Added | Date | ✓ |
| Actions | ··· | ✗ |

---

### 10.2 Candidate Profile Screen

**URL:** `/[org]/candidates/[id]`

The richest, most detail-dense screen in the product.

#### Profile Header

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Candidates                                            [···]       │
│                                                                             │
│  [Avatar 64px]  Alex Johnson                       [Email] [Schedule] [···] │
│                 Senior Software Engineer                                    │
│                 San Francisco, CA · alex@email.com · +1 (415) 555-0123      │
│                                                                             │
│  [LinkedIn ↗]  [GitHub ↗]  [Portfolio ↗]                                   │
│                                                                             │
│  Tags: [Strong React ✕] [Referred ✕] [+ Add tag]                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Left Panel (4 cols): Static Info

**AI Summary Card:**
- ✨ AI icon + "AI Summary" header
- `--brand-50` background
- 2–3 sentence AI-generated narrative of the candidate
- AI fit score gauge (circular, 87/100)
- "Strengths:" bullet list (3 items)
- "Gaps:" bullet list (1–2 items)
- "Regenerate summary" link

**Contact & Details:**
- Email, Phone, Location, LinkedIn, GitHub
- Available from (date)
- Source: "LinkedIn — Sourced by Sarah Chen"
- Date added + who added

**Work Experience:**
- Chronological list (most recent first):
  - Company logo (if resolvable) + company name
  - Title + dates (duration auto-calculated)
  - Location
  - Description (collapsed, "Show more" if long)

**Education:**
- Institution + degree + field + year

**Skills:**
- Skill tags in pill format, grouped by category (if AI-parsed)

#### Right Panel (8 cols): Applications & Activity

**Tab Bar:**
```
[Applications (3)]  [Resume]  [Notes]  [Emails]  [Activity]
```

**Applications Tab:**

For each active application (expandable cards):

```
┌────────────────────────────────────────────────────────┐
│ Senior Backend Engineer                   ● Interview  │
│ Engineering · Posted Jan 5                             │
│                                                        │
│ Pipeline:                                              │
│ Applied → Screening → [Interview] → Offer → Hired      │
│            ↑ moved Jan 10 by Sarah Chen                │
│                                                        │
│ AI Score: 87/100  ▓▓▓▓▓▓▓▓▓░                          │
│                                                        │
│ [Move stage ▼]  [Schedule interview]  [Reject]         │
└────────────────────────────────────────────────────────┘
```

**Resume Tab:**
- PDF viewer (embedded, full height) with:
  - Page navigation (1/3, prev/next)
  - Download button
  - Zoom in/out
  - AI parse results shown in sidebar alongside resume

**Notes Tab:**
- Chronological notes from all team members
- Each note: Avatar + name + timestamp + note content (markdown rendered)
- @mentions highlighted in note text
- Add note: rich text input at bottom, "Post" button
- Note types: General / Concern / Interview Feedback / Reference Check

**Emails Tab:**
- All emails sent to this candidate from the platform
- Each email: subject, sender, sent date, open/click status (if trackable)
- "Send email" button → opens email compose modal

**Activity Tab:**
- Full audit trail: stage moves, interview scheduled, notes added, emails sent, AI actions
- Filter by type
- Infinite scroll

---

### 10.3 Add Candidate (Manual)

**URL:** `/[org]/candidates/new` (or modal from Kanban)

**Modal or Full Page (user can toggle):**

Tabs at top: "Single candidate" | "Paste LinkedIn URL" | "Import CSV"

**Single Candidate Form:**
- Full name (required)
- Email (required)
- Phone
- Job applying for (searchable dropdown, required)
- Starting pipeline stage (defaults to first stage)
- LinkedIn URL
- Resume upload (drag-and-drop, PDF/DOCX, 10MB limit):
  - After upload: spinner + "Parsing resume..." state
  - After parse: green checkmark + "Resume parsed. Fields auto-filled." + preview of filled fields
- Source selector (dropdown: LinkedIn, Referral, Direct, etc.)
- If "Referral": shows "Referred by" field (employee name input)
- Tags multi-select
- Initial note (optional textarea)
- "Add candidate" button

---

### 10.4 Import Candidates (CSV)

**URL:** `/[org]/candidates/import`

Three-step process:

**Step 1: Upload**
- Large drag-and-drop zone: "Drop your CSV file here or click to browse"
- "Download CSV template" link
- File requirements listed: max 500 rows, columns: Name, Email, Phone, LinkedIn, Job, Source, Tags

**Step 2: Map Columns**
- Table showing: CSV column header ↔ HireTrack AI field dropdown
- Required fields flagged with asterisk
- Preview of first 3 rows

**Step 3: Review & Import**
- Summary: "496 candidates ready to import, 4 skipped (duplicate emails)"
- Duplicates table showing which emails already exist
- "Start import" button
- Progress bar during import
- Result: "✓ 496 candidates imported. 2 failed. [View errors]"

---

## 11. Pipeline / Kanban Screen

**URL:** `/[org]/pipeline` (all jobs) or `/[org]/jobs/[id]` Pipeline tab (job-specific)

### 11.1 Kanban Board Layout

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ← Senior Backend Engineer     [Filter ▼]  [Sort ▼]  [AI Sort ✨]  [Bulk select]  [+]  │
├─────────┬────────────┬────────────┬─────────────┬────────────┬──────────────┬────────────┤
│  APPLIED│  SCREENING │  TECHNICAL │  INTERVIEW  │ REF. CHECK │   OFFER      │   HIRED    │
│  (48)   │    (14)    │    (9)     │    (5)      │    (2)     │    (3)       │    (1)     │
├─────────┼────────────┼────────────┼─────────────┼────────────┼──────────────┼────────────┤
│[Card 1] │[Card 1]    │[Card 1]    │[Card 1]     │[Card 1]    │[Card 1]      │[Card 1]    │
│[Card 2] │[Card 2]    │[Card 2]    │[Card 2]     │[Card 2]    │[Card 2]      │            │
│[Card 3] │[Card 3]    │[Card 3]    │[Card 3]     │            │[Card 3]      │            │
│  ...    │  ...       │  ...       │             │            │              │            │
│         │            │            │             │            │              │            │
│[Load    │            │            │             │            │              │            │
│ more]   │            │            │             │            │              │            │
└─────────┴────────────┴────────────┴─────────────┴────────────┴──────────────┴────────────┘
```

**Board features:**
- Horizontal scroll for many stages
- Each column has a fixed width (260px), fixed height, independent vertical scroll
- Column header shows stage name + count badge
- SLA indicator: column header turns amber/red if average days-in-stage exceeds SLA

### 11.2 Kanban Candidate Card

```
┌─────────────────────────────────────────┐
│  [Avatar] Alex Johnson            [···] │
│            Sr. Engineer · Google        │
│                                         │
│  AI: ▓▓▓▓▓▓▓▓░░ 82  ·  📅 Jan 14      │
│  🏷 Referred  🏷 Strong React           │
└─────────────────────────────────────────┘
```

- Avatar (32px) + name + current title + company
- AI score bar (if available)
- Date of entry to this stage
- Tags (1–2 visible, "+N more" if more)
- `···` context menu: View profile, Move to next stage, Reject, Send email, Schedule interview

**Drag behavior:**
- Pickup: card lifts with shadow, cursor becomes grabber
- Drag over column: column highlights with dashed border
- Drop: smooth animation to new position, stage transition recorded
- Invalid drop (e.g., skipping required stage): shows shake animation + "This stage requires a scorecard before moving forward"

**Dragging multiple cards:**
- Checkbox appears on hover when in "Bulk select" mode
- Select multiple → drag any one of them → all move together
- Count badge shows during drag: "Moving 3 candidates"

### 11.3 Filter Bar (on Kanban)

```
[Search within board]  [AI Score ▼]  [Source ▼]  [Recruiter ▼]  [Tag ▼]  [Days in stage ▼]
```

Filters dim non-matching cards (opacity 0.3) rather than hiding them, preserving board layout.

**"AI Sort ✨" button:**
- One-click: re-sorts each column by AI score descending
- Tooltip: "Sort all columns by AI fit score"
- Active state: button glows with brand gradient, "AI Sorted" label

---

## 12. Interviews Screens

### 12.1 Interviews Calendar

**URL:** `/[org]/interviews`

#### View Switcher (top right): Day | Week | Month (default: Week)

#### Week View Layout

```
                MON JAN 13   TUE JAN 14   WED JAN 15   THU JAN 16   FRI JAN 17
 9:00 AM        ┌────────┐
                │ Alex J.│
10:00 AM        │ Phone  │   ┌────────┐
                │ Screen │   │ Maya P.│
11:00 AM        └────────┘   │ System │
                             │ Design │
12:00 PM                     └────────┘
 1:00 PM
 2:00 PM                                  ┌────────┐
                                           │ Ravi K.│
 3:00 PM                                   │ Panel  │
                                           │ (3 hrs)│
 4:00 PM                                   └────────┘
```

- Each interview block: color-coded by type (phone=blue, video=purple, technical=amber, panel=green)
- Block shows: candidate name, interview type, interviewers (avatars, up to 3)
- Hover: expands to show full details tooltip
- Click: opens Interview Detail panel (right drawer)

**"+ Schedule Interview" button** → opens scheduling modal

#### Scheduling Modal

**Title:** "Schedule an interview"

Fields:
- Candidate (searchable, or pre-filled if coming from profile)
- Job & Stage (dropdown)
- Interview type (dropdown)
- Interview format: Video call / Phone / On-site
- If video: auto-generate link (Zoom/Meet toggle)
- Date + time picker (shows interviewer availability grids)
- Duration (30 min / 45 min / 1 hr / 1.5 hr / 2 hr / Custom)
- Interviewers (multi-select, shows availability calendar under field)

**Availability Grid:**
- Shows a visual 48-hr availability heatmap for selected interviewers
- Green = all available, amber = partial, red = conflict
- Click slot to auto-fill date+time

- Scorecard template selector (optional)
- Add note for interviewers
- "Send calendar invites" toggle (on by default)

---

### 12.2 Interview Detail Screen

Opens as a right-side drawer (480px wide) or full page.

```
┌─────────────────────────────────────────────────────────────┐
│  Interview Details                                    [✕]    │
│                                                             │
│  Alex Johnson — Technical Screen                            │
│  Senior Backend Engineer · Jan 14, 2026                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📅  Tuesday, Jan 14 · 10:00 AM – 11:00 AM            │   │
│  │ 🎥  Google Meet  [Join ↗]                            │   │
│  │ 👤  Interviewers: David Kim, Sarah Chen              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  SCORECARDS                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  David Kim      ✓ Submitted · Jan 14 2:30 PM        │   │
│  │  [View scorecard →]                                 │   │
│  │                                                     │   │
│  │  Sarah Chen     ⏳ Pending · Reminder sent           │   │
│  │  [Send reminder]                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Reschedule]  [Cancel Interview]  [View Candidate]         │
└─────────────────────────────────────────────────────────────┘
```

---

### 12.3 Scorecard Form

**URL:** `/[org]/interviews/[id]/scorecard`

Shown to the assigned interviewer after their interview.

**Header:**
- "Submit your feedback"
- Candidate name + Interview type + Date

**Scorecard Body:**

Each criterion (from the template) as its own card:
```
┌────────────────────────────────────────────────────────────┐
│  Problem Solving                                           │
│  "Assess ability to break down complex technical problems" │
│                                                            │
│  Rating:                                                   │
│  ○ Strong No   ○ No   ○ Neutral   ● Yes   ○ Strong Yes     │
│                         (radio buttons, pill style)        │
│                                                            │
│  Notes (optional):                                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [text area]                                          │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Below criteria:**
- **Overall Assessment:**
  - 5-point rating scale (colored buttons: Strong No = red, No = orange, Neutral = gray, Yes = green, Strong Yes = dark green)
  - Summary notes (required, 100 char min)
- **AI-assisted notes:** "Help me write this ✨" button → opens AI assist panel where interviewer provides bullet points and AI drafts structured notes

**Footer:**
- "Save draft" (ghost) + "Submit scorecard" (primary, disabled until all required fields filled)

---

### 12.4 Aggregated Scorecard View

**URL:** `/[org]/interviews/[id]/scorecards`

**Header:**
- "Team feedback — Alex Johnson · Technical Screen"

**Consensus Summary Card:**
- Recommendation distribution: `Strong No (0) · No (1) · Neutral (0) · Yes (2) · Strong Yes (1)`
- Visual horizontal bar showing distribution
- Average rating
- AI-generated consensus: "The team leans positive. Main concerns were around system design fundamentals." (in `--brand-50` card with ✨ icon)

**Individual Scorecards:**

Each interviewer's scorecard as collapsible card:
- Header: Avatar + name + overall rating badge + submitted date
- Criteria table: criterion name | their rating | their notes
- Full notes visible (no truncation by default)

**Conflict Highlight:**
- If two interviewers rate the same criterion significantly differently, a yellow warning banner: "⚠ Rating discrepancy on Problem Solving. David: Strong Yes, Maria: No"

**Actions:**
- "Move to next stage" (primary, green)
- "Reject candidate" (ghost, red)
- "Request more interviews" (ghost)

---

## 13. Reports & Analytics Screens

### 13.1 Reports Overview

**URL:** `/[org]/reports`

**Layout:** Report category cards in a masonry grid

```
OVERVIEW METRICS (row of 4 KPI cards — same as dashboard)

REPORTS LIBRARY
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Hiring      │  │  Source      │  │  Time-to-    │  │  DEI         │
│  Funnel      │  │  Analytics   │  │  Hire        │  │  Report      │
│              │  │              │  │              │  │              │
│  Visualize   │  │  What's      │  │  How long    │  │  Diversity   │
│  conversion  │  │  working     │  │  are roles   │  │  at each     │
│  at each     │  │  best for    │  │  taking?     │  │  stage       │
│  stage       │  │  sourcing    │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Interviewer │  │  Offer       │  │  Custom      │
│  Performance │  │  Analytics   │  │  Builder     │
│              │  │              │  │              │
│  Scorecard   │  │  Acceptance, │  │  Build your  │
│  completion  │  │  declines,   │  │  own report  │
│  and timing  │  │  comp data   │  │   ✨ AI-ready │
└──────────────┘  └──────────────┘  └──────────────┘
```

Global time period selector (top right): Last 7 days / Last 30 days / Last 90 days / Last year / Custom range

---

### 13.2 Hiring Funnel Report

**URL:** `/[org]/reports/funnel`

**Filters:**
- Job (single or multi-select or "All")
- Department
- Date range
- Source

**Visualizations:**

**Section 1: Funnel Chart**
- Vertically stacked horizontal bars, each bar represents a stage
- Width = candidate count (with label)
- Below each bar: conversion rate to next stage (arrow with %)
- Bars are interactive: clicking a stage opens a right panel showing all candidates at that stage

**Section 2: Funnel Table**
- Stage | Entered | Progressed | Dropped | Conversion | Avg Days in Stage
- Sortable, color-coded conversion column (red < 30%, amber 30–60%, green > 60%)

**Section 3: Trend Line**
- Monthly trend of total applicants vs. hires (line chart)

**Export:** CSV / PDF buttons (top right)

---

### 13.3 Custom Report Builder

**URL:** `/[org]/reports/builder`

**Layout:** Split — left sidebar (controls), right panel (live preview)

**Left Sidebar:**
- Report name input
- Data source dropdown: Candidates / Jobs / Applications / Interviews / Offers
- Metrics picker (checkboxes):
  - Count, Avg, Sum, Min, Max
- Dimensions picker (group by): Date, Stage, Source, Department, Recruiter, Job, Location
- Filters (same filter system as candidates)
- Visualization type: Bar chart / Line chart / Table / Donut chart / Number card

**Right Panel:**
- Live chart/table that updates as configuration changes
- "AI Insights ✨" button: "Generate 3 insights from this data"
- "Save report" (names and saves to Reports library)
- "Schedule delivery" (weekly/monthly email)
- "Export" (CSV/PDF)

---

## 14. Settings Screens

**URL:** `/[org]/settings/*`

All settings screens share a **secondary sidebar navigation** on the left (200px) inside the main content area:

```
Settings
├── Organization
│   ├── General
│   ├── Brand & Careers Page
│   └── Departments
├── Team
│   ├── Members
│   └── Roles & Permissions
├── Billing
│   ├── Plan & Usage
│   └── Invoices
├── Pipelines
│   └── Templates
├── Communications
│   └── Email Templates
├── Integrations
│   ├── Overview
│   ├── Slack
│   ├── Google Calendar
│   └── Zoom
├── Developer
│   ├── API Keys
│   └── Webhooks
└── Audit Log
```

---

### 14.1 Organization General Settings

**URL:** `/[org]/settings/org`

**Sections (stacked cards with "Save changes" per section):**

**Organization Profile:**
- Org name field
- Org slug (URL-friendly, with live preview: `app.hiretrack.ai/careers/acme-corp`)
- Logo upload (with cropper modal)
- Website URL
- Industry dropdown
- Company size dropdown
- Description textarea
- Timezone selector
- Default language selector

**Danger Zone (red border card at bottom):**
- "Transfer ownership" — button → modal requiring confirmation
- "Delete organization" — button → modal requiring type-to-confirm ("Type ACME CORP to confirm")

---

### 14.2 Team Members Screen

**URL:** `/[org]/settings/members`

**Header:**
- "Team Members (24)"
- "Invite member" button (primary)

**Filter bar:**
- Search by name/email
- Role filter
- Status filter (Active / Pending / Suspended)

**Members Table:**
| Column | Content |
|---|---|
| Member | Avatar + name + email |
| Role | Badge (color-coded) |
| Department | Text or "—" |
| Status | Badge: Active / Pending / Suspended |
| Last Active | Relative time |
| Actions | ··· menu |

Row `···` actions:
- Change role → shows role dropdown inline
- Assign to department
- Suspend / Reactivate
- Resend invitation (if Pending)
- Remove from organization (dangerous, confirmation modal)

**Pending invitations** shown in a separate section below active members, with "Resend" and "Cancel" per invite.

---

### 14.3 Billing & Plans Screen

**URL:** `/[org]/settings/billing`

**Current Plan Card:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Growth Plan                                    $149/month       │
│  Billed monthly · Renews Feb 12, 2027                            │
│                                                                  │
│  Usage this billing cycle:                                       │
│  Active jobs: ████████████████████░░░░ 22/25                     │
│  Team members: ████████████░░░░░░░░░░ 12/25                     │
│                                                                  │
│  [Change plan]  [Cancel subscription]                            │
└──────────────────────────────────────────────────────────────────┘
```

**Plan comparison cards** (Free / Growth / Enterprise):
- Feature list with checkmarks
- Current plan highlighted
- "Upgrade" / "Contact sales" buttons
- Annual billing toggle: shows "Save 20%" label

**Payment Method:**
- Card info (masked) + expiry
- "Update card" button → opens Stripe Elements modal

**Billing History:**
- Table: Date / Amount / Status / Invoice PDF download

---

### 14.4 Pipeline Templates Screen

**URL:** `/[org]/settings/pipelines`

**List of templates** (cards):
- Template name + stage count + jobs using it ("Used by 5 jobs")
- Stage preview (pills showing stage names)
- "Edit" + "Duplicate" + "Delete" actions

**Template editor (inline, expands card):**
- Stage list with drag handles
- Each stage: name, type, color picker, SLA days
- Automation per stage: "On enter: [send email template ▼]", "On exit: [action ▼]"
- "+ Add stage" button

---

### 14.5 Email Templates Screen

**URL:** `/[org]/settings/email-templates`

**Left:** List of template types (system templates + custom):
- Each item: template name + type badge + "Last edited" date
- "New template" button at top

**Right:** Template editor (appears when template selected):
- Template name field
- Subject line field (with variable insertion: `{candidate_name}`, `{job_title}`, etc.)
- Variable picker dropdown (inserts at cursor)
- Rich text body editor
- Preview mode toggle: shows how email will look with placeholder data
- "Send test email" button

---

### 14.6 API Keys Screen

**URL:** `/[org]/settings/api-keys`

**Table:**
| Column | Content |
|---|---|
| Name | Text (e.g., "Production Integration") |
| Key Prefix | `ht_live_abc123...` (last 8 visible) |
| Scopes | Badge list |
| Created | Date + creator |
| Last Used | Relative time or "Never" |
| Actions | Revoke (red) |

**Create new key** → modal:
- Name field
- Scopes multi-select (checkboxes: read:candidates, write:candidates, read:jobs, etc.)
- On create: one-time reveal of full key with copy button + "This key will never be shown again" warning

---

### 14.7 Audit Log Screen

**URL:** `/[org]/settings/audit-log`

**Filter bar:**
- Search: filter by actor email or resource name
- Action type multi-select (auth, candidate, job, interview, member, org, etc.)
- Actor filter (dropdown)
- Date range

**Log table:**
| Column | Content |
|---|---|
| Timestamp | Full date + time, timezone-local |
| Actor | Avatar + name + email |
| Action | Badge: color-coded by category |
| Resource | Linked entity name |
| Details | Short description |
| IP Address | Masked (full visible on hover) |
| `...` | Expand row → shows full diff JSON |

Infinite scroll (loads 50 rows at a time).
"Export as CSV" button (exports filtered results).

---

## 15. Profile & Security Screens

### 15.1 Profile Settings

**URL:** `/settings/profile`
**Layout:** Narrow (768px), no org sidebar — personal settings

Sections:
- **Avatar:** circular upload with cropper modal. "Remove photo" option.
- **Personal Info:** Full name, display name (optional), pronouns (optional)
- **Contact:** Email (with "Change email" flow: requires password + new email verification), Phone
- **Preferences:** Timezone, Language, Date format, Time format
- **Notification Preferences:** Expandable list of notification types, toggle channel per type (In-app / Email / Slack)

---

### 15.2 Security Screen

**URL:** `/settings/security`

#### Password Section
- "Last changed: 45 days ago"
- "Change password" button → inline form: current password, new password (with strength meter), confirm password

#### Two-Factor Authentication
- Status badge: "Enabled ✓" or "Not enabled"
- **Enable MFA flow (if not enabled):**
  - Step 1: Show QR code + manual code for authenticator app
  - Step 2: Enter 6-digit verification code to confirm
  - Step 3: Show 8 backup codes (copy all / download as .txt)
- **Disable MFA:** requires current password + current TOTP code

#### Active Sessions

Table:
| Column | Content |
|---|---|
| Device | Browser + OS icon + name |
| Location | City, Country flag |
| IP Address | Masked |
| Last Active | Relative time |
| Actions | "Sign out this device" |

- Current session highlighted with "This device" badge
- "Sign out all other devices" button (danger, at bottom of table)

---

## 16. Public Careers Page

**URL:** `/careers/[org-slug]`
**Layout:** No sidebar, no topbar — fully public-facing, branded to the org

### 16.1 Company Header

- Full-width hero with company banner image (if set) or gradient fallback
- Company logo (centered, 80px)
- Company name (H1, white text on hero)
- One-line description
- Website link, industry, size info

### 16.2 Jobs List

- Search bar: "Search open positions..."
- Filter pills: Department / Location / Employment Type
- Job cards:
  ```
  ┌────────────────────────────────────────────────────────────┐
  │  Senior Backend Engineer                                   │
  │  Engineering · Remote · Full-time                          │
  │  Posted 5 days ago                              [Apply →]  │
  └────────────────────────────────────────────────────────────┘
  ```

### 16.3 Job Detail Page (Public)

**URL:** `/careers/[org-slug]/jobs/[job-id]`
- Full job description (rendered HTML)
- Job metadata (employment type, location, experience level)
- Company info sidebar
- "Apply now" CTA button (sticky on scroll on mobile)

### 16.4 Application Form

**URL:** `/careers/[org-slug]/jobs/[job-id]/apply`

Sections:
- Personal info: Name, Email, Phone, LinkedIn
- Resume upload (required, PDF/DOCX, 10MB)
- Cover letter (optional, textarea)
- Custom questions (from job config, if any): short text / long text / dropdown / date
- Source question: "How did you hear about us?" (optional, dropdown)
- GDPR consent checkbox (required in applicable regions)
- "Submit application" button

Post-submit: Confirmation page:
- Animated checkmark
- "Application submitted!"
- "You'll hear from the team within 5 business days."
- "Track your application" link (if email-verified)

---

## 17. Component Library

### 17.1 Buttons

| Variant | Use Case | Style |
|---|---|---|
| Primary | Main CTA | `--brand-600` bg, white text, hover: `--brand-700` + shadow-brand |
| Secondary | Secondary actions | white bg, `--brand-600` border + text, hover: `--brand-50` bg |
| Ghost | Tertiary, inline | transparent, `--neutral-700` text, hover: `--neutral-100` bg |
| Danger | Destructive actions | `--danger-600` bg, white text (for primary danger) |
| Danger Ghost | Destructive secondary | transparent, `--danger-600` text, hover: `--danger-50` bg |

**Size variants:**
- `sm`: 32px height, 12px font, 12px horizontal padding
- `md` (default): 40px height, 14px font, 16px horizontal padding
- `lg`: 48px height, 16px font, 20px horizontal padding

**States:** Default / Hover / Active (pressed) / Disabled (40% opacity, no pointer events) / Loading (spinner replaces icon-left)

**With icon:** Icon (16px) on left or right of label, 8px gap. Icon-only buttons: equal padding all sides, tooltip on hover.

---

### 17.2 Input Fields

**Standard text input anatomy:**
- Label (above, 13px medium, `--neutral-700`)
- Optional indicator: "(Optional)" in `--neutral-400` after label
- Input box: 40px height, `--neutral-300` border, `--radius-md` corners, 12px horizontal padding
- Placeholder: `--neutral-400` color
- Right icon slot (for password toggle, search icon, etc.)
- Helper text (below, 12px, `--neutral-500`)
- Error text (below, 12px, `--danger-600`) + error icon
- Character count (if max length set, right-aligned below)

**States:** Default / Focus (2px `--brand-600` ring) / Error (2px `--danger-600` ring, red border) / Disabled (gray bg, not-allowed cursor) / Read-only (no border, gray bg)

**Variants:**
- `textarea`: multiline, resizable vertically only, min 3 rows
- `select`: custom chevron icon, searchable option (for long lists)
- `combobox`: type-to-search + create new option
- `date picker`: calendar popover, range picker variant
- `phone input`: country code flag + dial code prefix + number field
- `rich text editor`: branded toolbar (based on TipTap)
- `file upload`: drag-and-drop zone with dashed border, hover = `--brand-50` bg

---

### 17.3 Badges & Pills

**Status badges:**

| Badge | Color | Usage |
|---|---|---|
| Open | Green | Active job, active membership |
| Paused | Amber | Job on hold |
| Draft | Gray | Unpublished |
| Closed | Red-gray | Ended |
| Pending | Amber | Invitation, approval |
| Hired | Success green | Final stage |
| Rejected | Red | Disqualified |

**Role badges:** Color-coded per role (owner=purple, admin=blue, recruiter=teal, hiring_manager=amber, interviewer=green, viewer=gray)

**Plan badges:** Free=gray, Growth=blue, Enterprise=purple (with gradient)

**Count badges:** Small pill, absolute-positioned on parent (for nav items, avatar)

---

### 17.4 Cards

**Base card:** White bg, `--shadow-sm`, `--radius-lg`, 20px padding. Hover: `--shadow-md`, slight Y-translate (`translateY(-1px)`, 100ms).

**Metric card:** Colored top accent bar (4px, `--brand-600`). Large number in display font. Delta badge.

**Entity card (job, candidate):** Structured layout with defined zones (header, body, footer). Full card is clickable.

**Info card (settings):** No hover effect. "Save" button at bottom of each section.

**AI card:** `--brand-50` background, ✨ icon, slightly rounded differently to stand out.

---

### 17.5 Tables

**Standard data table:**
- Header row: `--neutral-100` bg, `--neutral-700` text, 12px uppercase, 0.05em tracking (like a label)
- Sortable columns: header has chevron icon (unsorted=dim, sorted=`--brand-600`)
- Body rows: alternating white / `--neutral-50` striping (optional, off by default)
- Row height: 52px (comfortable) or 44px (compact, user-toggleable)
- Row hover: `--neutral-50` bg
- Row selected: `--brand-50` bg, left border 3px `--brand-600`
- Cell padding: 12px vertical, 16px horizontal
- Last column: right-aligned actions (`···` button, reveals on row hover)

**Column resizing:** Drag handle at column border (visible on hover)

**Column pinning:** Right-click column header → "Pin left" / "Pin right"

---

### 17.6 Dropdowns & Menus

**Dropdown menu:**
- `--radius-lg` container, `--shadow-lg`, white bg, 4px padding inside
- Menu items: 36px height, 12px horizontal padding, 13px text
- Hover: `--neutral-100` bg
- Destructive items: `--danger-600` text
- Keyboard: arrow keys navigate, Enter selects, Esc closes
- Separator: 1px `--neutral-100` line with 4px vertical margin
- Disabled items: 40% opacity, no pointer events, no hover effect

---

### 17.7 Modals & Drawers

**Modal:**
- Backdrop: 60% black overlay, clicks to close (unless `required`)
- Container: centered, `--radius-xl`, `--shadow-xl`, white
- Widths: sm=480px / md=640px / lg=800px / full=90vw
- Header: Title + close (✕) button, always visible
- Body: scrollable if content overflows
- Footer: right-aligned actions (primary + secondary)
- Animation: scale-up from 0.96 + fade in (150ms)

**Right Drawer:**
- Slides in from right (200ms), width 480px on desktop (full-screen on mobile)
- Same backdrop behavior as modal
- Scrollable body, sticky header and footer

**Bottom Sheet (mobile only):**
- Slides up from bottom (200ms)
- Drag handle at top (32px wide pill)
- Swipe down to close

---

### 17.8 Notifications & Toasts

**Toast notifications:**
- Appear top-right (desktop) or top-center (mobile)
- Width: 360px
- Auto-dismiss: Success = 4s, Info = 6s, Error = manual dismiss only
- Stack up to 5 toasts (oldest dismisses first)
- Types: Success (green icon), Error (red), Warning (amber), Info (blue)

**Anatomy:**
- Icon (20px) + title (bold) + description (optional) + close button (✕)
- "Undo" link appears for reversible actions (e.g., "Candidate moved to Offer. [Undo]", 5-second window)

**In-app Notification Panel (bell icon):**
- Right-anchored drawer (320px)
- "Notifications" heading + "Mark all read" link
- Grouped: Today / Yesterday / Earlier
- Each notification:
  - Icon (type-specific emoji or icon)
  - Text description with bold entity names
  - Time ago label
  - Unread indicator: blue dot, `--brand-50` bg
  - Clickable → deep-links to entity
- "View all notifications →" at bottom

---

### 17.9 Avatars

| Size | Diameter | Used In |
|---|---|---|
| xs | 20px | Inline mentions, activity feed overflow |
| sm | 24px | Topbar sidebar, table rows |
| md | 32px | Kanban cards, note authors |
| lg | 40px | Candidate list cards |
| xl | 64px | Candidate profile header |

**Avatar group:** Stacked overlapping avatars (8px overlap), up to 4 shown, "+N" pill for overflow.

**Fallback:** Initials (2 letters: first + last name). Background color is deterministic per user ID (one of 8 brand-compatible colors). Text is always white.

---

### 17.10 Filters & Search

**Inline search:**
- Magnifier icon on left of input
- "Clear" (✕) button on right, appears when text entered
- Results update after 300ms debounce
- Loading indicator: spinner replaces magnifier during fetch

**Filter dropdown (standard):**
- Dropdown panel with search input at top (if > 8 options)
- Checkboxes for multi-select, radio for single-select
- Selected count badge on trigger button: "Status (2)"
- "Clear" link at bottom of dropdown
- "Apply" button (for multi-select, applies on close)

**Filter chips (active state):**
- Appear below the filter bar as a row of chips
- Each chip: label + value + ✕ to remove
- "Clear all filters" pill at end of row

**Date range filter:**
- Trigger shows "Jan 1 – Jan 31" or "Last 30 days"
- Dropdown: preset quick picks (today, yesterday, last 7d, last 30d, this month, this quarter) + custom calendar picker
- Calendar shows two months side by side (desktop)

---

### 17.11 Pagination

**Standard table pagination (bottom of table):**

```
  Showing 26 – 50 of 284 results           [← Prev]  [1]  [2]  [3]  ...  [6]  [Next →]
```

- Always shows first, last, current, and 2 adjacent pages
- `...` ellipsis for skipped ranges
- "Per page" dropdown (25 / 50 / 100) at right end

**Cursor-based (infinite scroll):**
- "Load more" button at bottom of list (after initial set)
- Auto-loads on scroll if user has loaded at least 1 "Load more"
- Loading indicator: spinner appears below last item
- "You've seen all X results" end message

---

## 18. Navigation Flow

```
UNAUTHENTICATED
    │
    ├──► /auth/login
    │         └──► /auth/register → Email verification → /onboarding
    │         └──► /auth/forgot-password → /auth/reset-password
    │         └──► Google OAuth → /onboarding (new) or /auth/select-org (existing multi-org)
    │
    └──► /careers/[slug] (public)
              └──► /careers/[slug]/jobs/[id]
                        └──► /careers/[slug]/jobs/[id]/apply

AUTHENTICATED (Single Org)
    └──► /onboarding (new users)
              └──► /[org]/dashboard

AUTHENTICATED (Multi Org)
    └──► /auth/select-org
              └──► /[org]/dashboard

MAIN APP NAVIGATION
  /[org]/dashboard
    │
    ├──► /[org]/jobs
    │         ├──► /[org]/jobs/new (wizard: 4 steps)
    │         └──► /[org]/jobs/[id]
    │                   └──► /[org]/jobs/[id] (pipeline tab → Kanban)
    │                   └──► /[org]/jobs/[id]/edit
    │
    ├──► /[org]/candidates
    │         ├──► /[org]/candidates/new
    │         ├──► /[org]/candidates/import
    │         └──► /[org]/candidates/[id]
    │
    ├──► /[org]/pipeline
    │         └──► (opens candidate profile in drawer)
    │
    ├──► /[org]/interviews
    │         └──► /[org]/interviews/[id]
    │                   └──► /[org]/interviews/[id]/scorecard
    │                   └──► /[org]/interviews/[id]/scorecards
    │
    ├──► /[org]/reports
    │         ├──► /[org]/reports/funnel
    │         ├──► /[org]/reports/source
    │         ├──► /[org]/reports/time-to-hire
    │         └──► /[org]/reports/builder
    │
    └──► /[org]/settings/*
              └──► /settings/profile
              └──► /settings/security
```

---

## 19. Loading States

### 19.1 Skeleton Screens

Used instead of spinners for full-page or large content areas. Skeletons mirror the exact shape of the content that will appear.

**Page skeleton (general):**
- Page header: one dark bar (28px, 200px wide) + one lighter bar (14px, 300px wide)
- Content area: grid of card-shaped rectangles with matching dimensions

**Candidate card skeleton:**
- Left: circle (40px)
- Right: 3 bars (100%, 60%, 40%) stacked with 8px gaps

**Table skeleton:**
- Header row: 5 bars
- 8 body rows: each with matching bar widths to real columns
- Alternating opacity on rows

**Shimmer animation:** Linear gradient slides from left to right continuously (1.5s, `ease-in-out`, looping). Light mode: white-to-silver-to-white. Dark mode: dark-to-lighter-dark-to-dark.

### 19.2 Inline Loaders

- **Button loading:** spinner icon replaces left icon (or appears center if no icon), button text changes to "Loading..." and button disabled
- **Search bar loading:** spinner in right side of input while fetching results
- **Lazy-loaded sections:** individual spinner (40px) centered in the section's bounding box

### 19.3 Progress Indicators

- **File upload progress:** horizontal progress bar below the upload zone, percent label on right
- **Import progress:** step progress bar with "Processing 234 of 496 records..."
- **AI generation:** pulsing gradient bar with animated "AI is generating..." text
- **Report export:** toast with spinner + "Preparing your export..." → changes to success + download link

---

## 20. Error States

### 20.1 Form Validation Errors

**Inline (field-level):**
- Red 2px border on the field
- Red error text below field: specific message ("Please enter a valid email address")
- Red exclamation icon on right of field
- Field label turns red

**Banner (form-level):**
- Red banner above the form's submit button
- Summarizes all errors: "Please fix 3 errors before continuing"
- Each error listed with field reference

### 20.2 API Errors (Non-Fatal)

**Toast (for actions):**
- Red toast: "Something went wrong. Please try again." with "Retry" button
- Specific: "Failed to move candidate. The stage requires a completed scorecard." (informative, longer persist)

**Inline section error:**
- Error state replaces the section content:
  - Red icon + message + "Try again" button
  - Used when a specific widget/section fails to load independently

### 20.3 Full-Page Error Screens

**404 — Not Found (`/404`):**
- Large "404" number in display font with brand gradient
- Illustration: a magnifying glass finding nothing
- Heading: "Page not found"
- Body: "The page you're looking for doesn't exist or has been moved."
- "Go to dashboard" button + "Go back" link

**403 — Forbidden:**
- Lock illustration
- Heading: "Access restricted"
- Body: "You don't have permission to view this. Contact your organization admin."
- Current user's role badge shown for context

**500 — Server Error:**
- Abstract glitch-art illustration
- Heading: "Something went wrong on our end"
- Body: "Our team has been notified. Please try again in a moment."
- "Refresh page" button
- Status page link: "Check status.hiretrack.ai"

**Account Suspended:**
- Warning shield illustration
- Heading: "Your account has been suspended"
- Body: "Contact your organization admin for details."
- "Contact support" button

**Maintenance Mode:**
- Full-page branded screen with animation
- Heading: "HireTrack AI is being upgraded"
- Body: "We'll be back in approximately 30 minutes."
- Real-time countdown timer

---

## 21. Empty States

Every list, table, and board has a designed empty state. Empty states follow a consistent anatomy:
- Illustration (64px icon or SVG graphic, on-brand)
- Heading ("No jobs yet" — concise)
- Body (1–2 lines explaining why, and what to do: "Create your first job to start tracking candidates")
- CTA button (primary action that resolves the emptiness)
- Secondary link (optional: documentation, tutorial)

### 21.1 Empty State Variations

| Screen | Illustration | Heading | Primary CTA |
|---|---|---|---|
| Jobs list | Briefcase with sparkles | "No jobs posted yet" | "Create your first job →" |
| Candidates list | Person with magnifier | "No candidates found" | "Add a candidate →" |
| Kanban board | Empty columns | "No candidates in this pipeline" | "Add candidate to pipeline →" |
| Interviews calendar | Empty calendar | "No interviews scheduled" | "Schedule an interview →" |
| Reports | Bar chart outline | "Not enough data yet" | "View your pipeline →" |
| Notifications | Bell with zzz | "You're all caught up!" | (no CTA needed) |
| Audit log | Scroll icon | "No activity recorded yet" | (no CTA) |
| Search results | Magnifier (no results) | "No results for 'alex'" | "Clear search" link |
| Filter results | Filter icon | "No matches for your filters" | "Clear filters" link |
| Notes | Pencil on paper | "No notes yet" | "Add first note →" |
| Email history | Envelope | "No emails sent yet" | "Send email →" |
| API keys | Key | "No API keys created" | "Create API key →" |

---

## 22. Dark Mode

### 22.1 Approach

HireTrack AI supports **system-preference detection** (via `prefers-color-scheme`) with a **manual override toggle** in the user menu and profile settings. The chosen preference is persisted in the user's profile.

Dark mode is not an afterthought — every component is designed with both modes simultaneously:

- **No pure blacks:** Uses `--neutral-900` (`#0F172A`) as the darkest background, not `#000000`. This prevents harsh contrast and eye strain.
- **Layered surfaces:** Background (`#0F172A`) → Card (`#1E293B`) → Elevated card (`#283548`) → Active (`#334155`). Each layer is visibly distinct.
- **Glow effects:** Brand-colored shadows become subtle glows in dark mode (e.g., primary button hover: `0 4px 20px rgba(79,70,229,0.4)`)
- **Chart colors:** Re-mapped to be equally readable on dark backgrounds (lighter, more saturated versions of semantic colors)

### 22.2 Dark Mode Color Tokens (Key Changes)

| Element | Light Mode | Dark Mode |
|---|---|---|
| Page background | `#F8FAFC` | `#0F172A` |
| Sidebar background | `#FFFFFF` | `#1E293B` |
| Card background | `#FFFFFF` | `#1E293B` |
| Elevated card | `#F1F5F9` | `#283548` |
| Primary text | `#0F172A` | `#F8FAFC` |
| Secondary text | `#334155` | `#CBD5E1` |
| Placeholder text | `#94A3B8` | `#64748B` |
| Border | `#E2E8F0` | `#334155` |
| Input background | `#FFFFFF` | `#0F172A` |
| Brand accent bg | `#EEF2FF` | `#1E1B4B` |
| Hover row | `#F8FAFC` | `#283548` |

### 22.3 Dark Mode Skeleton

Shimmer changes from white-to-silver to dark-to-slightly-lighter-dark with the same timing.

### 22.4 Code / Monospace Blocks

Syntax highlighting adapts: light mode uses a light theme (GitHub Light), dark mode uses a dark theme (Dracula or One Dark Pro-inspired).

---

## 23. Mobile Responsiveness

### 23.1 Philosophy

HireTrack AI is **desktop-first** but **mobile-functional**. Core workflows (review candidates, submit scorecards, check interview schedule, view pipeline) must work fully on mobile. Heavy creation tasks (building job requisitions, report builder) are optimized for desktop but accessible on mobile.

### 23.2 Navigation on Mobile

- Topbar: Only shows HireTrack logo (left) + notification bell + user avatar (right)
- Sidebar: Hidden. Bottom tab bar replaces it:
  ```
  [Dashboard] [Jobs] [Candidates] [Interviews] [More]
  ```
- "More" tab opens a full-screen nav sheet with all other nav items, settings links

### 23.3 Screen-Specific Mobile Adaptations

| Screen | Desktop | Mobile Adaptation |
|---|---|---|
| Dashboard | 5 widget rows | Single-column scrollable widgets, KPI row becomes 2×2 grid |
| Jobs list | Card list or table | Cards only, swipe right on card to reveal quick actions |
| Job creation | 4-step side-by-side wizard | Full-screen step-by-step, no side panels |
| Kanban board | Horizontal multi-column | Single column view, stage selector at top (tabs), swipe to move |
| Candidate profile | 2-panel layout | Tab-based single column (Info / Applications / Notes / Emails) |
| Interviews calendar | Week view grid | Day view default, week view scrollable, month as event list |
| Scorecard form | Wide single column | Same, full-screen |
| Data tables | All columns visible | Priority columns only, "More details" expander per row |
| Settings | Secondary sidebar + content | Accordion-style (tap section to expand) |
| Reports | Side-by-side charts | Stacked single column, charts full-width |
| Modals | Centered overlay | Bottom sheet (slides up from bottom) |

### 23.4 Touch Targets

All interactive elements meet WCAG 2.1 AA minimum: **44×44px** touch target. Small elements (badges, links in running text) are given additional padding via invisible touch areas.

### 23.5 Kanban on Mobile

The most complex adaptation. Mobile Kanban:
- Shows one stage at a time in full width
- Stage navigation: scrollable chip row at top showing stage names + count (e.g., `Applied (48) · Screening (14) · Technical (9)`)
- Drag-and-drop replaced by: tap card → "Move to stage" button at bottom → stage selector bottom sheet
- Cards are full-width (100%)

### 23.6 Gestures

| Gesture | Action |
|---|---|
| Swipe right on candidate card | Quick actions: Move stage / Email |
| Swipe left on candidate card | Reject (with undo) |
| Pull to refresh | Refreshes current list/board |
| Long press on card | Select mode (enables bulk actions) |
| Pinch to zoom | On resume PDF viewer |
| Swipe down on bottom sheet | Dismiss sheet |

### 23.7 Responsive Component Behavior

**Topbar search:** Collapses to a search icon on mobile. Tap → expands to full-screen search UI.

**Filter bar:** Collapsed to a single "Filters" button with active count badge. Tap → opens bottom sheet with all filters.

**Pagination:** "Load more" button only (no page numbers on mobile).

**Data tables:** Horizontal scroll with sticky first column (name/avatar). Priority columns: Name, Status, Actions.

**Modals:** Convert to bottom sheets. No centering overlays on small screens.

**Multi-step forms:** Full-screen, one section at a time, progress bar at top.

---

## Appendix A: Keyboard Shortcuts Reference

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open command palette |
| `⌘N` / `Ctrl+N` | New candidate (context-aware) |
| `⌘J` / `Ctrl+J` | New job |
| `⌘I` / `Ctrl+I` | Schedule interview |
| `⌘E` / `Ctrl+E` | Send email (from candidate profile) |
| `⌘/` / `Ctrl+/` | Open keyboard shortcuts help |
| `⌘,` / `Ctrl+,` | Open settings |
| `⌘.` / `Ctrl+.` | Switch organization |
| `Esc` | Close modal / drawer / palette |
| `J` / `K` | Navigate list items down / up (when not in input) |
| `Enter` | Open selected item |
| `D` | Toggle dark mode |
| `B` | Go to board / Kanban (from job detail) |
| `F` | Focus search / filter bar |

---

## Appendix B: Accessibility Standards

- **Color contrast:** All text meets WCAG 2.1 AA (4.5:1 for body text, 3:1 for large text and UI components)
- **Focus indicators:** Visible 2px focus ring in `--brand-600` on all interactive elements (replaces browser default)
- **Screen reader support:** All images have `alt` text; icons that carry meaning have `aria-label`; all forms have associated labels; live regions (`aria-live`) for toast notifications and dynamic content updates
- **Keyboard navigation:** All interactive elements are keyboard-accessible; logical tab order; skip-to-content link at page top
- **Reduced motion:** Respects `prefers-reduced-motion`; skeletons become static; page transitions instant; only essential motion preserved (progress bars, loading indicators)
- **Semantic HTML:** Landmark roles (`main`, `nav`, `aside`, `header`, `footer`); proper heading hierarchy per page; tables use `th`, `caption`, `scope` attributes
