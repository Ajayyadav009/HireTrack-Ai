# HireTrack AI — Complete Software Architecture & Planning Document

> **Classification:** Full Stack Developer Technical Assessment  
> **Version:** 1.0.0  
> **Date:** 2026-07-10  
> **Author:** Engineering Architecture Team  
> **Status:** Approved for Development

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [User Personas](#4-user-personas)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Complete Feature List](#7-complete-feature-list)
8. [MVP Features](#8-mvp-features)
9. [Premium Features](#9-premium-features)
10. [Future Scope](#10-future-scope)
11. [Complete Folder Structure](#11-complete-folder-structure)
12. [Tech Stack Justification](#12-tech-stack-justification)
13. [Database Design](#13-database-design)
14. [ER Diagram](#14-er-diagram)
15. [Authentication Flow](#15-authentication-flow)
16. [Authorization Strategy](#16-authorization-strategy)
17. [API Design](#17-api-design)
18. [Server Actions Plan](#18-server-actions-plan)
19. [UI Screen List](#19-ui-screen-list)
20. [Dashboard Layout](#20-dashboard-layout)
21. [Navigation Flow](#21-navigation-flow)
22. [Validation Rules](#22-validation-rules)
23. [Error Handling Strategy](#23-error-handling-strategy)
24. [Security Checklist](#24-security-checklist)
25. [Accessibility Checklist](#25-accessibility-checklist)
26. [SEO Checklist](#26-seo-checklist)
27. [Deployment Strategy](#27-deployment-strategy)
28. [Testing Strategy](#28-testing-strategy)
29. [Git Branch Strategy](#29-git-branch-strategy)
30. [Development Milestones](#30-development-milestones)

---

## 1. Product Vision

### Mission Statement

**HireTrack AI** is an intelligent, AI-powered Applicant Tracking System (ATS) that transforms how companies attract, evaluate, and hire talent — replacing fragmented, manual hiring workflows with a single, unified platform that combines automation, predictive analytics, and collaboration at enterprise scale.

### Vision Statement

To become the most trusted hiring intelligence platform for mid-market and enterprise companies globally — where every hiring decision is faster, fairer, and data-driven.

### Core Value Proposition

| Pillar | Value Delivered |
|--------|----------------|
| **Speed** | Reduce average time-to-hire by 60% through AI screening and automated workflows |
| **Quality** | Surface top-fit candidates with AI scoring trained on role-specific signals |
| **Fairness** | Structured, bias-aware evaluation frameworks with audit trails |
| **Collaboration** | Real-time team collaboration across the entire hiring funnel |
| **Insight** | Actionable hiring analytics and forecasting dashboards |

### Strategic Positioning

HireTrack AI positions at the intersection of:
- Modern ATS (Greenhouse, Lever, Workday)
- AI Screening Tools (HireVue, Paradox)
- People Analytics (Visier, Tableau)

Targeting the **$3.2B ATS market** with a differentiated AI-first approach at SMB-friendly price points.

---

## 2. Problem Statement

### The Hiring Crisis in Numbers

- The average corporate job posting receives **250+ applications**
- Recruiters spend **23 hours** screening resumes per hire
- **75%** of candidates are rejected by ATS before a human sees them
- Average time-to-hire is **36–42 days** across industries
- Poor hires cost **1.5x to 2x** annual salary in ramp, churn, and productivity loss

### Pain Points by Stakeholder

**For HR / Talent Acquisition Teams:**
- Resume volume makes manual screening impossible at scale
- No single source of truth across job boards, email, and LinkedIn
- Lack of structured, repeatable evaluation criteria
- Poor visibility into pipeline health and bottleneck stages
- Compliance gaps — missing audit trails and EEOC reporting

**For Hiring Managers:**
- Context-switching between Slack, email, spreadsheets, and ATS
- Difficulty calibrating feedback with interviewers
- No real-time view of where candidates stand
- Interview scheduling coordination is a massive time sink

**For Candidates (Indirect Users):**
- Application black holes — no status updates
- Generic, impersonal communication
- Duplicate data entry across applications
- Inconsistent interview experiences

**For HR Leaders / CHROs:**
- No unified hiring analytics or funnel reporting
- Cannot benchmark hiring quality over time
- Hard to forecast headcount and plan pipelines proactively

---

## 3. Target Users

### Primary Markets

#### Tier 1: Mid-Market Companies (50–500 employees)
- Scaling fast, outgrowing spreadsheet-based hiring
- Have dedicated recruiters but lack enterprise tooling
- Price-sensitive but willing to pay for ROI-proven features
- **Estimated Addressable:** ~180,000 companies in North America

#### Tier 2: Enterprise Companies (500–5,000 employees)
- Complex multi-department, multi-location hiring
- Require HRIS integrations, SSO, advanced permissions
- Compliance-heavy (SOC 2, GDPR, EEOC)
- **Estimated Addressable:** ~35,000 companies in North America

#### Tier 3: Staffing & Recruiting Agencies
- High-volume, multi-client candidate management
- Need white-label and multi-workspace features
- **Estimated Addressable:** ~12,000 agencies in North America

### Excluded Markets (v1)
- Enterprise Fortune 500 (too complex, long sales cycles)
- Solo founders / freelancers (no ATS need at 1–10 employees)
- Government / public sector (regulatory complexity)

---

## 4. User Personas

### Persona 1: Rachel — The Overloaded Recruiter

| Attribute | Detail |
|-----------|--------|
| **Role** | Senior Technical Recruiter |
| **Company** | SaaS startup, ~150 employees |
| **Age** | 31 |
| **Tools Currently Using** | Greenhouse + LinkedIn Recruiter + Google Sheets |
| **Goals** | Reduce time-per-hire, build talent pipelines, hit hiring quotas |
| **Pain Points** | Drowning in unread applications; can't prioritize; no AI help |
| **Tech Comfort** | High — uses advanced LinkedIn filters, Zapier, Chrome extensions |
| **Decision Influence** | Primary user, influencer on purchase decision |
| **Key Quote** | *"I open my inbox Monday morning and there are 400 new applications. I don't even know where to start."* |

**Jobs-to-be-Done:**
1. Instantly know which candidates are worth reviewing
2. Schedule interviews without 10-email chains
3. Track every candidate's status without updating spreadsheets
4. Generate structured offer letters without manual drafting

---

### Persona 2: David — The Hiring Manager

| Attribute | Detail |
|-----------|--------|
| **Role** | VP of Engineering |
| **Company** | FinTech, ~400 employees |
| **Age** | 42 |
| **Tools Currently Using** | Slack, Notion, occasional ATS logins |
| **Goals** | Hire strong engineers fast; minimize interview cycles; protect team time |
| **Pain Points** | ATS is hard to use; feedback collection is ad-hoc; no scorecards |
| **Tech Comfort** | Medium — comfortable with SaaS tools but not ATS power-user |
| **Decision Influence** | Budget holder for departmental tools |
| **Key Quote** | *"I don't care about the ATS. I care about seeing 3 great candidates a week and closing them fast."* |

**Jobs-to-be-Done:**
1. Review shortlisted candidates in under 5 minutes
2. See interview feedback in one place immediately after interviews
3. Approve offers with one click
4. Know how long each req is taking to fill

---

### Persona 3: Sandra — The HR Director

| Attribute | Detail |
|-----------|--------|
| **Role** | Director of People Operations |
| **Company** | Healthcare tech, ~800 employees |
| **Age** | 47 |
| **Tools Currently Using** | Workday, manual EEOC reports, Excel dashboards |
| **Goals** | Reduce cost-per-hire, improve DEI metrics, ensure compliance |
| **Pain Points** | No single source of truth; can't pull consistent reports; audit risk |
| **Tech Comfort** | Medium — data-literate, not technically deep |
| **Decision Influence** | Executive sponsor, final budget sign-off |
| **Key Quote** | *"Our board asks about DEI hiring metrics every quarter and I spend a week pulling data from four different systems."* |

**Jobs-to-be-Done:**
1. Pull hiring analytics in one click
2. Track DEI funnel metrics transparently
3. Maintain full audit trail for compliance
4. Forecast pipeline capacity for headcount planning

---

### Persona 4: Marcus — The IT / Security Admin

| Attribute | Detail |
|-----------|--------|
| **Role** | Senior IT Administrator |
| **Company** | Enterprise, ~2,000 employees |
| **Age** | 38 |
| **Goals** | Ensure SSO compliance, role-based access, data security |
| **Pain Points** | Shadow IT; tools that bypass SSO; no SCIM provisioning |
| **Tech Comfort** | Very high — manages Okta, Azure AD, Terraform |
| **Decision Influence** | Must approve any new SaaS tool |
| **Key Quote** | *"If it doesn't support SAML SSO and SOC 2 Type II, it doesn't get deployed."* |

---

## 5. Functional Requirements

### FR-AUTH: Authentication & Identity

| ID | Requirement |
|----|-------------|
| FR-AUTH-01 | Users shall be able to register with email/password |
| FR-AUTH-02 | Users shall be able to sign in via Google OAuth 2.0 |
| FR-AUTH-03 | Users shall be able to sign in via GitHub OAuth 2.0 |
| FR-AUTH-04 | Password reset via secure, time-limited email token |
| FR-AUTH-05 | Multi-Factor Authentication (TOTP) for all accounts |
| FR-AUTH-06 | Session management with JWT + refresh token rotation |
| FR-AUTH-07 | SAML 2.0 SSO integration for enterprise (Premium) |
| FR-AUTH-08 | Automatic session invalidation on role/permission change |

### FR-ORG: Organization & Workspace

| ID | Requirement |
|----|-------------|
| FR-ORG-01 | An authenticated user can create an Organization (workspace) |
| FR-ORG-02 | Organization owner can invite members via email |
| FR-ORG-03 | Invited users receive email with accept/reject link |
| FR-ORG-04 | Organization supports departments and teams |
| FR-ORG-05 | Member roles: Owner, Admin, Recruiter, Hiring Manager, Interviewer, Viewer |
| FR-ORG-06 | Organization owner can transfer ownership |
| FR-ORG-07 | Organization settings: logo, name, timezone, locale |

### FR-JOB: Job Requisition Management

| ID | Requirement |
|----|-------------|
| FR-JOB-01 | Authorized users can create job requisitions with all standard fields |
| FR-JOB-02 | Jobs support a configurable hiring stage pipeline |
| FR-JOB-03 | Jobs can be assigned to a hiring team (manager + interviewers + recruiter) |
| FR-JOB-04 | Jobs support draft / open / paused / closed / archived statuses |
| FR-JOB-05 | Jobs can be posted to a public-facing careers page |
| FR-JOB-06 | Jobs can be duplicated from existing requisitions |
| FR-JOB-07 | AI can auto-generate a job description from a title and bullet points |
| FR-JOB-08 | Job approval workflow: manager to HR Director to approval |

### FR-CAND: Candidate Management

| ID | Requirement |
|----|-------------|
| FR-CAND-01 | Candidates can apply via public application form |
| FR-CAND-02 | Recruiters can manually add candidates |
| FR-CAND-03 | Candidates can be imported via CSV upload |
| FR-CAND-04 | Resume parsing extracts structured data (skills, experience, education) |
| FR-CAND-05 | Candidates can be tagged with custom labels |
| FR-CAND-06 | A candidate profile aggregates all applications, notes, and activity |
| FR-CAND-07 | AI generates a candidate summary and fit score per job |
| FR-CAND-08 | Candidate source tracking (LinkedIn, Indeed, Referral, Careers Page, etc.) |
| FR-CAND-09 | Candidates can be merged if duplicate profiles detected |
| FR-CAND-10 | Candidate GDPR deletion request workflow |

### FR-PIPELINE: Hiring Pipeline

| ID | Requirement |
|----|-------------|
| FR-PIPE-01 | Drag-and-drop Kanban board to move candidates across stages |
| FR-PIPE-02 | Stage transitions trigger configurable automated actions |
| FR-PIPE-03 | Bulk actions: move, reject, email, tag multiple candidates |
| FR-PIPE-04 | Stage-level custom evaluation forms |
| FR-PIPE-05 | Configurable disqualification reasons per stage |
| FR-PIPE-06 | Pipeline filter: by stage, score, source, date, tag, recruiter |

### FR-INTERVIEW: Interview Management

| ID | Requirement |
|----|-------------|
| FR-INT-01 | Schedule interviews with panel invites and calendar sync |
| FR-INT-02 | Support interview types: phone screen, video, on-site, technical |
| FR-INT-03 | Interviewers receive structured scorecards per interview type |
| FR-INT-04 | Interview feedback collected asynchronously |
| FR-INT-05 | Consensus view: all feedback aggregated with conflict highlighting |
| FR-INT-06 | AI summarizes interview feedback and highlights red flags |
| FR-INT-07 | Automated reminders to interviewers for pending feedback |
| FR-INT-08 | Zoom / Google Meet link auto-generation |

### FR-COMM: Communications

| ID | Requirement |
|----|-------------|
| FR-COMM-01 | Send templated emails to candidates from within the platform |
| FR-COMM-02 | Email templates support dynamic variables (name, role, date, etc.) |
| FR-COMM-03 | Bulk email to candidate segments |
| FR-COMM-04 | All candidate emails are logged in candidate timeline |
| FR-COMM-05 | Automated email triggers on stage transitions |
| FR-COMM-06 | Internal notes system with @mentions for team collaboration |
| FR-COMM-07 | Slack / Teams notification integration |

### FR-ANALYTICS: Analytics & Reporting

| ID | Requirement |
|----|-------------|
| FR-AN-01 | Executive dashboard: open reqs, pipeline volume, time-to-hire |
| FR-AN-02 | Funnel conversion rates by stage, source, job, and time period |
| FR-AN-03 | Source effectiveness report (cost-per-hire by source) |
| FR-AN-04 | DEI funnel breakdown (opt-in, anonymized) |
| FR-AN-05 | Interviewer efficiency report (feedback completion rate, decision patterns) |
| FR-AN-06 | Offer acceptance rate and decline reason analytics |
| FR-AN-07 | Custom report builder with filters and export (CSV, PDF) |
| FR-AN-08 | Scheduled report delivery via email |

### FR-AI: AI Features

| ID | Requirement |
|----|-------------|
| FR-AI-01 | AI resume screening: score candidates 1–100 against job requirements |
| FR-AI-02 | AI job description generator from role title and key requirements |
| FR-AI-03 | AI candidate profile summary (2–3 paragraph narrative) |
| FR-AI-04 | AI interview question generator by role and level |
| FR-AI-05 | AI outreach email drafting (personalized cold outreach) |
| FR-AI-06 | AI-powered similar candidate search |
| FR-AI-07 | AI red-flag detection in candidate profiles |

---

## 6. Non-Functional Requirements

### Performance

| NFR-ID | Requirement | Target |
|--------|-------------|--------|
| NFR-PERF-01 | Page load time (initial) | < 2.5s on 4G |
| NFR-PERF-02 | Time to Interactive (TTI) | < 3.5s |
| NFR-PERF-03 | API response time (p95) | < 300ms |
| NFR-PERF-04 | Database query time (p95) | < 100ms |
| NFR-PERF-05 | Resume parsing time | < 5s per resume |
| NFR-PERF-06 | AI scoring response time | < 8s per candidate |
| NFR-PERF-07 | Support 10,000 concurrent users | No degradation |
| NFR-PERF-08 | File uploads | Up to 10MB per file, < 10s |

### Scalability

| NFR-ID | Requirement |
|--------|-------------|
| NFR-SCALE-01 | Horizontally scalable API layer (stateless services) |
| NFR-SCALE-02 | Database read replicas for reporting queries |
| NFR-SCALE-03 | Background job queue for async workloads (AI, email, parsing) |
| NFR-SCALE-04 | CDN for static assets and media files |
| NFR-SCALE-05 | Multi-tenant data isolation at the application layer |

### Reliability & Availability

| NFR-ID | Requirement | Target |
|--------|-------------|--------|
| NFR-REL-01 | System uptime SLA | 99.9% (< 8.7h/year downtime) |
| NFR-REL-02 | Database backup frequency | Every 6 hours, 30-day retention |
| NFR-REL-03 | Point-in-time recovery | Within 1 hour RTO |
| NFR-REL-04 | Zero-downtime deployments | Blue/green or rolling deploys |
| NFR-REL-05 | Health check endpoints | `/health`, `/ready`, `/metrics` |

### Security

| NFR-ID | Requirement |
|--------|-------------|
| NFR-SEC-01 | All data encrypted in transit (TLS 1.3+) |
| NFR-SEC-02 | All data encrypted at rest (AES-256) |
| NFR-SEC-03 | OWASP Top 10 mitigations implemented |
| NFR-SEC-04 | SOC 2 Type II compliant controls |
| NFR-SEC-05 | GDPR / CCPA compliant data handling |
| NFR-SEC-06 | Penetration testing before GA launch |
| NFR-SEC-07 | Rate limiting on all public endpoints |
| NFR-SEC-08 | Secrets management via vault (no hardcoded secrets) |

### Maintainability

| NFR-ID | Requirement |
|--------|-------------|
| NFR-MAINT-01 | Code coverage >= 80% on critical paths |
| NFR-MAINT-02 | All public APIs documented with OpenAPI 3.1 |
| NFR-MAINT-03 | Structured logging with correlation IDs |
| NFR-MAINT-04 | Centralized error tracking (Sentry) |
| NFR-MAINT-05 | Semantic versioning for all API releases |

---

## 7. Complete Feature List

### Authentication & Account Management
- Email/password registration with email verification
- Google OAuth 2.0 sign-in
- GitHub OAuth 2.0 sign-in
- SAML 2.0 SSO (Enterprise)
- TOTP Multi-Factor Authentication
- Passkey / WebAuthn support (Future)
- Password reset via email
- Account deletion with data export
- Audit log of all account activity
- Session management (view/revoke active sessions)

### Organization & Team Management
- Multi-workspace support
- Organization profile (name, logo, timezone, industry)
- Role-based member management (6 roles)
- Department / team hierarchy
- Custom role creation (Enterprise)
- Invitation workflow with expiry
- SCIM provisioning (Enterprise)
- Usage & billing management

### Job Requisition Management
- Job creation with rich text description
- Custom field builder per job
- Job stage pipeline designer (drag-and-drop)
- Job templates library
- AI job description generator
- Job approval workflow
- Multi-location job support
- Remote / hybrid / on-site flags
- Salary range & compensation fields
- Job duplication
- Job board posting integrations (LinkedIn, Indeed, Glassdoor)
- Public careers page with company branding
- Job status management (draft/open/paused/closed/archived)
- Headcount tracking per requisition

### Candidate Profile & Management
- Rich candidate profile (personal info, resume, links, notes, tags)
- Automatic resume parsing (name, email, phone, skills, experience, education)
- AI candidate fit score (1–100) per job
- AI narrative candidate summary
- AI-detected skills and experience leveling
- Custom candidate tags
- Source attribution (UTM tracking)
- Duplicate detection and merge
- Candidate activity timeline (emails, notes, stage changes, interviews)
- Candidate documents (multiple resumes, cover letters, portfolios)
- Candidate referral tracking
- GDPR deletion workflow
- Candidate search with filters (skills, location, experience, stage, score)
- Save search as "Talent Pool" segment

### Hiring Pipeline & Workflow
- Visual Kanban pipeline board per job
- Configurable pipeline stages (per job or template)
- Drag-and-drop candidate movement
- Stage automation triggers (email sends, scorecard creation, slack alerts)
- Bulk actions (move, reject, email, tag, download)
- Rejection reason taxonomy
- Candidate pass/fail at each stage
- Pipeline velocity metrics per stage
- Hold / archive pipeline states

### Interview Scheduling & Management
- Interview scheduling with calendar integration (Google Calendar, Outlook)
- Panel interview setup (multiple interviewers)
- Interview type classification (screen, technical, culture, final)
- Auto-generated video conference links (Zoom, Meet)
- Calendar availability polling
- Structured interview scorecards (per interview type)
- Asynchronous feedback submission
- Feedback aggregation and consensus view
- AI interview question bank (by role, level, and competency)
- Interviewer conflict detection
- Feedback reminder automation
- Interview kit distribution to panel

### Candidate Communication
- In-platform email composer
- Email template library (with dynamic variables)
- AI email drafting assistant
- Bulk email to pipeline segments
- Email scheduling and send-later
- Email open / click tracking
- Automated stage-based email sequences
- Candidate SMS (Premium)
- Internal team notes with @mentions
- @mentions trigger email/Slack notifications
- Candidate portal (status page for active candidates)

### Analytics & Reporting
- Executive hiring dashboard
- Pipeline health overview
- Time-to-hire by job, department, recruiter
- Stage conversion funnel
- Source attribution report
- Cost-per-hire calculator
- Offer acceptance and decline analysis
- DEI funnel analytics (opt-in, anonymized)
- Interviewer performance metrics
- Headcount forecast vs. actuals
- Custom report builder
- Scheduled email reports
- CSV / PDF export
- Benchmark comparison (vs. industry averages)

### AI & Intelligence
- AI resume screening & scoring
- AI job description generator
- AI candidate profile summary
- AI interview question generator
- AI outreach email drafter
- AI similar candidate finder
- AI red-flag detection
- AI pipeline bottleneck predictions (Premium)
- AI offer negotiation insights (Premium)

### Administration & Settings
- Organization-level settings
- Custom fields management
- Notification preferences
- Integration management
- Billing and subscription management
- Data import / export (CSV, JSON)
- API key management
- Webhook configuration
- Audit log viewer
- Data retention policies
- GDPR compliance tools (data subject requests)

### Integrations
- HRIS: BambooHR, Workday, Rippling
- Job Boards: LinkedIn, Indeed, Glassdoor, Wellfound
- Calendar: Google Calendar, Outlook Calendar
- Video: Zoom, Google Meet
- Communication: Slack, Microsoft Teams
- Background Check: Checkr, Sterling
- E-Signature: DocuSign, HelloSign
- SSO: Okta, Azure AD, Google Workspace
- Webhooks: Custom event-driven integrations
- Public REST API + Zapier integration

---

## 8. MVP Features

The MVP targets **Tier 1 mid-market companies** and focuses on delivering the core ATS loop end-to-end.

### MVP Scope (Phase 1 — 12 weeks)

#### Must-Have (P0)

| Category | Features |
|----------|----------|
| **Auth** | Email/password + Google OAuth, email verification, password reset, org invitations |
| **Org** | Create org, invite members, 4 core roles (Owner, Admin, Recruiter, Hiring Manager) |
| **Jobs** | Create/edit/publish jobs, custom pipeline stages, careers page |
| **Candidates** | Application form, manual add, CSV import, resume parsing, candidate profile |
| **Pipeline** | Kanban board, drag-and-drop, stage transitions, rejection reasons |
| **Interviews** | Schedule interviews, scorecard submission, feedback collection |
| **Communication** | Email templates, send emails to candidates, internal notes |
| **AI** | Resume scoring, job description generator, candidate summary |
| **Analytics** | Basic hiring dashboard, pipeline funnel, time-to-hire |

#### Should-Have (P1) — End of MVP sprint if time allows
- Bulk actions on pipeline
- Email template library
- Source tracking
- Candidate tagging
- Mobile-responsive UI

#### Won't Have (MVP)
- SAML SSO
- Custom role builder
- DEI analytics
- Offer management
- Background check integrations
- Advanced AI features (red flags, bottleneck predictions)
- SMS
- Public API

---

## 9. Premium Features

### Growth Plan ($79/user/month)
- All MVP features
- AI interview question generator
- AI outreach email drafting
- AI similar candidate search
- Zoom / Google Meet auto-generation
- Slack / Teams notifications
- Google Calendar / Outlook sync
- Custom email sequences (automated drip)
- Candidate portal (status tracking)
- CSV/PDF export of reports
- Priority email support

### Enterprise Plan (Custom pricing)
- All Growth features
- SAML 2.0 SSO (Okta, Azure AD)
- SCIM user provisioning
- Custom role builder
- Advanced DEI analytics
- Offer management with e-signature (DocuSign / HelloSign)
- Background check integration (Checkr, Sterling)
- HRIS sync (BambooHR, Workday, Rippling)
- Job board integrations (LinkedIn, Indeed, Glassdoor)
- Custom report builder
- API access + Webhooks
- Dedicated Customer Success Manager
- SLA: 99.9% uptime guarantee
- SOC 2 Type II report on request
- Data residency options (US, EU)
- Onboarding and migration services

---

## 10. Future Scope

### Phase 3 (Q3–Q4 2026)
- **Candidate Relationship Management (CRM):** Passive talent pipeline with nurture sequences
- **AI Video Interview Analysis:** Transcription, sentiment, and competency scoring of async video interviews
- **Predictive Analytics:** ML model to predict offer acceptance probability, candidate ghosting risk, and time-to-hire
- **Compensation Benchmarking:** Real-time salary data integration (Levels.fyi, Radford)
- **Internal Mobility Module:** Track internal transfers and promotions alongside external hiring

### Phase 4 (2027)
- **AI Interviewer (async):** Structured AI-conducted screening calls with transcription and scoring
- **Multi-Language Support:** Full i18n for EU and APAC market expansion
- **White-Label Platform:** For staffing agencies to deploy branded ATS instances
- **Mobile Native Apps:** iOS and Android native apps for hiring managers and interviewers
- **Workforce Planning Integration:** Headcount planning linked to hiring pipeline capacity

### Research & Innovation
- **Bias Audit Engine:** Automated review of job descriptions and evaluation criteria for discriminatory language
- **Skills Graph:** AI-generated dynamic skills taxonomy for role matching
- **Candidate Experience Score:** Real-time NPS tracking from candidate interactions
- **LLM Fine-Tuning:** Domain-specific hiring model fine-tuned on company's historical data

---

## 11. Complete Folder Structure

```
hiretrack-ai/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── cd-staging.yml
│   │   ├── cd-production.yml
│   │   ├── security-scan.yml
│   │   └── stale-issue.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
│
├── apps/
│   ├── web/                           # Next.js 15 Application (App Router)
│   │   ├── public/
│   │   │   ├── fonts/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (marketing)/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── pricing/
│   │   │   │   │   ├── about/
│   │   │   │   │   ├── blog/
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   ├── forgot-password/
│   │   │   │   │   ├── reset-password/
│   │   │   │   │   ├── verify-email/
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── (app)/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── jobs/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── new/
│   │   │   │   │   │   └── [jobId]/
│   │   │   │   │   │       ├── page.tsx
│   │   │   │   │   │       ├── pipeline/
│   │   │   │   │   │       ├── candidates/
│   │   │   │   │   │       ├── interviews/
│   │   │   │   │   │       ├── analytics/
│   │   │   │   │   │       └── settings/
│   │   │   │   │   ├── candidates/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [candidateId]/
│   │   │   │   │   │       ├── page.tsx
│   │   │   │   │   │       ├── resume/
│   │   │   │   │   │       ├── timeline/
│   │   │   │   │   │       └── notes/
│   │   │   │   │   ├── interviews/
│   │   │   │   │   ├── analytics/
│   │   │   │   │   ├── settings/
│   │   │   │   │   │   ├── organization/
│   │   │   │   │   │   ├── members/
│   │   │   │   │   │   ├── roles/
│   │   │   │   │   │   ├── integrations/
│   │   │   │   │   │   ├── billing/
│   │   │   │   │   │   ├── security/
│   │   │   │   │   │   ├── notifications/
│   │   │   │   │   │   └── api-keys/
│   │   │   │   │   └── onboarding/
│   │   │   │   ├── apply/
│   │   │   │   │   └── [jobSlug]/
│   │   │   │   ├── careers/
│   │   │   │   │   └── [orgSlug]/
│   │   │   │   ├── api/
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── webhooks/
│   │   │   │   │   └── health/
│   │   │   │   ├── not-found.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── global-error.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   ├── badge.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── dialog.tsx
│   │   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   │   ├── toast.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── layout/
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   ├── topbar.tsx
│   │   │   │   │   ├── breadcrumb.tsx
│   │   │   │   │   └── command-palette.tsx
│   │   │   │   ├── features/
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── jobs/
│   │   │   │   │   ├── candidates/
│   │   │   │   │   ├── pipeline/
│   │   │   │   │   ├── interviews/
│   │   │   │   │   ├── analytics/
│   │   │   │   │   └── ai/
│   │   │   │   └── shared/
│   │   │   │       ├── data-table.tsx
│   │   │   │       ├── file-uploader.tsx
│   │   │   │       ├── rich-text-editor.tsx
│   │   │   │       ├── empty-state.tsx
│   │   │   │       └── page-header.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-auth.ts
│   │   │   │   ├── use-organization.ts
│   │   │   │   ├── use-permissions.ts
│   │   │   │   ├── use-infinite-scroll.ts
│   │   │   │   └── use-debounce.ts
│   │   │   ├── lib/
│   │   │   │   ├── api-client.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── utils.ts
│   │   │   │   ├── validations/
│   │   │   │   └── constants.ts
│   │   │   ├── providers/
│   │   │   │   ├── session-provider.tsx
│   │   │   │   ├── query-provider.tsx
│   │   │   │   └── theme-provider.tsx
│   │   │   ├── actions/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── jobs.ts
│   │   │   │   ├── candidates.ts
│   │   │   │   ├── interviews.ts
│   │   │   │   └── analytics.ts
│   │   │   ├── store/
│   │   │   │   ├── use-pipeline-store.ts
│   │   │   │   ├── use-ui-store.ts
│   │   │   │   └── use-filter-store.ts
│   │   │   └── styles/
│   │   │       ├── globals.css
│   │   │       └── themes/
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                           # Standalone NestJS API Server
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── config/
│       │   │   ├── database.config.ts
│       │   │   ├── redis.config.ts
│       │   │   ├── jwt.config.ts
│       │   │   └── storage.config.ts
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.module.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── strategies/
│       │   │   │   │   ├── jwt.strategy.ts
│       │   │   │   │   ├── google.strategy.ts
│       │   │   │   │   └── github.strategy.ts
│       │   │   │   └── guards/
│       │   │   │       ├── jwt-auth.guard.ts
│       │   │   │       └── roles.guard.ts
│       │   │   ├── organizations/
│       │   │   ├── users/
│       │   │   ├── jobs/
│       │   │   ├── candidates/
│       │   │   ├── applications/
│       │   │   ├── pipeline/
│       │   │   ├── interviews/
│       │   │   ├── scorecards/
│       │   │   ├── emails/
│       │   │   ├── notes/
│       │   │   ├── analytics/
│       │   │   ├── ai/
│       │   │   ├── storage/
│       │   │   ├── notifications/
│       │   │   └── webhooks/
│       │   ├── common/
│       │   │   ├── decorators/
│       │   │   ├── filters/
│       │   │   ├── guards/
│       │   │   ├── interceptors/
│       │   │   ├── pipes/
│       │   │   └── middleware/
│       │   ├── database/
│       │   │   ├── migrations/
│       │   │   ├── seeds/
│       │   │   └── prisma.service.ts
│       │   └── workers/
│       │       ├── resume-parser.worker.ts
│       │       ├── ai-scoring.worker.ts
│       │       ├── email.worker.ts
│       │       └── analytics.worker.ts
│       ├── test/
│       │   ├── unit/
│       │   ├── integration/
│       │   └── e2e/
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── nest-cli.json
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── types/
│   │   ├── src/
│   │   │   ├── api.types.ts
│   │   │   ├── entities.ts
│   │   │   └── enums.ts
│   │   └── package.json
│   ├── ui/
│   │   ├── src/
│   │   └── package.json
│   ├── utils/
│   │   ├── src/
│   │   └── package.json
│   └── config/
│       ├── eslint-config/
│       ├── tsconfig/
│       └── prettier-config/
│
├── infrastructure/
│   ├── terraform/
│   │   ├── environments/
│   │   │   ├── staging/
│   │   │   └── production/
│   │   ├── modules/
│   │   │   ├── vpc/
│   │   │   ├── rds/
│   │   │   ├── redis/
│   │   │   ├── ecs/
│   │   │   └── s3/
│   │   └── main.tf
│   ├── docker/
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.web
│   │   └── docker-compose.yml
│   └── k8s/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── runbooks/
│   └── adr/
│
├── scripts/
│   ├── seed-dev-data.ts
│   ├── migrate.ts
│   └── generate-openapi.ts
│
├── .env.example
├── .gitignore
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## 12. Tech Stack Justification

### Frontend

| Technology | Choice | Justification |
|-----------|--------|---------------|
| **Framework** | Next.js 15 (App Router) | Industry-standard React meta-framework. App Router enables RSC for superior performance, streaming, and co-located server logic. Vercel-maintained with excellent DX. |
| **Language** | TypeScript 5.x | Type safety is non-negotiable for production SaaS. Shared types between frontend and backend via monorepo packages. |
| **State (Server)** | TanStack Query v5 | Best-in-class for server state: caching, deduplication, optimistic updates, and background refresh. Pairs excellently with Next.js RSC. |
| **State (Client)** | Zustand | Lightweight, boilerplate-free client state for UI state (pipeline drag state, sidebar, filters). |
| **UI Primitives** | Radix UI / shadcn/ui | Unstyled, accessible primitives. shadcn/ui gives ownership of component code. Avoids vendor lock-in on component libraries. |
| **Styling** | Tailwind CSS + CSS Variables | Utility-first with design token system. Enables dark mode, theming, and tight component styling without runtime overhead. |
| **Forms** | React Hook Form + Zod | RHF for performance (uncontrolled inputs); Zod for type-safe validation shared with API layer. |
| **Animations** | Framer Motion | Production-quality declarative animations for pipeline drag, transitions, and micro-interactions. |
| **Rich Text** | Tiptap | ProseMirror-based headless editor for job descriptions, notes, and email composition. |
| **Charts** | Recharts | Composable, React-native chart library. Sufficient for MVP analytics; can swap for D3 for advanced visualizations. |
| **DnD** | dnd-kit | Accessible drag-and-drop library for pipeline Kanban board. |
| **Data Tables** | TanStack Table v8 | Headless table with sorting, filtering, pagination — pairs with custom UI layer. |

### Backend

| Technology | Choice | Justification |
|-----------|--------|---------------|
| **Runtime** | Node.js 22 LTS | Stable LTS with native fetch, improved performance, and excellent ecosystem. |
| **Framework** | NestJS | Enterprise-grade Node framework with built-in DI, guards, pipes, and interceptors. Scales to large teams and enforces architecture. TypeScript-first design. |
| **ORM** | Prisma | Type-safe ORM with excellent migration tooling and DX. Auto-generated client reduces runtime errors. Supports multi-tenant patterns cleanly. |
| **Database** | PostgreSQL 16 | ACID-compliant, proven at scale, excellent for relational + JSON hybrid data. Advanced indexing for full-text search and analytics queries. |
| **Cache / Queue** | Redis 7 | Dual use: (1) rate limiting and session caching; (2) BullMQ job queue for background work. Redis Cluster for horizontal scaling. |
| **Job Queue** | BullMQ | Redis-backed job queue with retries, delays, rate limiting, and observability. Used for resume parsing, AI scoring, email sending. |
| **Authentication** | Auth.js v5 (NextAuth) + Passport.js | Auth.js for Next.js RSC integration; Passport.js on NestJS for strategy management. JWT with refresh token rotation. |
| **File Storage** | AWS S3 + CloudFront | Industry standard for object storage. Pre-signed URLs for direct browser-to-S3 uploads. CloudFront CDN for fast resume/document access. |
| **Email** | Resend + React Email | Modern email API with React-based template rendering. Better DX than SendGrid for transactional email. |
| **AI** | OpenAI API (GPT-4o) + Vercel AI SDK | GPT-4o for resume analysis, JD generation, and candidate summaries. Vercel AI SDK for streaming and structured output. Model-agnostic design. |
| **Search** | PostgreSQL Full-Text Search to Typesense (v2) | Start with pg FTS for MVP (no additional infra). Migrate to Typesense for advanced candidate search at scale. |
| **Validation** | class-validator + class-transformer (NestJS) | Pairs with NestJS DTO pattern. Zod used on Next.js side — shared schema types via package. |
| **API Docs** | Swagger / OpenAPI 3.1 | Auto-generated from NestJS decorators. Published to `/api/docs`. |

### Infrastructure & DevOps

| Technology | Choice | Justification |
|-----------|--------|---------------|
| **Monorepo** | Turborepo | Fast, caching-aware monorepo orchestrator. Co-locates web app, API, and shared packages. |
| **Package Manager** | pnpm | Faster than npm/yarn, disk-efficient with workspace support. |
| **Hosting (Web)** | Vercel | Zero-config Next.js deployment. Edge network, preview deployments per PR, excellent DX. |
| **Hosting (API)** | AWS ECS Fargate | Serverless containers — no cluster management. Auto-scaling based on CPU/memory. Ideal for NestJS. |
| **Database Hosting** | AWS RDS PostgreSQL (Multi-AZ) | Managed PostgreSQL with automated backups, read replicas, and failover. |
| **Redis Hosting** | AWS ElastiCache (Redis Cluster) | Managed Redis with auto-scaling and failover. |
| **IaC** | Terraform | Reproducible, version-controlled infrastructure for all environments. |
| **CI/CD** | GitHub Actions | Native GitHub integration. Separate pipelines for CI, staging deploy, and production deploy. |
| **Monitoring** | Datadog | APM, logs, metrics, and dashboards. Alerts on error rate spikes, latency SLO breaches. |
| **Error Tracking** | Sentry | Full-stack error tracking with release tracking and source maps. |
| **Logging** | Pino (structured JSON) | Fastest Node.js logger. Outputs structured JSON consumed by Datadog. |
| **Secrets** | AWS Secrets Manager | Centralized, encrypted secrets management. Rotated automatically. No hardcoded secrets. |
| **CDN** | AWS CloudFront | Serves static assets and pre-signed resume/document files. Caches marketing pages. |

---

## 13. Database Design

### Design Principles
1. **Multi-tenancy via `organization_id` column** — every tenant-scoped table has `organization_id` with RLS-style application filtering
2. **Soft deletes** — critical entities use `deleted_at` timestamps rather than hard deletes (compliance, audit)
3. **UUID primary keys** — UUIDs (v7, sortable) for all entities to prevent enumeration attacks
4. **Immutable audit events** — `AuditLog` table is append-only; no updates or deletes
5. **JSON fields for extensibility** — `custom_fields` JSONB column on extensible entities

### Core Tables

#### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | gen_random_uuid() |
| email | VARCHAR(255) UNIQUE NOT NULL | |
| email_verified_at | TIMESTAMPTZ | |
| password_hash | VARCHAR(255) | NULL for OAuth-only users |
| name | VARCHAR(255) NOT NULL | |
| avatar_url | TEXT | |
| timezone | VARCHAR(100) | DEFAULT 'UTC' |
| locale | VARCHAR(10) | DEFAULT 'en' |
| mfa_enabled | BOOLEAN | DEFAULT FALSE |
| mfa_secret | TEXT | encrypted TOTP secret |
| last_login_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |
| deleted_at | TIMESTAMPTZ | soft delete |

#### `oauth_accounts`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | references users(id) ON DELETE CASCADE |
| provider | VARCHAR(50) | 'google', 'github', 'saml' |
| provider_user_id | VARCHAR(255) | UNIQUE with provider |
| access_token | TEXT | encrypted |
| refresh_token | TEXT | encrypted |
| expires_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### `organizations`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | VARCHAR(255) NOT NULL | |
| slug | VARCHAR(100) UNIQUE NOT NULL | for careers page URL |
| logo_url | TEXT | |
| website | TEXT | |
| industry | VARCHAR(100) | |
| size_range | VARCHAR(50) | '1-50', '51-200', etc. |
| timezone | VARCHAR(100) | DEFAULT 'UTC' |
| plan | VARCHAR(50) | 'free', 'growth', 'enterprise' |
| plan_expires_at | TIMESTAMPTZ | |
| owner_id | UUID FK | references users(id) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |
| deleted_at | TIMESTAMPTZ | soft delete |

#### `memberships`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| organization_id | UUID FK | references organizations(id) |
| user_id | UUID FK | references users(id) |
| role | VARCHAR(50) | 'owner','admin','recruiter','hiring_manager','interviewer','viewer' |
| department_id | UUID FK | references departments(id) |
| invited_by | UUID FK | references users(id) |
| invited_at | TIMESTAMPTZ | |
| accepted_at | TIMESTAMPTZ | |
| status | VARCHAR(20) | 'pending','active','suspended' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### `jobs`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| organization_id | UUID FK | |
| department_id | UUID FK | |
| title | VARCHAR(255) NOT NULL | |
| slug | VARCHAR(255) | |
| description | TEXT | rich text HTML |
| employment_type | VARCHAR(50) | 'full_time','part_time','contract','internship' |
| work_location | VARCHAR(50) | 'remote','hybrid','on_site' |
| location | VARCHAR(255) | |
| salary_min | DECIMAL(12,2) | |
| salary_max | DECIMAL(12,2) | |
| salary_currency | CHAR(3) | DEFAULT 'USD' |
| experience_level | VARCHAR(50) | 'entry','mid','senior','staff','principal' |
| headcount | INTEGER | DEFAULT 1 |
| status | VARCHAR(50) | 'draft','open','paused','closed','archived' |
| pipeline_id | UUID FK | references pipelines(id) |
| recruiter_id | UUID FK | |
| hiring_manager_id | UUID FK | |
| published_at | TIMESTAMPTZ | |
| closes_at | TIMESTAMPTZ | |
| custom_fields | JSONB | DEFAULT '{}' |
| created_by | UUID FK | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| deleted_at | TIMESTAMPTZ | soft delete |

#### `pipeline_stages`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| pipeline_id | UUID FK | references pipelines(id) ON DELETE CASCADE |
| name | VARCHAR(255) NOT NULL | |
| type | VARCHAR(50) | 'sourced','applied','screen','interview','offer','hired','rejected' |
| position | INTEGER NOT NULL | |
| color | VARCHAR(7) | hex color |
| automation_config | JSONB | trigger actions config |
| created_at | TIMESTAMPTZ | |

#### `candidates`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| organization_id | UUID FK | |
| first_name | VARCHAR(255) NOT NULL | |
| last_name | VARCHAR(255) NOT NULL | |
| email | VARCHAR(255) NOT NULL | UNIQUE per org |
| phone | VARCHAR(50) | |
| location | VARCHAR(255) | |
| linkedin_url | TEXT | |
| github_url | TEXT | |
| portfolio_url | TEXT | |
| headline | TEXT | professional headline |
| summary | TEXT | AI-generated narrative |
| resume_url | TEXT | S3 URL |
| parsed_data | JSONB | structured resume parse output |
| skills | TEXT[] | extracted skill tags |
| experience_years | DECIMAL(4,1) | |
| source | VARCHAR(100) | 'careers_page','linkedin','indeed','referral','manual','csv' |
| source_detail | TEXT | referrer name, UTM campaign |
| tags | TEXT[] | DEFAULT '{}' |
| is_blacklisted | BOOLEAN | DEFAULT FALSE |
| gdpr_delete_requested_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| deleted_at | TIMESTAMPTZ | soft delete |

#### `applications`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| job_id | UUID FK | references jobs(id) |
| candidate_id | UUID FK | references candidates(id) |
| stage_id | UUID FK | references pipeline_stages(id) |
| status | VARCHAR(50) | 'active','rejected','withdrawn','hired' |
| ai_score | DECIMAL(5,2) | 0.00 to 100.00 |
| ai_score_breakdown | JSONB | {skills: 85, experience: 72, ...} |
| ai_summary | TEXT | AI fit narrative |
| rejection_reason | VARCHAR(255) | |
| rejection_note | TEXT | |
| applied_at | TIMESTAMPTZ | DEFAULT NOW() |
| moved_to_stage_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

#### `interviews`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| application_id | UUID FK | |
| title | VARCHAR(255) NOT NULL | |
| type | VARCHAR(50) | 'phone','video','technical','panel','on_site','culture' |
| status | VARCHAR(50) | 'scheduled','completed','cancelled','no_show' |
| scheduled_at | TIMESTAMPTZ | |
| duration_minutes | INTEGER | DEFAULT 60 |
| location | TEXT | physical or video link |
| video_link | TEXT | |
| notes | TEXT | |
| created_by | UUID FK | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

#### `scorecards`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| interview_id | UUID FK | |
| interviewer_id | UUID FK | |
| template_id | UUID FK | references scorecard_templates(id) |
| overall_rating | DECIMAL(3,1) | 1.0 to 5.0 |
| recommendation | VARCHAR(50) | 'strong_yes','yes','no','strong_no' |
| responses | JSONB | {criterion_id: {rating, notes}} |
| summary | TEXT | |
| submitted_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

#### `audit_logs`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| organization_id | UUID | |
| actor_user_id | UUID FK | |
| action | VARCHAR(100) NOT NULL | 'candidate.created', 'application.stage_moved', etc. |
| resource_type | VARCHAR(100) NOT NULL | |
| resource_id | UUID | |
| metadata | JSONB | before/after diff, context |
| ip_address | INET | |
| user_agent | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() — append-only, no UPDATE/DELETE |

#### `api_keys`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| organization_id | UUID FK | |
| name | VARCHAR(255) NOT NULL | |
| key_prefix | CHAR(8) | first 8 chars for display |
| key_hash | VARCHAR(64) | SHA-256 hash of full key |
| scopes | TEXT[] | ['candidates:read', 'jobs:write', ...] |
| last_used_at | TIMESTAMPTZ | |
| expires_at | TIMESTAMPTZ | |
| created_by | UUID FK | |
| created_at | TIMESTAMPTZ | |
| revoked_at | TIMESTAMPTZ | |

### Database Indexes

```sql
-- Tenant isolation (on every query)
CREATE INDEX idx_jobs_org ON jobs(organization_id);
CREATE INDEX idx_candidates_org ON candidates(organization_id);

-- High-frequency lookups
CREATE INDEX idx_applications_job_stage ON applications(job_id, stage_id);
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_ai_score ON applications(ai_score DESC);
CREATE INDEX idx_interviews_scheduled ON interviews(scheduled_at);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_candidates_email ON candidates(organization_id, email);

-- Full-text search
CREATE INDEX idx_candidates_fts ON candidates USING GIN(
  to_tsvector('english', coalesce(first_name,'') || ' ' || coalesce(last_name,'') || ' ' || coalesce(headline,''))
);
CREATE INDEX idx_jobs_fts ON jobs USING GIN(
  to_tsvector('english', title || ' ' || coalesce(description,''))
);

-- JSONB
CREATE INDEX idx_candidates_parsed_data ON candidates USING GIN(parsed_data);
CREATE INDEX idx_applications_score_breakdown ON applications USING GIN(ai_score_breakdown);
```

---

## 14. ER Diagram

```
users (id, email, name, password_hash, mfa_enabled, ...)
  |
  |--< oauth_accounts (id, user_id FK, provider, provider_user_id, ...)
  |
  |--< memberships (id, organization_id FK, user_id FK, role, status, ...)
        |
        v
organizations (id, name, slug, plan, owner_id FK, ...)
  |
  |--< departments (id, organization_id FK, name, parent_id FK [self], ...)
  |
  |--< pipelines (id, organization_id FK, name, is_template, ...)
  |       |
  |       |--< pipeline_stages (id, pipeline_id FK, name, type, position, automation_config, ...)
  |
  |--< jobs (id, organization_id FK, department_id FK, title, status, pipeline_id FK, ...)
  |       |
  |       |--< applications (id, job_id FK, candidate_id FK, stage_id FK, ai_score, status, ...)
  |               |
  |               |--< interviews (id, application_id FK, type, scheduled_at, status, ...)
  |               |       |
  |               |       |--< interview_panelists (interview_id FK, user_id FK, scorecard_id FK, ...)
  |               |       |
  |               |       |--< scorecards (id, interview_id FK, interviewer_id FK, overall_rating, ...)
  |               |
  |               |--< notes (id, candidate_id FK, application_id FK, author_id FK, content, ...)
  |               |
  |               |--< emails (id, candidate_id FK, application_id FK, from_user_id FK, status, ...)
  |
  |--< candidates (id, organization_id FK, email, resume_url, parsed_data JSONB, ai_score, ...)
  |       |
  |       |--< candidate_tags (candidate_id FK, tag_id FK)
  |
  |--< tags (id, organization_id FK, name, color, ...)
  |
  |--< email_templates (id, organization_id FK, name, subject, body_html, ...)
  |
  |--< scorecard_templates (id, organization_id FK, name, criteria JSONB, ...)
  |
  |--< api_keys (id, organization_id FK, key_hash, scopes, ...)
  |
  |--< webhooks (id, organization_id FK, url, events, ...)
  |
  |--< audit_logs (id, organization_id, actor_user_id FK, action, resource_type, resource_id, ...)
```

---

## 15. Authentication Flow

### Flow 1: Email/Password Registration

```
1. Browser submits {name, email, password} to Next.js Server Action
2. Server Action validates schema (Zod)
3. Server Action calls POST /api/v1/auth/register on NestJS
4. NestJS checks for duplicate email in organization
5. NestJS hashes password with bcrypt (12 rounds)
6. NestJS creates user record + default org membership
7. NestJS enqueues verification email via BullMQ -> Resend
8. Returns userId; client redirected to /verify-email
9. User clicks email link -> GET /verify-email?token=xxx
10. NestJS validates token (Redis TTL), marks email verified
11. Client redirected to /dashboard
```

### Flow 2: JWT + Refresh Token

```
1. POST /api/v1/auth/login with {email, password}
2. NestJS validates credentials
3. If MFA enabled: return {mfaRequired: true, mfaToken: temp_token}
4. Client submits TOTP code to /api/v1/auth/mfa/verify
5. NestJS verifies TOTP, issues:
   - Access Token: JWT (RS256), 15-minute TTL, contains {sub, org, role, plan}
   - Refresh Token: opaque 64-byte random token, 7-day TTL
   - Refresh token stored hashed in Redis
   - Access token returned in response body
   - Refresh token set as httpOnly, Secure, SameSite=Strict cookie
6. Client stores access token in memory (NOT localStorage)
7. Every API request: Authorization: Bearer {accessToken}
8. On 401 (expired): client calls POST /api/v1/auth/refresh with cookie
9. NestJS validates refresh token hash in Redis, rotates token pair
10. On logout: refresh token deleted from Redis, cookie cleared
```

### Flow 3: OAuth 2.0 (Google / GitHub)

```
1. User clicks "Sign in with Google"
2. GET /api/v1/auth/google -> NestJS Passport redirects to Google OAuth URL
3. User grants consent on Google
4. Google redirects to /api/v1/auth/google/callback?code=xxx
5. NestJS exchanges code for access_token + id_token
6. NestJS fetches user profile (email, name, picture) from provider
7. Find or create user record; upsert oauth_accounts record
8. Issue JWT + refresh token pair (same as Flow 2 steps 5–6)
9. Redirect browser to /dashboard with session set
```

### Flow 4: Password Reset

```
1. User submits email to POST /api/v1/auth/forgot-password
2. NestJS generates cryptographically secure 64-byte token
3. Token stored in Redis with 1-hour TTL (hashed)
4. Reset email queued via BullMQ -> Resend with link containing token
5. Response always returns generic success (no user enumeration)
6. User clicks link -> /reset-password?token=xxx
7. User submits new password
8. NestJS validates token from Redis (check TTL, hash match)
9. NestJS hashes new password, updates user record
10. All active refresh tokens for user deleted from Redis
11. Token deleted from Redis
12. Client redirected to /login
```

---

## 16. Authorization Strategy

### RBAC Permission Matrix

| Resource / Action | Owner | Admin | Recruiter | Hiring Mgr | Interviewer | Viewer |
|-------------------|-------|-------|-----------|------------|-------------|--------|
| Org Settings (write) | Yes | Yes | No | No | No | No |
| Member Management | Yes | Yes | No | No | No | No |
| Billing | Yes | No | No | No | No | No |
| Job Create | Yes | Yes | Yes | Yes* | No | No |
| Job Edit | Yes | Yes | Yes | Yes* | No | No |
| Job Publish | Yes | Yes | Yes | No | No | No |
| Job Delete | Yes | Yes | No | No | No | No |
| Job View | Yes | Yes | Yes | Yes | Yes | Yes |
| Candidate Create | Yes | Yes | Yes | No | No | No |
| Candidate Edit | Yes | Yes | Yes | No | No | No |
| Candidate View | Yes | Yes | Yes | Yes | Yes (scoped) | Yes |
| Candidate Delete | Yes | Yes | No | No | No | No |
| Pipeline Move | Yes | Yes | Yes | Yes* | No | No |
| Reject Candidate | Yes | Yes | Yes | Yes* | No | No |
| Bulk Actions | Yes | Yes | Yes | No | No | No |
| Interview Schedule | Yes | Yes | Yes | Yes* | No | No |
| Scorecard Submit | Yes | Yes | Yes | Yes | Yes (scoped) | No |
| Scorecard View All | Yes | Yes | Yes | Yes | No | No |
| Analytics View | Yes | Yes | Yes | Yes* | No | No |
| Export Data | Yes | Yes | Yes | No | No | No |
| API Keys | Yes | Yes | No | No | No | No |
| Audit Log | Yes | Yes | No | No | No | No |

`*` = scoped to assigned jobs only | `Yes (scoped)` = scoped to assigned interviews only

### Implementation Architecture

**JWT Claims:**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "org": "org-uuid",
  "role": "recruiter",
  "plan": "growth",
  "iat": 1234567890,
  "exp": 1234568790
}
```

**NestJS Guards Chain:**
```
Request
  -> JwtAuthGuard        (validates JWT signature and expiry)
  -> OrganizationGuard   (extracts org context; validates membership)
  -> RolesGuard          (checks @Roles() decorator against JWT role)
  -> ResourceOwnerGuard  (for HM/Interviewer: validates scoped access)
  -> PlanGuard           (validates feature flag against subscription plan)
  -> Controller Handler
```

**Resource-Level Scoping:**
- Jobs: Hiring Manager can only act on jobs where `hiring_manager_id = user.id`
- Candidates: Hiring Manager can view candidates in their jobs' applications
- Interviews: Interviewer can only submit scorecards for assigned interviews

**API Key Authorization:**
- Keys carry scopes: `['candidates:read', 'jobs:write']`
- Scope format: `{resource}:{action}`
- Key resolved via `x-api-key` header -> SHA-256 hash lookup -> org + scopes
- No JWT issued; scopes are the authority

---

## 17. API Design

### Conventions

- **Style:** RESTful with JSON:API-influenced envelope
- **Versioning:** URI prefix: `/api/v1/`
- **Authentication:** `Authorization: Bearer <jwt>` or `x-api-key` header
- **Tenant Isolation:** `x-org-id` header on all tenant-scoped requests
- **Pagination:** Cursor-based for feeds; offset-based for list views
- **Error Format:** RFC 7807 Problem Details

### Response Envelope

```json
// Success (collection)
{
  "data": [ ... ],
  "meta": {
    "requestId": "uuid",
    "total": 250,
    "page": 1,
    "perPage": 25,
    "totalPages": 10
  }
}

// Error (RFC 7807)
{
  "type": "https://hiretrack.ai/errors/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "Email address is already in use",
  "instance": "/api/v1/auth/register",
  "requestId": "uuid",
  "errors": [
    { "field": "email", "message": "Email already registered" }
  ]
}
```

### Core API Endpoints

#### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/verify-email?token=
POST   /api/v1/auth/mfa/setup
POST   /api/v1/auth/mfa/verify
DELETE /api/v1/auth/mfa
GET    /api/v1/auth/sessions
DELETE /api/v1/auth/sessions/:sessionId
GET    /api/v1/auth/google
GET    /api/v1/auth/google/callback
GET    /api/v1/auth/github
GET    /api/v1/auth/github/callback
```

#### Users
```
GET    /api/v1/me
PATCH  /api/v1/me
DELETE /api/v1/me
PATCH  /api/v1/me/password
GET    /api/v1/me/notifications
PATCH  /api/v1/me/notifications
```

#### Organizations
```
POST   /api/v1/organizations
GET    /api/v1/organizations/:orgId
PATCH  /api/v1/organizations/:orgId
DELETE /api/v1/organizations/:orgId
GET    /api/v1/organizations/:orgId/members
POST   /api/v1/organizations/:orgId/members/invite
PATCH  /api/v1/organizations/:orgId/members/:userId
DELETE /api/v1/organizations/:orgId/members/:userId
GET    /api/v1/organizations/:orgId/departments
POST   /api/v1/organizations/:orgId/departments
PATCH  /api/v1/organizations/:orgId/departments/:deptId
DELETE /api/v1/organizations/:orgId/departments/:deptId
POST   /api/v1/organizations/:orgId/invitations/:token/accept
DELETE /api/v1/organizations/:orgId/invitations/:token
```

#### Jobs
```
GET    /api/v1/organizations/:orgId/jobs
POST   /api/v1/organizations/:orgId/jobs
GET    /api/v1/organizations/:orgId/jobs/:jobId
PATCH  /api/v1/organizations/:orgId/jobs/:jobId
DELETE /api/v1/organizations/:orgId/jobs/:jobId
POST   /api/v1/organizations/:orgId/jobs/:jobId/publish
POST   /api/v1/organizations/:orgId/jobs/:jobId/pause
POST   /api/v1/organizations/:orgId/jobs/:jobId/close
POST   /api/v1/organizations/:orgId/jobs/:jobId/duplicate
GET    /api/v1/organizations/:orgId/jobs/:jobId/pipeline
PATCH  /api/v1/organizations/:orgId/jobs/:jobId/pipeline
POST   /api/v1/organizations/:orgId/jobs/:jobId/pipeline/stages
PATCH  /api/v1/organizations/:orgId/jobs/:jobId/pipeline/stages/:stageId
DELETE /api/v1/organizations/:orgId/jobs/:jobId/pipeline/stages/:stageId
```

#### Candidates
```
GET    /api/v1/organizations/:orgId/candidates
POST   /api/v1/organizations/:orgId/candidates
GET    /api/v1/organizations/:orgId/candidates/:candidateId
PATCH  /api/v1/organizations/:orgId/candidates/:candidateId
DELETE /api/v1/organizations/:orgId/candidates/:candidateId
POST   /api/v1/organizations/:orgId/candidates/import
GET    /api/v1/organizations/:orgId/candidates/:candidateId/timeline
GET    /api/v1/organizations/:orgId/candidates/:candidateId/notes
POST   /api/v1/organizations/:orgId/candidates/:candidateId/notes
PATCH  /api/v1/organizations/:orgId/candidates/:candidateId/notes/:noteId
DELETE /api/v1/organizations/:orgId/candidates/:candidateId/notes/:noteId
GET    /api/v1/organizations/:orgId/candidates/:candidateId/emails
POST   /api/v1/organizations/:orgId/candidates/:candidateId/emails
POST   /api/v1/organizations/:orgId/candidates/:candidateId/request-deletion
```

#### Applications
```
GET    /api/v1/organizations/:orgId/jobs/:jobId/applications
POST   /api/v1/organizations/:orgId/jobs/:jobId/applications
GET    /api/v1/organizations/:orgId/jobs/:jobId/applications/:appId
PATCH  /api/v1/organizations/:orgId/jobs/:jobId/applications/:appId/stage
POST   /api/v1/organizations/:orgId/jobs/:jobId/applications/:appId/reject
POST   /api/v1/organizations/:orgId/jobs/:jobId/applications/bulk-action
```

#### Interviews
```
GET    /api/v1/organizations/:orgId/interviews
POST   /api/v1/organizations/:orgId/interviews
GET    /api/v1/organizations/:orgId/interviews/:interviewId
PATCH  /api/v1/organizations/:orgId/interviews/:interviewId
DELETE /api/v1/organizations/:orgId/interviews/:interviewId
POST   /api/v1/organizations/:orgId/interviews/:interviewId/cancel
GET    /api/v1/organizations/:orgId/interviews/:interviewId/scorecards
POST   /api/v1/organizations/:orgId/interviews/:interviewId/scorecards
PATCH  /api/v1/organizations/:orgId/interviews/:interviewId/scorecards/:scId
```

#### AI
```
POST   /api/v1/organizations/:orgId/ai/score-candidate
POST   /api/v1/organizations/:orgId/ai/generate-job-description
POST   /api/v1/organizations/:orgId/ai/candidate-summary
POST   /api/v1/organizations/:orgId/ai/interview-questions
POST   /api/v1/organizations/:orgId/ai/outreach-email
POST   /api/v1/organizations/:orgId/ai/similar-candidates
```

#### Analytics
```
GET    /api/v1/organizations/:orgId/analytics/overview
GET    /api/v1/organizations/:orgId/analytics/pipeline-funnel
GET    /api/v1/organizations/:orgId/analytics/time-to-hire
GET    /api/v1/organizations/:orgId/analytics/source-effectiveness
GET    /api/v1/organizations/:orgId/analytics/offer-stats
GET    /api/v1/organizations/:orgId/analytics/dei-funnel
GET    /api/v1/organizations/:orgId/analytics/interviewer-stats
POST   /api/v1/organizations/:orgId/analytics/reports/custom
POST   /api/v1/organizations/:orgId/analytics/reports/export
```

#### System & Public
```
GET    /health
GET    /ready
GET    /metrics
GET    /api/docs
GET    /api/v1/openapi.json
POST   /api/v1/webhooks/stripe
POST   /api/v1/webhooks/resend
GET    /public/careers/:orgSlug/jobs
GET    /public/careers/:orgSlug/jobs/:jobSlug
POST   /public/careers/:orgSlug/jobs/:jobSlug/apply
GET    /public/careers/:orgSlug/jobs/:jobSlug/status
```

### Rate Limiting

| Endpoint Group | Limit |
|----------------|-------|
| Auth (login, register, forgot-password) | 10 req/min per IP |
| AI endpoints | 30 req/min per org |
| File uploads | 20 req/min per org |
| Public apply form | 5 req/min per IP |
| All other API | 200 req/min per token |
| API Key requests | 1000 req/min per key |

---

## 18. Server Actions Plan

All Server Actions follow the `ActionResult<T>` pattern:

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```

### Actions Registry

#### `actions/auth.ts`
| Action | Trigger | Description |
|--------|---------|-------------|
| `registerAction` | Register form submit | Validates schema, calls API, sets session cookie |
| `loginAction` | Login form submit | Validates, calls API, handles MFA redirect |
| `logoutAction` | Logout button | Clears session, redirects to /login |
| `forgotPasswordAction` | Forgot password form | Calls API, returns generic success |
| `resetPasswordAction` | Reset password form | Validates token + new password |
| `verifyEmailAction` | Email verification link | Calls API, redirects on success |
| `setupMfaAction` | MFA setup page | Initiates TOTP setup, returns QR code URI |
| `verifyMfaAction` | MFA verify form | Validates TOTP code, completes login |

#### `actions/jobs.ts`
| Action | Trigger | Description |
|--------|---------|-------------|
| `createJobAction` | New job form | Validates + creates job via API |
| `updateJobAction` | Job edit form | Partial update with Zod validation |
| `publishJobAction` | Publish button | Changes status to open, invalidates careers page cache |
| `duplicateJobAction` | Duplicate menu item | Clones job with new draft status |
| `deleteJobAction` | Delete confirmation | Soft delete |
| `updatePipelineAction` | Stage drag-and-drop | Reorders stages via API |
| `generateJobDescriptionAction` | AI button | Streams AI response to the form |

#### `actions/candidates.ts`
| Action | Trigger | Description |
|--------|---------|-------------|
| `createCandidateAction` | Manual add form | Creates candidate, returns profile URL |
| `updateCandidateAction` | Profile edit form | Updates candidate data |
| `importCandidatesAction` | CSV upload | Queues background import job |
| `moveCandidateStageAction` | Kanban drag-and-drop | Updates application stage, triggers automation |
| `rejectCandidateAction` | Reject button | Updates application status + reason, triggers email |
| `addNoteAction` | Note form | Creates note with @mention parsing |
| `sendEmailAction` | Email composer | Queues email via BullMQ |
| `bulkActionAction` | Bulk select + action | Validates permissions, dispatches bulk job |
| `requestDeletionAction` | GDPR menu | Creates deletion request record |

#### `actions/interviews.ts`
| Action | Trigger | Description |
|--------|---------|-------------|
| `scheduleInterviewAction` | Schedule form | Creates interview + panel invites + calendar events |
| `submitScorecardAction` | Scorecard form | Saves feedback, updates completion status |
| `cancelInterviewAction` | Cancel button | Updates status, sends cancellation notifications |

#### `actions/organization.ts`
| Action | Trigger | Description |
|--------|---------|-------------|
| `updateOrganizationAction` | Org settings form | Updates org profile |
| `inviteMemberAction` | Invite modal | Sends invitation email, creates pending membership |
| `updateMemberRoleAction` | Member table | Updates role, invalidates member JWT if active |
| `removeMemberAction` | Remove button | Deactivates membership |
| `createDepartmentAction` | Department form | Creates department node |

---

## 19. UI Screen List

### Public / Marketing

| Screen | Path | Description |
|--------|------|-------------|
| Landing Page | `/` | Hero, features, social proof, pricing CTA |
| Pricing Page | `/pricing` | Plan comparison table with feature matrix |
| About Page | `/about` | Company story, team, mission |
| Blog | `/blog` | Hiring tips, product updates |
| Blog Post | `/blog/:slug` | Individual article |

### Authentication

| Screen | Path | Description |
|--------|------|-------------|
| Login | `/login` | Email/password + OAuth buttons |
| Register | `/register` | Multi-step: account info -> org setup |
| Forgot Password | `/forgot-password` | Email entry form |
| Reset Password | `/reset-password?token=` | New password form |
| Verify Email | `/verify-email?token=` | Auto-redirect on success |
| MFA Setup | `/mfa/setup` | TOTP QR code display + verification |
| MFA Challenge | `/mfa/verify` | Code entry during login |
| Accept Invitation | `/invitations/:token` | Join org confirmation screen |

### Onboarding

| Screen | Path | Description |
|--------|------|-------------|
| Onboarding Welcome | `/onboarding` | Step 1: Welcome + org info |
| Team Setup | `/onboarding/team` | Step 2: Invite first members |
| First Job | `/onboarding/job` | Step 3: Create first job requisition |
| Integration Setup | `/onboarding/integrations` | Step 4: Connect calendar, Slack |
| Complete | `/onboarding/complete` | Confetti + Go to Dashboard |

### App — Jobs

| Screen | Path | Description |
|--------|------|-------------|
| Jobs List | `/jobs` | Filterable table of all job requisitions |
| New Job | `/jobs/new` | Multi-step job creation wizard |
| Job Overview | `/jobs/:id` | Summary stats + team + pipeline preview |
| Job Pipeline | `/jobs/:id/pipeline` | Kanban board with candidate cards |
| Job Candidates | `/jobs/:id/candidates` | Table view of all applicants |
| Job Interviews | `/jobs/:id/interviews` | Scheduled interviews timeline |
| Job Analytics | `/jobs/:id/analytics` | Per-job funnel, time-in-stage |
| Job Settings | `/jobs/:id/settings` | Edit job, pipeline, automation, team |

### App — Candidates

| Screen | Path | Description |
|--------|------|-------------|
| Candidates List | `/candidates` | Searchable, filterable candidate database |
| Candidate Profile | `/candidates/:id` | Full profile: resume, score, applications, timeline |
| Candidate Resume | `/candidates/:id/resume` | Resume viewer with parsing highlights |
| Candidate Timeline | `/candidates/:id/timeline` | Activity history |
| Candidate Notes | `/candidates/:id/notes` | Collaborative notes thread |

### App — Interviews

| Screen | Path | Description |
|--------|------|-------------|
| Interviews Calendar | `/interviews` | Calendar + upcoming interviews list |
| Interview Detail | `/interviews/:id` | Interview info, panel, scorecard status |
| Scorecard Submission | `/interviews/:id/scorecard` | Interviewer feedback form |

### App — Analytics

| Screen | Path | Description |
|--------|------|-------------|
| Analytics Overview | `/analytics` | Executive KPI dashboard |
| Pipeline Funnel | `/analytics/funnel` | Stage conversion with filters |
| Time to Hire | `/analytics/time-to-hire` | Breakdown by job, dept, period |
| Source Report | `/analytics/sources` | Source effectiveness matrix |
| DEI Funnel | `/analytics/dei` | Opt-in diversity funnel (Premium) |
| Custom Reports | `/analytics/reports` | Report builder + saved reports |

### App — Settings

| Screen | Path | Description |
|--------|------|-------------|
| Org Profile | `/settings/organization` | Name, logo, timezone, industry |
| Members | `/settings/members` | Member management table |
| Roles | `/settings/roles` | Role permissions viewer |
| Departments | `/settings/departments` | Department hierarchy tree |
| Pipeline Templates | `/settings/pipelines` | Reusable stage templates |
| Scorecard Templates | `/settings/scorecards` | Interview scorecard templates |
| Email Templates | `/settings/emails` | Email template library |
| Integrations | `/settings/integrations` | Integration marketplace |
| Billing | `/settings/billing` | Subscription, invoices, usage |
| Security | `/settings/security` | MFA, SSO, session management |
| Notifications | `/settings/notifications` | Email and in-app notification preferences |
| API Keys | `/settings/api-keys` | API key creation and management |
| Webhooks | `/settings/webhooks` | Webhook endpoints + event config |
| Audit Log | `/settings/audit-log` | Paginated activity log |
| Data & Privacy | `/settings/data` | Export, GDPR, retention settings |

### Public (Candidate-Facing)

| Screen | Path | Description |
|--------|------|-------------|
| Careers Page | `/careers/:orgSlug` | Branded job board |
| Job Detail (Public) | `/careers/:orgSlug/jobs/:jobSlug` | Job posting with Apply button |
| Application Form | `/apply/:jobSlug` | Multi-step application form |
| Application Status | `/careers/:orgSlug/status` | Candidate checks their status |

---

## 20. Dashboard Layout

```
+------------------------------------------------------------------+
|  TOPBAR (fixed)                                                    |
|  [Logo] HireTrack AI   [Search (Cmd+K)]      [Alerts] [Avatar]   |
+----------------+--------------------------------------------------+
|  SIDEBAR       |  MAIN CONTENT AREA                               |
|  (240px fixed) |                                                   |
|                |  PAGE HEADER                                      |
|  MAIN          |  Good morning, Rachel                            |
|  - Dashboard   |  You have 5 pending tasks today                  |
|  - Jobs (12)   |                                                   |
|  - Candidates  |  KPI CARDS (4-column grid)                       |
|  - Interviews  |  [Open Jobs: 12] [Active Cands: 248]             |
|  - Analytics   |  [Avg Time-to-Hire: 28d] [Offer Accept: 73%]    |
|                |                                                   |
|  MANAGE        |  [PIPELINE OVERVIEW]      [TOP OPEN JOBS]        |
|  - Settings    |  Applied:   248           1. Sr. Engineer         |
|  - Integrtns   |  Screened:  112           2. Product Manager      |
|  - API Keys    |  Interview:  45           3. Data Analyst         |
|  - Billing     |  Offer:       8                                   |
|                |  Hired:       3                                   |
|  ---           |                                                   |
|  [Org] Acme    |  RECENT ACTIVITY FEED                            |
|  [User] Rachel |  [green] John Doe moved to Interview - 2m ago    |
|                |  [blue]  Offer sent to Jane Smith - 15m ago      |
|                |  [red]   Raj Kumar rejected at Screen - 1h ago   |
+----------------+--------------------------------------------------+
```

### Sidebar Navigation Structure
```
Dashboard
---
Jobs
  Open (12)
  Drafts (3)
  Closed
Candidates
Interviews
  Upcoming
  Pending Feedback
Analytics
---
Settings
Integrations
API & Webhooks
Billing
---
[Org] Acme Corp
[User] Rachel D.
```

---

## 21. Navigation Flow

```
PUBLIC:
  Landing -> Pricing
  Landing -> Register -> Onboarding -> Dashboard
  Landing -> Login -> [MFA?] -> Dashboard
  Careers Page -> Job Detail -> Application Form -> Status Page

AUTHENTICATED:
  Dashboard (default after login)
    -> Jobs List
         -> New Job (wizard)
         -> Job Detail
              -> Pipeline (Kanban)
              -> Candidates (table)
              -> Interviews
              -> Job Analytics
              -> Job Settings
    -> Candidates List
         -> Candidate Profile
              -> Resume Viewer
              -> Timeline
              -> Notes
    -> Interviews Calendar
         -> Interview Detail
              -> Scorecard Form
    -> Analytics
         -> Funnel / Time-to-Hire / Sources / DEI / Reports
    -> Settings
         -> Organization / Members / Integrations / Billing / Security / API Keys / Audit Log

GLOBAL: Cmd+K Command Palette -> search anything
```

### Navigation Guards
- Unauthenticated users at `/dashboard/*` -> redirect to `/login?redirect=...`
- Users without an org -> redirect to `/onboarding`
- Users accessing settings above their role -> 403 error page
- Users on free plan accessing Premium pages -> upgrade modal

---

## 22. Validation Rules

### User Registration
```
name:         min 2, max 100 chars; letters, spaces, hyphens only
email:        valid RFC 5322 email; max 255 chars; lowercase normalized
password:     min 8, max 128 chars; must contain uppercase, lowercase, digit
              must NOT contain the user's email as substring
```

### Organization
```
name:         min 2, max 100 chars
slug:         3-50 chars; lowercase alphanumeric + hyphens; no leading/trailing hyphens
              reserved blacklist: ['admin','api','app','www','staging','production']
timezone:     valid IANA timezone string
```

### Job Requisition
```
title:        min 3, max 255 chars
description:  min 100, max 50,000 chars (HTML sanitized via DOMPurify)
salary_min:   positive number, max 10,000,000
salary_max:   positive, must be >= salary_min
salary_currency: valid ISO 4217 code (3 chars)
headcount:    integer 1-1000
closes_at:    must be a future date if provided
employment_type: enum ['full_time','part_time','contract','internship']
work_location:   enum ['remote','hybrid','on_site']
experience_level: enum ['entry','mid','senior','staff','principal']
```

### Candidate
```
first_name:   min 1, max 100 chars
last_name:    min 1, max 100 chars
email:        valid email, unique per organization
phone:        optional; E.164 format (e.g. +12025551234)
linkedin_url: optional; valid LinkedIn URL pattern
github_url:   optional; valid GitHub URL
portfolio_url: optional; valid HTTPS URL only
```

### Note
```
content:      min 1, max 10,000 chars
              @mention format: @[Name](user-id)
              HTML stripped; markdown allowed
```

### Email Template
```
name:         min 1, max 255 chars
subject:      min 3, max 500 chars
body_html:    min 1, max 100,000 chars
allowed variables: {{candidate.name}}, {{job.title}}, {{company.name}},
                   {{interview.date}}, {{interview.location}}, {{recruiter.name}}
```

### Interview
```
title:         min 3, max 255 chars
scheduled_at:  must be future date/time
duration_minutes: enum [15, 30, 45, 60, 90, 120]
type:          enum ['phone','video','technical','panel','on_site','culture']
panelists:     min 1, max 10; all must be org members
```

### Scorecard
```
overall_rating:    decimal 1.0-5.0, step 0.5
recommendation:    enum ['strong_yes','yes','no','strong_no']
criterion_rating:  integer 1-5 per criterion
notes per criterion: max 2,000 chars
summary:           min 50, max 5,000 chars
```

### CSV Import
```
max file size:  10MB
max rows:       5,000 per import
required cols:  email, first_name, last_name
encoding:       UTF-8 only
date format:    ISO 8601
duplicates:     configurable (skip / merge / error)
```

### File Uploads
```
allowed types:  .pdf, .doc, .docx, .txt (resumes/docs)
                .png, .jpg, .jpeg, .webp (avatars/logos)
max size:       10MB per file
virus scan:     ClamAV via async worker (file quarantined until cleared)
```

---

## 23. Error Handling Strategy

### Error Classification

| Level | Type | Handling |
|-------|------|----------|
| L1 — Validation | Invalid input, schema violations | 422 with field-level messages; inline form errors |
| L2 — Authentication | Expired token, invalid credentials | 401; client clears session -> redirect to login |
| L3 — Authorization | Insufficient permissions | 403; "Access Denied" component |
| L4 — Not Found | Resource does not exist | 404; contextual empty state or Not Found page |
| L5 — Conflict | Duplicate resource, state conflict | 409; inline warning with resolution options |
| L6 — Rate Limit | Too many requests | 429 with Retry-After header; client shows countdown |
| L7 — Service Error | External API failure (AI, email, storage) | 503; enqueue retry; "try again later" UI |
| L8 — Internal | Unhandled server exceptions | 500; log to Sentry with correlation ID; generic error page |

### Backend Error Handling (NestJS)

```
Request
  -> Global Exception Filter (catches ALL unhandled exceptions)
       -> Is HttpException?        -> format as RFC 7807 -> return
       -> Is PrismaClientError?    -> map to semantic HTTP error -> return
       -> Is ValidationError?      -> map field errors to 422 -> return
       -> Is ExternalServiceError? -> log + return 503 -> enqueue retry
       -> Everything else          -> log full stack to Sentry -> return 500

All errors include: requestId for correlation
All errors logged via Pino at appropriate level
Sensitive data (passwords, tokens) NEVER logged
```

### Frontend Error Handling

- **API Errors:** TanStack Query `onError` callbacks surface toast notifications
- **Next.js Error Boundaries:** `error.tsx` per route segment; `global-error.tsx` root
- **Custom Pages:** 404 and 500 pages with navigation back to safety
- **Optimistic UI Rollback:** Pipeline moves use optimistic updates; server failure triggers rollback + error toast
- **Offline/Network Errors:** TanStack Query retries with exponential backoff (3 retries); "Connection lost" toast with manual retry

### Error Message Guidelines

```
Bad:  "Error 500: Internal Server Error"
Good: "We couldn't load your jobs. Please try again. If the issue persists, contact support."

Bad:  "PrismaClientKnownRequestError: Unique constraint failed on {email}"
Good: "This email address is already registered. Try signing in instead."

Rule: NEVER expose stack traces to end users
Rule: Log internally, expose correlation ID for support reference
```

### Sentry Configuration
- Capture all L7 and L8 errors automatically
- Attach: user ID, org ID, request path, correlation ID, release version
- Alert rules: error rate >1% over 5min, new error types, crash-free rate drops below 98%
- Performance monitoring: track p95 API response times

---

## 24. Security Checklist

### Authentication Security
- [x] Passwords hashed with bcrypt, cost factor 12
- [x] JWT signed with RS256 (asymmetric), not HS256
- [x] Access tokens: 15-minute TTL
- [x] Refresh tokens: httpOnly, Secure, SameSite=Strict cookies
- [x] Refresh token rotation on every refresh (old token invalidated)
- [x] Refresh tokens stored as hashed values in Redis (not plaintext)
- [x] Password reset tokens: cryptographically random, 64 bytes, 1-hour TTL
- [x] Account lockout after 10 failed login attempts (30-minute lock)
- [x] TOTP MFA with RFC 6238 compliance (30-second windows, +/-1 drift)
- [x] MFA backup codes: 10 one-time codes, stored hashed

### Transport Security
- [x] TLS 1.3 minimum (TLS 1.0/1.1 disabled)
- [x] HSTS with includeSubDomains and preload
- [x] Redirect all HTTP to HTTPS
- [x] Secure and SameSite cookie attributes enforced

### Input Validation & Injection Prevention
- [x] All inputs validated server-side (never client-only)
- [x] Parameterized queries via Prisma (no SQL string concatenation)
- [x] HTML content sanitized with DOMPurify before storage
- [x] File uploads: type validation, size limits, MIME sniffing, virus scanning
- [x] SSRF prevention: outbound URLs validated against allowlist

### API Security
- [x] Rate limiting per IP and per API key (Redis-backed)
- [x] CORS: strict origin allowlist (no wildcard)
- [x] Helmet.js: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [x] Content-Security-Policy header on all responses
- [x] API keys hashed with SHA-256; only prefix shown in UI
- [x] Webhook HMAC signature verification (SHA-256 secret)

### Data Security
- [x] Database encryption at rest (AWS RDS + EBS encryption)
- [x] S3 bucket encryption (AES-256 with KMS)
- [x] OAuth tokens encrypted at rest in database
- [x] Secrets managed via AWS Secrets Manager (no .env in production)
- [x] No secrets in source code or logs
- [x] Database credentials rotated automatically every 90 days

### Authorization & Access Control
- [x] All endpoints require authentication (no accidental public routes)
- [x] Organization-level data isolation enforced on every query
- [x] IDOR prevented via org-scoped lookups
- [x] API key scopes enforced per request

### Infrastructure Security
- [x] VPC with private subnets for database and cache
- [x] Security groups: minimal required ports only
- [x] IAM roles with least privilege (ECS task roles, not root credentials)
- [x] AWS GuardDuty for threat detection
- [x] CloudTrail for AWS API audit logging
- [x] Container image vulnerability scanning (Trivy in CI/CD)
- [x] Dependency vulnerability scanning (Snyk, Dependabot)

### Compliance
- [x] GDPR: data subject access request, deletion workflow, consent records
- [x] CCPA: data sale opt-out, deletion on request
- [x] EEOC: EEO data collection is optional, anonymized, separate from hiring decisions
- [x] SOC 2 Type II: access controls, change management, availability, confidentiality
- [x] Penetration testing: annual third-party + pre-launch internal
- [x] Vulnerability disclosure policy published

---

## 25. Accessibility Checklist

**Standard Target:** WCAG 2.1 Level AA across all user-facing screens

### Keyboard Navigation
- [x] All interactive elements reachable via keyboard (logical Tab order)
- [x] Custom components (Kanban drag-and-drop) have keyboard alternatives
- [x] Skip navigation link at top of every page
- [x] Focus trap in modals / dialogs (Radix UI enforces this)
- [x] Visible focus indicators with sufficient contrast (3:1 ratio minimum)
- [x] Esc key closes all modals, dropdowns, and popovers

### Screen Readers
- [x] All images have descriptive `alt` attributes (or `alt=""` for decorative)
- [x] All form inputs have associated `<label>` elements
- [x] ARIA roles, states, and properties on all custom components
- [x] Dynamic content updates announced via `aria-live` regions
- [x] Error messages linked to inputs via `aria-describedby`
- [x] Loading states announced with `aria-busy="true"` + status messages

### Color & Contrast
- [x] Text contrast ratio >= 4.5:1 (normal text), >= 3:1 (large text)
- [x] Color is never the sole means of conveying information
- [x] Status indicators use icon + text, not color alone
- [x] Dark mode support with verified contrast ratios in both modes

### Forms & Interactions
- [x] Required fields marked with both `*` and `required` attribute
- [x] Inline validation with helpful, non-judgmental error messages
- [x] Form timeout warnings give user opportunity to extend session
- [x] Multi-step forms indicate progress and allow backward navigation
- [x] Confirm dialogs for destructive actions (delete, reject)

### Content & Language
- [x] `lang` attribute set on `<html>` element
- [x] Plain English UI copy — reading level <= Grade 10
- [x] Consistent navigation patterns across all pages
- [x] Page titles unique and descriptive per screen

### Testing
- [x] Axe DevTools automated scan on every PR (CI integration)
- [x] Manual VoiceOver (macOS/iOS) and NVDA (Windows) testing per sprint
- [x] Color blindness simulation review (Deuteranopia, Protanopia)

---

## 26. SEO Checklist

### Technical SEO
- [x] Next.js App Router `generateMetadata()` for every page
- [x] Unique `<title>` and `<meta name="description">` per page
- [x] Open Graph tags (og:title, og:description, og:image, og:url)
- [x] Twitter Card meta tags
- [x] Canonical URLs via `<link rel="canonical">`
- [x] XML sitemap at `/sitemap.xml` (Next.js sitemap.ts)
- [x] `robots.txt` disallowing admin/private routes
- [x] Structured data (JSON-LD): Organization, JobPosting on careers pages
- [x] `hreflang` tags for future i18n
- [x] 301 redirects for any changed URLs

### Performance SEO
- [x] Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [x] Next.js Image component with responsive srcset, lazy loading, WebP
- [x] Font loading: `font-display: swap`, preload critical fonts
- [x] Static pages pre-rendered at build (marketing, blog, pricing)
- [x] Dynamic OG images via `@vercel/og` for job postings and blog posts
- [x] Brotli compression on all responses

### Content SEO (Careers Pages)
- [x] Job postings use `<article>` with proper heading hierarchy (h1 -> h2 -> h3)
- [x] `JobPosting` JSON-LD schema with all required Google for Jobs fields:
  - title, description, datePosted, validThrough
  - employmentType, hiringOrganization, jobLocation / jobLocationType
  - baseSalary (when provided)
- [x] Careers page indexed by default; jobs can be noindex if confidential
- [x] Unique, keyword-rich job descriptions

---

## 27. Deployment Strategy

### Environment Topology

```
Developer Local (Docker Compose: postgres + redis)
    |
    | git push feature/xxx
    v
GitHub Repository
    |
    | PR opened
    v
CI Pipeline (GitHub Actions)
    - Lint, Type Check, Unit Tests, E2E (Playwright)
    - Security scan (Snyk, CodeQL)
    - Docker build + Trivy scan
    |
    | CI passes -> Preview URL
    v
Preview / Review Environment (Vercel preview URL, auto-per-PR)
    |
    | PR merged to main
    v
Staging Environment (auto-deploy on main merge)
    - Full environment parity with production
    - Synthetic smoke tests
    |
    | Manual approval gate
    v
Production Environment
    - Blue/Green deployment (ECS)
    - Database migration runs before traffic shift
    - Canary rollout: 5% -> 25% -> 100% over 30 minutes
    - Automatic rollback if error rate > 1%
```

### AWS Production Infrastructure

```
CloudFront (CDN)
    |-> S3 (static assets, resumes, avatars)
    |-> Application Load Balancer
            |-> ECS Fargate (NestJS API) [2-20 tasks, auto-scaling]
            |-> Vercel (Next.js Web App)

VPC Private Subnets:
    - RDS PostgreSQL 16 (Multi-AZ + Read Replica for analytics)
    - ElastiCache Redis Cluster (3-node, auto-failover)

Supporting Services:
    - AWS Secrets Manager
    - AWS CloudWatch (logs, metrics, alarms)
    - AWS GuardDuty (threat detection)
    - Datadog APM + Dashboards + Alerts
    - Sentry (error tracking)
    - PagerDuty (on-call alerting)
```

### CI/CD Pipeline

```yaml
ci.yml (runs on every PR):
  1. Install dependencies (pnpm install --frozen-lockfile)
  2. Type check (tsc --noEmit across all workspaces)
  3. Lint (ESLint + Prettier check)
  4. Unit tests (Vitest)
  5. Integration tests (Supertest with test DB)
  6. E2E tests (Playwright — critical user flows)
  7. Security scan (Snyk test)
  8. Docker build + Trivy vulnerability scan
  9. Deploy preview (Vercel preview URL)

cd-production.yml (manual trigger, main branch):
  1. All CI steps (re-run for production build)
  2. Run database migrations (prisma migrate deploy)
  3. Deploy NestJS to ECS Fargate (Blue/Green)
  4. Verify health check on new tasks
  5. Canary: 5% -> wait 5m -> 25% -> wait 5m -> 100%
  6. Run smoke tests
  7. Create GitHub Release tag
  8. Notify Slack #deployments
```

### Database Migration Policy
- Migrations run BEFORE new code is deployed (backward-compatible required)
- ADD COLUMN: always safe (use nullable or add default)
- DROP COLUMN: deprecate first, remove in subsequent release
- RENAME: add-then-copy-then-drop pattern
- Indexes: CREATE CONCURRENTLY to avoid table locks
- Rollback scripts maintained in `migrations/rollback/`

---

## 28. Testing Strategy

### Testing Pyramid

```
E2E (10%):         Playwright — critical user journeys
Integration (20%): Supertest — API endpoints with real DB
Unit (70%):        Vitest — business logic, utils, transforms
```

### Unit Testing (Vitest)

**Coverage Target:** >= 80% for all src/ modules

**What to test:**
- All NestJS Service methods (business logic)
- Utility functions (formatters, transformers, validators)
- Zod schema validation edge cases
- React components (React Testing Library) — behavior, not DOM structure
- Server Actions — happy path and error cases

**Mocking strategy:**
- External services (OpenAI, Resend, S3) mocked via `vi.mock()`
- Database layer mocked via `PrismaMock` (prisma-client-mock)
- Time-sensitive tests use `vi.useFakeTimers()`

### Integration Testing (Supertest + Testcontainers)

**Coverage Target:** All API endpoints tested at HTTP level

**Setup:**
- Testcontainers spins up PostgreSQL + Redis containers per test run
- Prisma migrations applied fresh per test suite
- Seed data factory using `@faker-js/faker`

**What to test:**
- Full request -> response cycle including auth guards
- Multi-tenant data isolation (verify org A cannot access org B data)
- Role-based access: all roles tested against restricted endpoints
- Rate limiting behavior
- File upload handling

### E2E Testing (Playwright)

**Browser Matrix:** Chromium, Firefox, WebKit

**Critical Flows (P0):**
| Flow | Priority |
|------|----------|
| User registration + email verification | P0 |
| Login (email + OAuth + MFA) | P0 |
| Create org -> invite member -> accept invite | P0 |
| Create job -> publish to careers page | P0 |
| Candidate applies -> appears in pipeline | P0 |
| Recruiter moves candidate through stages | P0 |
| Schedule interview -> submit scorecard | P1 |
| Send email to candidate | P1 |
| AI score generation | P1 |
| Analytics dashboard load | P2 |
| Billing plan upgrade | P2 |

**Configuration:**
- Test users seeded via API before each test
- Authenticated sessions shared via `storageState` for performance
- Automatic screenshots on failure
- Video recording for flaky test debugging
- Run against staging environment nightly

### Performance Testing (k6)

**Scenarios:**
- 1,000 VUs: Dashboard load, candidate list (steady-state)
- 5,000 VUs: Spike test (simulates viral job post)
- 200 VUs: 30-minute soak test (memory leak detection)

**Thresholds:**
- p95 HTTP response time < 300ms
- Error rate < 0.1%
- No memory growth > 10MB/hour (soak)

### Security Testing
- Dependency scanning: Snyk + Dependabot (automated on every PR)
- Static analysis: CodeQL (SQL injection, XSS, path traversal)
- DAST: OWASP ZAP against staging (weekly)
- Penetration test: Manual pen test by third-party before GA launch
- Secret scanning: GitGuardian (prevent accidental credential commits)

---

## 29. Git Branch Strategy

### Branch Model: Trunk-Based Development with Short-Lived Feature Branches

```
main (trunk)
  |-- feature/HT-142-ai-candidate-scoring
  |-- feature/HT-155-pipeline-kanban-drag
  |-- fix/HT-201-interview-timezone-bug
  |-- chore/upgrade-nextjs-15
  |-- release/v1.2.0
```

### Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<ticket-id>-<short-description>` | `feature/HT-142-ai-resume-scoring` |
| Bug Fix | `fix/<ticket-id>-<short-description>` | `fix/HT-201-pipeline-drag-missing` |
| Chore | `chore/<short-description>` | `chore/upgrade-nextjs-15` |
| Hotfix | `hotfix/<ticket-id>-<description>` | `hotfix/HT-303-auth-regression` |
| Release | `release/v<major>.<minor>.<patch>` | `release/v1.0.0` |

### Branch Protection Rules

| Branch | Protection | Merge Strategy |
|--------|-----------|---------------|
| `main` | 1 PR review + all CI passing | Squash and merge |
| `release/*` | 2 reviews + CI + security scan | Merge commit |
| `hotfix/*` | 1 review + core CI (fast-track) | Squash and merge |

### Commit Message Convention (Conventional Commits)

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
BREAKING CHANGE: <description>
Refs: HT-142
```

**Types:** feat, fix, docs, style, refactor, test, chore, perf, ci  
**Scopes:** auth, jobs, candidates, pipeline, interviews, analytics, ai, api, web, infra

**Examples:**
```
feat(candidates): add AI fit score to application card
fix(auth): prevent session fixation on password reset
perf(pipeline): virtualize kanban columns for >100 candidates
chore(deps): upgrade prisma to 5.14.0
docs(api): add missing scorecard endpoint to OpenAPI spec
```

### Release Process
```
1. Cut release/v1.x.0 from main
2. QA run on release branch -> bug fixes applied directly
3. Release branch merged to main + tagged v1.x.0
4. main auto-deployed to staging -> smoke tests pass
5. Manual approval -> production deploy
6. GitHub Release created with auto-generated changelog
```

### Hotfix Process
```
1. Create hotfix/HT-xxx from latest production tag
2. Fix committed, code reviewed (1 reviewer, fast-track)
3. Deploy to staging, verify fix
4. Merge to main (fast-track) -> tag v1.x.(y+1)
5. Production hotfix deploy
6. Backport to active release/* branch if applicable
```

---

## 30. Development Milestones

### Overview Timeline
```
Week  1-2:   Foundation & Infrastructure
Week  3-4:   Authentication & Organization
Week  5-6:   Jobs & Careers Page
Week  7-8:   Candidates & Pipeline
Week  9-10:  Interviews & Communication
Week  11-12: AI Features & Analytics
Week  13-14: QA, Security Audit & Hardening
Week  15-16: Beta Program & Go-to-Market
```

---

### Milestone 1 — Foundation & Infrastructure (Weeks 1–2)

**Goal:** All engineers can run the project locally; CI/CD operational; database seeded.

| Task | Done When |
|------|-----------|
| Turborepo monorepo scaffold (apps/web, apps/api, packages/*) | `pnpm dev` starts all apps |
| Next.js 15 App Router with TypeScript strict mode | `/` page loads |
| NestJS bootstrap with global pipes, guards, interceptors | `/health` returns 200 |
| Prisma schema — initial models (users, orgs, jobs, candidates) | `prisma migrate dev` runs |
| GitHub Actions CI pipeline (lint, type-check, test) | CI runs on every PR |
| Docker Compose for local dev (postgres, redis) | `docker compose up` starts |
| Design system: Tailwind config, shadcn/ui, color tokens, typography | Storybook shows base components |
| Shared `@hiretrack/types` package in monorepo | Types importable in both apps |

---

### Milestone 2 — Authentication & Organization (Weeks 3–4)

**Goal:** Users can register, login (email + OAuth), create orgs, and invite team members.

| Task | Done When |
|------|-----------|
| Email/password registration with email verification | Can register and verify |
| Google + GitHub OAuth 2.0 | OAuth login works end-to-end |
| JWT + refresh token rotation | Token refresh works; logout invalidates |
| TOTP MFA (setup + login challenge) | MFA enforces on login |
| Password reset flow | Can reset password |
| Organization creation + onboarding wizard | Can create org, see dashboard |
| Member invitation flow (invite -> email -> accept) | Invited user can join |
| Role-based access guard (NestJS guards) | 403 returned for unauthorized role |
| `AuthProvider` + `useAuth()` hook | Auth state accessible app-wide |
| Session management UI (view/revoke) | Can revoke active session |

---

### Milestone 3 — Jobs & Careers Page (Weeks 5–6)

**Goal:** Recruiters can create, manage, and publish jobs to a public careers page.

| Task | Done When |
|------|-----------|
| Job creation wizard (all fields, rich text) | Job created + saved |
| Pipeline stage designer (drag-to-reorder, add/remove) | Custom pipeline saved |
| Job status management (draft -> open -> paused -> closed) | Status transitions work |
| Job duplication | Duplicate job appears in list |
| AI job description generator (streaming) | AI drafts JD in under 8s |
| Public careers page (`/careers/:orgSlug`) | Jobs visible publicly |
| Public job detail page with Apply button | Job detail renders |
| Application form (public, multi-step) | Can submit application |
| Jobs list page (table with filters) | Jobs filterable by status |
| Job settings page (edit, team assignment) | Job settings save |

---

### Milestone 4 — Candidates & Pipeline (Weeks 7–8)

**Goal:** Recruiters can manage candidates, view profiles, and move them through the hiring pipeline.

| Task | Done When |
|------|-----------|
| Candidate profile creation (manual + CSV import) | Candidate visible in CRM |
| Resume upload -> S3 -> async parsing (BullMQ) | Resume parsed into structured data |
| AI candidate fit score (async worker) | Score appears on application card |
| AI candidate summary generation | Summary visible on profile |
| Candidate profile page (all sections) | Full profile renderable |
| Kanban pipeline board (dnd-kit) | Can drag candidates across stages |
| Stage transition automation (email triggers) | Email queued on stage move |
| Bulk actions (move, reject, email, tag) | Bulk ops execute correctly |
| Candidate search + filters | Search returns relevant results |
| Candidate tagging system | Tags applied and filterable |
| Candidate timeline (activity feed) | All events visible |
| Rejection workflow (reason + note + email) | Rejection recorded and email sent |
| Duplicate detection + merge UI | Duplicates detected and merged |

---

### Milestone 5 — Interviews & Communication (Weeks 9–10)

**Goal:** Teams can schedule interviews, collect structured feedback, and communicate with candidates.

| Task | Done When |
|------|-----------|
| Interview scheduling (form + panel selection) | Interview created and panelists notified |
| Google Calendar integration | Event appears in interviewer's calendar |
| Scorecard template builder | Custom scorecard saved |
| Scorecard submission (per panelist) | Feedback submitted |
| Consensus view (all scorecards aggregated) | Summary shows all feedback |
| AI interview question generator | Questions generated per role/level |
| Email composer + template library | Can send templated email |
| Email open/click tracking (Resend webhooks) | Events logged |
| Internal notes with @mentions | Notes thread on candidate profile |
| @mention notification (email) | Mentioned user receives email |
| Interview feedback reminder automation | Reminder sent after 24h if pending |
| Interviews calendar view | Calendar shows upcoming interviews |

---

### Milestone 6 — AI Features & Analytics (Weeks 11–12)

**Goal:** Analytics dashboard operational; all AI features complete; platform usable end-to-end.

| Task | Done When |
|------|-----------|
| Executive analytics dashboard (KPI cards) | Dashboard loads with real data |
| Pipeline funnel chart (by stage, job, period) | Funnel data visualized |
| Time-to-hire report | Report shows avg by job and dept |
| Source effectiveness report | Sources ranked by conversion |
| AI outreach email drafter | Personalized email drafted |
| AI similar candidate search | Results surface similar candidates |
| Offer analytics (accept rate, decline reasons) | Offer stats displayed |
| Notification preferences (email + in-app) | User can configure preferences |
| Webhook configuration UI + delivery | Events delivered to endpoint |
| API key management UI | API keys created, scoped, revoked |
| Audit log viewer | Log paginated and searchable |
| Custom report builder (MVP: basic filters) | Report exportable as CSV |

---

### Milestone 7 — QA, Security & Hardening (Weeks 13–14)

**Goal:** Platform is production-ready from quality, security, and reliability standpoints.

| Task | Done When |
|------|-----------|
| Full Playwright E2E test suite (all P0/P1 flows) | All tests pass in CI |
| Integration test coverage >= 80% for API endpoints | Coverage report confirms |
| Accessibility audit (axe-core + manual VoiceOver) | 0 critical/serious violations |
| Security penetration test (internal scope) | No critical findings unresolved |
| OWASP Top 10 review and remediation | Checklist fully addressed |
| Performance test (k6 — 1,000 VU steady-state) | Thresholds all green |
| GDPR compliance review (deletion, export, consent) | All flows verified |
| Sentry error tracking + alert rules | Alerts operational |
| Datadog APM dashboards + SLO alerts | Dashboards live |
| Production environment parity check | Staging mirrors prod infra |
| Runbook documentation | Runbooks in /docs/runbooks |
| Load test database under realistic write load | No lock contention detected |

---

### Milestone 8 — Beta & Go-to-Market (Weeks 15–16)

**Goal:** Controlled beta launch with 10–25 design partners; feedback loop initiated.

| Task | Done When |
|------|-----------|
| Stripe billing integration (subscriptions, webhooks) | Plans purchasable |
| Free trial logic (14-day, then paywall) | Trial enforced correctly |
| In-app upgrade modal on premium feature access | Modal shows correct plan features |
| Onboarding email sequence (Resend, 7-day drip) | Drip sequence active |
| In-app changelog / "What's New" panel | Release notes visible |
| Feedback widget integration | Widget embedded, feedback captured |
| Help center / chat widget (Intercom) | Chat widget live |
| Beta user onboarding (10 orgs onboarded) | 10 beta orgs active |
| Public roadmap published | Roadmap visible on website |
| Marketing site finalized (SEO, OG images) | Lighthouse score > 90 |
| Production go-live + announcement | Platform live at app.hiretrack.ai |

---

## Appendix A — Architecture Decision Records (ADRs)

| ADR | Title | Status |
|-----|-------|--------|
| ADR-001 | Choose Next.js App Router over Pages Router | Accepted |
| ADR-002 | Use NestJS for API instead of Next.js API Routes only | Accepted |
| ADR-003 | Multi-tenancy via application-layer org_id, not schema-per-tenant | Accepted |
| ADR-004 | JWT with refresh token rotation vs. server sessions | Accepted |
| ADR-005 | BullMQ over SQS for job queue (MVP cost/complexity tradeoff) | Accepted |
| ADR-006 | Turborepo monorepo vs. polyrepo | Accepted |
| ADR-007 | OpenAI GPT-4o with model-agnostic abstraction layer | Accepted |
| ADR-008 | Cursor-based pagination for activity feeds, offset for lists | Accepted |

---

## Appendix B — Key Performance Indicators

### Business KPIs (Month 6 Targets)
| KPI | Target |
|-----|--------|
| Monthly Active Organizations | 100 |
| Paying Organizations | 40 |
| MRR | $15,000 |
| Average time-to-hire reduction | 40% |
| NPS Score | >= 45 |
| Monthly Churn Rate | < 5% |

### Engineering KPIs
| KPI | Target |
|-----|--------|
| Deployment frequency | Multiple per day |
| Lead time for changes | < 1 day |
| Change failure rate | < 5% |
| Mean time to recovery (MTTR) | < 30 minutes |
| Unit test coverage | >= 80% |
| API p95 response time | < 300ms |

---

*Document Version 1.0.0 — HireTrack AI Engineering Team — 2026-07-10*  
*Next Review: 2026-08-01 (post-MVP sprint retrospective)*
