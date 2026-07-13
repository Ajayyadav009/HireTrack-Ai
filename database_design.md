# HireTrack AI — Complete PostgreSQL Database Design

> **Version:** 1.0.0  
> **Date:** 2026-07-10  
> **Database Engine:** PostgreSQL 16  
> **ORM Layer:** Prisma (schema mirrors this design exactly)  
> **Classification:** Engineering Reference Document

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Enumerations (ENUMs)](#2-enumerations-enums)
3. [ER Diagram](#3-er-diagram)
4. [Table Definitions](#4-table-definitions)
5. [Index Strategy](#5-index-strategy)
6. [Cascade Rules Summary](#6-cascade-rules-summary)
7. [Relationship Map](#7-relationship-map)
8. [Row-Level Security Notes](#8-row-level-security-notes)
9. [Partitioning Strategy](#9-partitioning-strategy)
10. [Extension Requirements](#10-extension-requirements)

---

## 1. Design Principles

| Principle | Rule | Rationale |
|-----------|------|-----------|
| **Universal Primary Keys** | All tables use `UUID` (v7, monotonically sortable) | Prevents enumeration attacks; works across distributed systems; safe to expose in URLs |
| **Tenant Isolation** | All tenant-scoped tables include `organization_id UUID NOT NULL` | Application-layer multi-tenancy; every query filters by `organization_id` before any other condition |
| **Soft Deletes** | Critical entities carry `deleted_at TIMESTAMPTZ` | Enables undo, audit trail, and GDPR-compliant data lifecycle management without data loss |
| **Immutable Audit Log** | `audit_logs` has no UPDATE or DELETE privileges | Tamper-evident compliance trail for SOC 2 and EEOC requirements |
| **JSONB for Extensibility** | Structured but opaque blobs stored as `JSONB` | Allows product evolution without schema migrations for user-defined fields |
| **Timestamps on Everything** | Every table has `created_at` and `updated_at` | Enables timeline reconstruction, cache invalidation, and incremental sync |
| **Normalization First** | 3NF minimum; denormalize only where query performance requires it | Avoids update anomalies; denormalization documented explicitly |
| **Explicit Cascade Rules** | Every FK defines `ON DELETE` behavior explicitly | Prevents accidental orphaned data; makes relationships self-documenting |
| **UTC Storage** | All timestamps stored as `TIMESTAMPTZ` in UTC | Timezone conversions handled at the application layer; avoids DST ambiguity |
| **Encrypted at Rest** | Sensitive columns noted with `-- ENCRYPTED` comment | AWS RDS transparent encryption covers disk; column-level encryption for OAuth tokens and MFA secrets |

---

## 2. Enumerations (ENUMs)

Enumerations are defined as PostgreSQL `ENUM` types for storage efficiency, automatic constraint enforcement, and self-documenting schema.

```sql
-- ============================================================
-- AUTHENTICATION & IDENTITY
-- ============================================================

CREATE TYPE oauth_provider AS ENUM (
    'google',
    'github',
    'microsoft',
    'saml'
);

-- ============================================================
-- ORGANIZATION & MEMBERSHIP
-- ============================================================

CREATE TYPE membership_role AS ENUM (
    'owner',
    'admin',
    'recruiter',
    'hiring_manager',
    'interviewer',
    'viewer'
);

CREATE TYPE membership_status AS ENUM (
    'pending',
    'active',
    'suspended',
    'deactivated'
);

CREATE TYPE org_plan AS ENUM (
    'free',
    'growth',
    'enterprise',
    'custom'
);

CREATE TYPE org_size AS ENUM (
    '1_to_10',
    '11_to_50',
    '51_to_200',
    '201_to_500',
    '501_to_1000',
    '1001_to_5000',
    '5001_plus'
);

-- ============================================================
-- JOBS
-- ============================================================

CREATE TYPE job_status AS ENUM (
    'draft',
    'pending_approval',
    'open',
    'paused',
    'closed',
    'archived'
);

CREATE TYPE employment_type AS ENUM (
    'full_time',
    'part_time',
    'contract',
    'contract_to_hire',
    'internship',
    'temporary',
    'volunteer'
);

CREATE TYPE work_location_type AS ENUM (
    'remote',
    'hybrid',
    'on_site'
);

CREATE TYPE experience_level AS ENUM (
    'internship',
    'entry',
    'mid',
    'senior',
    'staff',
    'principal',
    'director',
    'vp',
    'c_level'
);

CREATE TYPE job_team_member_role AS ENUM (
    'recruiter',
    'hiring_manager',
    'interviewer',
    'coordinator',
    'executive_approver'
);

-- ============================================================
-- CANDIDATES & APPLICATIONS
-- ============================================================

CREATE TYPE candidate_source AS ENUM (
    'careers_page',
    'linkedin',
    'indeed',
    'glassdoor',
    'wellfound',
    'referral',
    'agency',
    'headhunted',
    'csv_import',
    'api',
    'manual',
    'other'
);

CREATE TYPE application_status AS ENUM (
    'active',
    'rejected',
    'withdrawn',
    'hired',
    'on_hold'
);

CREATE TYPE rejection_reason AS ENUM (
    'overqualified',
    'underqualified',
    'skills_mismatch',
    'culture_fit',
    'salary_expectations',
    'location_conflict',
    'no_longer_available',
    'offer_declined',
    'better_candidate_chosen',
    'position_cancelled',
    'other'
);

CREATE TYPE pipeline_stage_type AS ENUM (
    'sourced',
    'applied',
    'screening',
    'assessment',
    'interview',
    'panel',
    'reference_check',
    'offer',
    'hired',
    'rejected',
    'custom'
);

-- ============================================================
-- INTERVIEWS & SCORECARDS
-- ============================================================

CREATE TYPE interview_type AS ENUM (
    'phone_screen',
    'video_screen',
    'technical_screen',
    'coding_challenge',
    'system_design',
    'behavioral',
    'case_study',
    'panel',
    'on_site',
    'culture_fit',
    'executive',
    'reference'
);

CREATE TYPE interview_status AS ENUM (
    'scheduled',
    'rescheduled',
    'completed',
    'cancelled',
    'no_show_candidate',
    'no_show_interviewer'
);

CREATE TYPE panelist_role AS ENUM (
    'lead',
    'interviewer',
    'shadow'
);

CREATE TYPE scorecard_recommendation AS ENUM (
    'strong_yes',
    'yes',
    'neutral',
    'no',
    'strong_no'
);

-- ============================================================
-- COMMUNICATIONS
-- ============================================================

CREATE TYPE email_status AS ENUM (
    'draft',
    'queued',
    'sending',
    'sent',
    'delivered',
    'opened',
    'clicked',
    'bounced',
    'failed',
    'spam_reported'
);

CREATE TYPE email_template_type AS ENUM (
    'application_received',
    'application_rejected',
    'interview_invitation',
    'interview_reminder',
    'interview_cancelled',
    'interview_rescheduled',
    'scorecard_request',
    'offer_extended',
    'offer_accepted',
    'offer_declined',
    'hire_confirmation',
    'pipeline_update',
    'general_outreach',
    'custom'
);

-- ============================================================
-- NOTIFICATIONS & WEBHOOKS
-- ============================================================

CREATE TYPE notification_type AS ENUM (
    'mention',
    'scorecard_due',
    'interview_reminder',
    'application_received',
    'stage_moved',
    'offer_decision',
    'member_invited',
    'member_joined',
    'feedback_requested',
    'system'
);

CREATE TYPE notification_channel AS ENUM (
    'in_app',
    'email',
    'slack',
    'teams'
);

CREATE TYPE webhook_event AS ENUM (
    'candidate.created',
    'candidate.updated',
    'candidate.deleted',
    'application.created',
    'application.stage_changed',
    'application.rejected',
    'application.hired',
    'interview.scheduled',
    'interview.completed',
    'interview.cancelled',
    'scorecard.submitted',
    'offer.extended',
    'offer.accepted',
    'offer.declined',
    'job.created',
    'job.published',
    'job.closed',
    'member.invited',
    'member.joined'
);

CREATE TYPE webhook_delivery_status AS ENUM (
    'pending',
    'success',
    'failed',
    'retrying'
);

-- ============================================================
-- AUDIT
-- ============================================================

CREATE TYPE audit_action AS ENUM (
    'candidate.created', 'candidate.updated', 'candidate.deleted',
    'candidate.merged', 'candidate.tagged', 'candidate.untagged',
    'candidate.gdpr_deletion_requested', 'candidate.gdpr_deleted',
    'application.created', 'application.stage_moved',
    'application.rejected', 'application.hired', 'application.withdrawn',
    'job.created', 'job.updated', 'job.published',
    'job.paused', 'job.closed', 'job.deleted', 'job.duplicated',
    'interview.scheduled', 'interview.rescheduled',
    'interview.completed', 'interview.cancelled',
    'scorecard.submitted', 'scorecard.updated',
    'member.invited', 'member.joined', 'member.role_changed',
    'member.suspended', 'member.removed',
    'org.created', 'org.updated', 'org.plan_changed',
    'auth.login', 'auth.logout', 'auth.password_reset',
    'auth.mfa_enabled', 'auth.mfa_disabled',
    'auth.api_key_created', 'auth.api_key_revoked',
    'email.sent', 'email.template_created', 'email.template_updated'
);
```

---

## 3. ER Diagram

```
+------------------------------------------------ AUTHENTICATION CLUSTER ------------------------------------------------+
|                                                                                                                        |
|  users (id PK, email UNIQUE, password_hash, mfa_enabled, mfa_secret ENCRYPTED, ...)                                   |
|    |                                                                                                                   |
|    +--[1:N]--> oauth_accounts (id PK, user_id FK, provider ENUM, provider_user_id, access_token ENCRYPTED, ...)       |
|    |                                                                                                                   |
|    +--[1:N]--> sessions (id PK, user_id FK, token_hash UNIQUE, expires_at, revoked_at, ip_address, ...)               |
|    |                                                                                                                   |
+----+-------------------------------------------------------------------------------------------------------------------+
     |
     | [N:M via memberships]
     |
+----+------------------------------------------------------- ORGANIZATION CLUSTER ------------------------------------+
|    |                                                                                                                  |
|  memberships (id PK, user_id FK, organization_id FK, role ENUM, status ENUM, invitation_token, ...)                  |
|    |                                                                                                                  |
|  organizations (id PK, name, slug UNIQUE, plan ENUM, owner_id FK->users, ...)                                        |
|    |                                                                                                                  |
|    +--[1:N]--> departments (id PK, org_id FK, name, parent_id FK->self [self-referencing hierarchy])                 |
|    |                                                                                                                  |
|    +--[1:N]--> pipelines (id PK, org_id FK, name, is_template)                                                       |
|    |               |                                                                                                  |
|    |               +--[1:N]--> pipeline_stages (id PK, pipeline_id FK, name, type ENUM, position, automation_config) |
|    |                                                                                                                  |
|    +--[1:N]--> jobs (id PK, org_id FK, dept_id FK, pipeline_id FK, title, status ENUM, ai_scoring_config JSONB, ...) |
|    |               |                                                                                                  |
|    |               +--[1:N]--> job_team_members (id PK, job_id FK, user_id FK, role ENUM)                            |
|    |               |                                                                                                  |
|    |               +--[1:N]--> applications (see APPLICATION CLUSTER)                                                |
|    |                                                                                                                  |
|    +--[1:N]--> candidates (see CANDIDATE CLUSTER)                                                                     |
|    |                                                                                                                  |
|    +--[1:N]--> tags (id PK, org_id FK, name, color)                                                                  |
|    +--[1:N]--> email_templates (id PK, org_id FK, type ENUM, subject, body_html, variables TEXT[])                   |
|    +--[1:N]--> api_keys (id PK, org_id FK, key_prefix, key_hash UNIQUE, scopes TEXT[], revoked_at)                   |
|    +--[1:N]--> webhooks (id PK, org_id FK, url, events ENUM[], secret ENCRYPTED)                                     |
|    |               +--[1:N]--> webhook_deliveries (id PK, webhook_id FK, event, payload JSONB, status ENUM)          |
|    +--[1:1]--> billing_subscriptions (id PK, org_id FK UNIQUE, plan_id FK, stripe_customer_id, status)              |
|                                                                                                                      |
+----------------------------------------------------------------------------------------------------------------------+

+------------------------------------------------- CANDIDATE CLUSTER --------------------------------------------------+
|                                                                                                                      |
|  candidates (id PK, org_id FK, email, resume_url, parsed_data JSONB, skills TEXT[], source ENUM, ...)               |
|    |                                                                                                                  |
|    +--[1:N]--> candidate_work_experiences (id PK, candidate_id FK, company, title, start_date, end_date)            |
|    +--[1:N]--> candidate_educations (id PK, candidate_id FK, institution, degree, field_of_study, end_year)         |
|    +--[N:M via candidate_tags]--> tags (candidate_id FK, tag_id FK)                                                  |
|    +--[1:N]--> notes (id PK, candidate_id FK, application_id FK NULL, author_id FK, content, mentions UUID[])       |
|    +--[1:N]--> emails (id PK, candidate_id FK, application_id FK NULL, template_id FK NULL, status ENUM, ...)       |
|                                                                                                                      |
+----------------------------------------------------------------------------------------------------------------------+

+----------------------------------------------- APPLICATION CLUSTER -------------------------------------------------+
|                                                                                                                      |
|  applications (id PK, job_id FK, candidate_id FK, stage_id FK, status ENUM, ai_score, ai_score_breakdown JSONB)    |
|    |                                                                                                                  |
|    +--[1:N]--> application_stage_transitions (id PK, application_id FK, from_stage_id FK, to_stage_id FK,          |
|    |                                          moved_by FK, transitioned_at, time_in_from_stage_hours)               |
|    |           [APPEND-ONLY: no UPDATE/DELETE]                                                                       |
|    |                                                                                                                  |
|    +--[1:N]--> interviews (id PK, application_id FK, type ENUM, status ENUM, scheduled_at, end_at GENERATED, ...)   |
|                    |                                                                                                  |
|                    +--[1:N]--> interview_panelists (id PK, interview_id FK, user_id FK, role ENUM,                  |
|                    |                                scorecard_id FK NULL, feedback_submitted_at)                     |
|                    |                                                                                                  |
|                    +--[1:N]--> scorecards (id PK, interview_id FK, interviewer_id FK, overall_rating,               |
|                                           recommendation ENUM, criterion_responses JSONB, summary)                   |
|                                    |                                                                                  |
|                                    +--[N:1]--> scorecard_templates (id PK, org_id FK, name, criteria JSONB)         |
|                                                                                                                      |
+----------------------------------------------------------------------------------------------------------------------+

+----------------------------------------------- OPERATIONS CLUSTER --------------------------------------------------+
|                                                                                                                      |
|  audit_logs (id PK, org_id, actor_user_id, actor_email DENORM, action ENUM, resource_type, changes JSONB, ...)     |
|  [APPEND-ONLY: no UPDATE/DELETE]                                                                                     |
|                                                                                                                      |
|  notifications (id PK, user_id FK, type ENUM, is_read, resource_type, resource_id, ...)                             |
|                                                                                                                      |
|  automation_rules (id PK, org_id FK, trigger_event ENUM, trigger_conditions JSONB, action_type, action_config)     |
|                                                                                                                      |
|  subscription_plans (id PK, code UNIQUE, name, features JSONB, max_active_jobs, max_members)                        |
|                                                                                                                      |
+----------------------------------------------------------------------------------------------------------------------+
```

---

## 4. Table Definitions

### 4.1 `users`

**Why it exists:** The foundational identity record for every human actor in the system. A user exists independently of any organization — they may belong to multiple organizations via the `memberships` table. This separation is critical for multi-tenancy: user identity is global, but access and roles are always organization-scoped.

```sql
CREATE TABLE users (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Core Identity
    email                   VARCHAR(255)    NOT NULL,
    email_verified_at       TIMESTAMPTZ     NULL,
    name                    VARCHAR(255)    NOT NULL,
    avatar_url              TEXT            NULL,

    -- Authentication
    password_hash           VARCHAR(255)    NULL,           -- NULL for OAuth-only accounts (bcrypt, cost=12)
    mfa_enabled             BOOLEAN         NOT NULL DEFAULT FALSE,
    mfa_secret              TEXT            NULL,           -- ENCRYPTED: AES-256-GCM encrypted TOTP secret
    mfa_backup_codes        TEXT[]          NULL,           -- ENCRYPTED: array of hashed one-time backup codes
    failed_login_attempts   SMALLINT        NOT NULL DEFAULT 0,
    locked_until            TIMESTAMPTZ     NULL,

    -- Preferences
    timezone                VARCHAR(100)    NOT NULL DEFAULT 'UTC',
    locale                  VARCHAR(10)     NOT NULL DEFAULT 'en',
    notification_preferences JSONB          NOT NULL DEFAULT '{}',

    -- Activity
    last_login_at           TIMESTAMPTZ     NULL,
    last_active_at          TIMESTAMPTZ     NULL,

    -- Lifecycle
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ     NULL,

    -- Constraints
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_email_format CHECK (
        email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT users_name_length CHECK (char_length(name) BETWEEN 1 AND 255),
    CONSTRAINT users_failed_attempts_non_negative CHECK (failed_login_attempts >= 0),
    CONSTRAINT users_mfa_secret_requires_enabled CHECK (
        (mfa_enabled = TRUE AND mfa_secret IS NOT NULL) OR
        (mfa_enabled = FALSE)
    )
);

CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 4.2 `oauth_accounts`

**Why it exists:** Separating OAuth credentials from the core `users` record allows clean token rotation, provider-specific metadata, and multiple providers per user (Google + GitHub) without nullable provider columns polluting `users`. One user can link multiple OAuth providers.

```sql
CREATE TABLE oauth_accounts (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL
                        REFERENCES users(id)
                        ON DELETE CASCADE,
    provider            oauth_provider  NOT NULL,
    provider_user_id    VARCHAR(255)    NOT NULL,
    provider_email      VARCHAR(255)    NULL,
    access_token        TEXT            NULL,               -- ENCRYPTED at application layer
    refresh_token       TEXT            NULL,               -- ENCRYPTED at application layer
    token_scope         TEXT            NULL,
    expires_at          TIMESTAMPTZ     NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT oauth_accounts_provider_user_unique UNIQUE (provider, provider_user_id),
    CONSTRAINT oauth_accounts_user_provider_unique UNIQUE (user_id, provider)
);

CREATE INDEX idx_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX idx_oauth_accounts_provider_lookup ON oauth_accounts(provider, provider_user_id);
```

---

### 4.3 `sessions`

**Why it exists:** Stateless JWTs cannot be revoked once issued. This table provides server-side refresh token tracking, enabling session listing (UI: "Active sessions"), individual session revocation, and token rotation. Actual tokens are never stored — only SHA-256 hashes.

```sql
CREATE TABLE sessions (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL
                        REFERENCES users(id)
                        ON DELETE CASCADE,
    token_hash          VARCHAR(64)     NOT NULL,           -- SHA-256 of the actual refresh token
    device_fingerprint  TEXT            NULL,
    ip_address          INET            NULL,
    user_agent          TEXT            NULL,
    country_code        CHAR(2)         NULL,
    city                VARCHAR(100)    NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    last_used_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ     NOT NULL,
    revoked_at          TIMESTAMPTZ     NULL,               -- NULL = active

    CONSTRAINT sessions_token_hash_unique UNIQUE (token_hash),
    CONSTRAINT sessions_expires_after_created CHECK (expires_at > created_at)
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_active ON sessions(user_id, expires_at)
    WHERE revoked_at IS NULL;
```

---

### 4.4 `organizations`

**Why it exists:** The top-level tenant entity. Every piece of hiring data belongs to an organization. The `slug` field powers the public careers page URL (`/careers/{slug}`). The `feature_flags` JSONB allows plan-based feature overrides without schema changes.

```sql
CREATE TABLE organizations (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(255)    NOT NULL,
    slug                VARCHAR(100)    NOT NULL,
    logo_url            TEXT            NULL,
    website             TEXT            NULL,
    description         TEXT            NULL,
    industry            VARCHAR(100)    NULL,
    size                org_size        NULL,
    timezone            VARCHAR(100)    NOT NULL DEFAULT 'UTC',
    locale              VARCHAR(10)     NOT NULL DEFAULT 'en',
    currency            CHAR(3)         NOT NULL DEFAULT 'USD',
    plan                org_plan        NOT NULL DEFAULT 'free',
    plan_started_at     TIMESTAMPTZ     NULL,
    plan_expires_at     TIMESTAMPTZ     NULL,
    trial_ends_at       TIMESTAMPTZ     NULL,
    owner_id            UUID            NOT NULL
                        REFERENCES users(id)
                        ON DELETE RESTRICT,
    careers_page_enabled BOOLEAN        NOT NULL DEFAULT TRUE,
    careers_page_custom_domain TEXT     NULL,
    careers_page_brand  JSONB           NOT NULL DEFAULT '{}',
    feature_flags       JSONB           NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ     NULL,

    CONSTRAINT organizations_slug_unique UNIQUE (slug),
    CONSTRAINT organizations_slug_format CHECK (
        slug ~* '^[a-z0-9][a-z0-9\-]{1,98}[a-z0-9]$'
    ),
    CONSTRAINT organizations_slug_not_reserved CHECK (
        slug NOT IN (
            'admin', 'api', 'app', 'www', 'staging', 'production',
            'careers', 'jobs', 'apply', 'health', 'metrics', 'blog',
            'pricing', 'about', 'legal', 'support', 'help'
        )
    ),
    CONSTRAINT organizations_name_length CHECK (char_length(name) BETWEEN 2 AND 255),
    CONSTRAINT organizations_valid_currency CHECK (char_length(currency) = 3)
);

CREATE UNIQUE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_owner ON organizations(owner_id);
CREATE INDEX idx_organizations_plan ON organizations(plan)
    WHERE deleted_at IS NULL;
```

---

### 4.5 `memberships`

**Why it exists:** Role-based access is org-scoped. A user needs different permissions in different organizations. `memberships` models this cleanly and doubles as the invitation workflow state machine — tracking the full lifecycle from invite-sent to active-member in a single record.

```sql
CREATE TABLE memberships (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    user_id             UUID            NOT NULL
                        REFERENCES users(id)
                        ON DELETE CASCADE,
    role                membership_role NOT NULL DEFAULT 'viewer',
    status              membership_status NOT NULL DEFAULT 'pending',
    department_id       UUID            NULL
                        REFERENCES departments(id)
                        ON DELETE SET NULL,
    invited_by          UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    invitation_email    VARCHAR(255)    NOT NULL,
    invitation_token    VARCHAR(64)     NULL,               -- SHA-256 of the token sent in email
    invitation_expires_at TIMESTAMPTZ  NULL,
    invited_at          TIMESTAMPTZ     NULL,
    accepted_at         TIMESTAMPTZ     NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT memberships_user_org_unique UNIQUE (organization_id, user_id),
    CONSTRAINT memberships_invitation_token_unique UNIQUE (invitation_token),
    CONSTRAINT memberships_accepted_requires_active CHECK (
        (accepted_at IS NOT NULL AND status IN ('active', 'suspended', 'deactivated')) OR
        (accepted_at IS NULL)
    )
);

CREATE INDEX idx_memberships_org_id ON memberships(organization_id);
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_org_role ON memberships(organization_id, role)
    WHERE status = 'active';
CREATE INDEX idx_memberships_invitation_token ON memberships(invitation_token)
    WHERE invitation_token IS NOT NULL;
CREATE INDEX idx_memberships_active ON memberships(organization_id, user_id)
    WHERE status = 'active';
```

---

### 4.6 `departments`

**Why it exists:** Enterprise hiring requires organizational context. Departments enable analytics sliced by team ("Engineering has 12 open reqs"), permission scoping ("Hiring Manager in Engineering sees only Engineering jobs"), and headcount planning. The self-referencing `parent_id` models real org charts (Engineering -> Backend -> Platform Team).

```sql
CREATE TABLE departments (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    name                VARCHAR(255)    NOT NULL,
    parent_id           UUID            NULL
                        REFERENCES departments(id)
                        ON DELETE RESTRICT,
    description         TEXT            NULL,
    head_user_id        UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT departments_name_length CHECK (char_length(name) BETWEEN 1 AND 255),
    CONSTRAINT departments_no_self_parent CHECK (parent_id != id),
    CONSTRAINT departments_name_unique_per_org UNIQUE (organization_id, name)
);

CREATE INDEX idx_departments_org_id ON departments(organization_id);
CREATE INDEX idx_departments_parent_id ON departments(parent_id)
    WHERE parent_id IS NOT NULL;
```

---

### 4.7 `pipelines`

**Why it exists:** Without a `pipelines` table, every job would independently define its stages, leading to inconsistent hiring processes and unreliable cross-job analytics. Centralizing pipeline templates ensures a consistent vocabulary while still allowing job-specific customization via cloning.

```sql
CREATE TABLE pipelines (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    name                VARCHAR(255)    NOT NULL,
    description         TEXT            NULL,
    is_default          BOOLEAN         NOT NULL DEFAULT FALSE,
    is_template         BOOLEAN         NOT NULL DEFAULT TRUE,
    created_by          UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pipelines_name_length CHECK (char_length(name) BETWEEN 1 AND 255)
);

CREATE UNIQUE INDEX idx_pipelines_one_default_per_org
    ON pipelines(organization_id)
    WHERE is_default = TRUE;
CREATE INDEX idx_pipelines_org_id ON pipelines(organization_id);
```

---

### 4.8 `pipeline_stages`

**Why it exists:** The stage is the fundamental unit of hiring pipeline progress. Every candidate movement, automation trigger, and analytics measurement (time-in-stage, conversion rate) is anchored to a pipeline stage. The `automation_config` JSONB stores what happens automatically when a candidate enters this stage, making the pipeline self-contained.

```sql
CREATE TABLE pipeline_stages (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id         UUID            NOT NULL
                        REFERENCES pipelines(id)
                        ON DELETE CASCADE,
    name                VARCHAR(255)    NOT NULL,
    type                pipeline_stage_type NOT NULL DEFAULT 'custom',
    position            SMALLINT        NOT NULL,
    color               CHAR(7)         NOT NULL DEFAULT '#6366f1',
    automation_config   JSONB           NOT NULL DEFAULT '{}',
    -- on_enter: {send_email_template_id, create_scorecard_template_id, notify_slack_channel, notify_members[]}
    -- on_exit:  {send_email_template_id}
    sla_days            SMALLINT        NULL,               -- Alert if candidate exceeds this many days in stage
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pipeline_stages_name_length CHECK (char_length(name) BETWEEN 1 AND 255),
    CONSTRAINT pipeline_stages_position_non_negative CHECK (position >= 0),
    CONSTRAINT pipeline_stages_color_format CHECK (color ~* '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT pipeline_stages_position_unique UNIQUE (pipeline_id, position),
    CONSTRAINT pipeline_stages_sla_positive CHECK (sla_days IS NULL OR sla_days > 0)
);

CREATE INDEX idx_pipeline_stages_pipeline_id ON pipeline_stages(pipeline_id);
CREATE INDEX idx_pipeline_stages_ordered ON pipeline_stages(pipeline_id, position);
```

---

### 4.9 `jobs`

**Why it exists:** The job requisition is the organizing unit of hiring. Without it, candidates and interviews have no context. The `ai_scoring_config` JSONB allows per-role customization of AI scoring (an Engineer role weights skills at 40%; a Sales role might weight culture at 35%). The `hired_count` is a denormalized counter maintained by trigger for fast Kanban display.

```sql
CREATE TABLE jobs (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    department_id       UUID            NULL
                        REFERENCES departments(id)
                        ON DELETE SET NULL,
    pipeline_id         UUID            NULL
                        REFERENCES pipelines(id)
                        ON DELETE SET NULL,
    title               VARCHAR(255)    NOT NULL,
    slug                VARCHAR(255)    NOT NULL,
    internal_code       VARCHAR(100)    NULL,
    description         TEXT            NULL,               -- Rich HTML, sanitized
    requirements        TEXT            NULL,
    responsibilities    TEXT            NULL,
    benefits            TEXT            NULL,
    ai_jd_generated     BOOLEAN         NOT NULL DEFAULT FALSE,
    employment_type     employment_type NOT NULL DEFAULT 'full_time',
    work_location_type  work_location_type NOT NULL DEFAULT 'on_site',
    experience_level    experience_level NULL,
    location_city       VARCHAR(255)    NULL,
    location_state      VARCHAR(100)    NULL,
    location_country    CHAR(2)         NULL,               -- ISO 3166-1 alpha-2
    location_timezone   VARCHAR(100)    NULL,
    salary_min          NUMERIC(12, 2)  NULL,
    salary_max          NUMERIC(12, 2)  NULL,
    salary_currency     CHAR(3)         NOT NULL DEFAULT 'USD',
    salary_public       BOOLEAN         NOT NULL DEFAULT FALSE,
    headcount           SMALLINT        NOT NULL DEFAULT 1,
    hired_count         SMALLINT        NOT NULL DEFAULT 0, -- Denormalized; maintained by trigger
    status              job_status      NOT NULL DEFAULT 'draft',
    is_confidential     BOOLEAN         NOT NULL DEFAULT FALSE,
    ai_scoring_config   JSONB           NOT NULL DEFAULT '{}',
    -- {required_skills[], nice_to_have_skills[], disqualifiers[], weights: {skills, experience, education, culture}}
    created_by          UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    published_at        TIMESTAMPTZ     NULL,
    closes_at           TIMESTAMPTZ     NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ     NULL,
    custom_fields       JSONB           NOT NULL DEFAULT '{}',

    CONSTRAINT jobs_slug_unique_per_org UNIQUE (organization_id, slug),
    CONSTRAINT jobs_title_length CHECK (char_length(title) BETWEEN 2 AND 255),
    CONSTRAINT jobs_salary_range_valid CHECK (
        salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max
    ),
    CONSTRAINT jobs_headcount_positive CHECK (headcount >= 1),
    CONSTRAINT jobs_hired_count_non_negative CHECK (hired_count >= 0),
    CONSTRAINT jobs_hired_not_exceed_headcount CHECK (hired_count <= headcount),
    CONSTRAINT jobs_closes_future CHECK (closes_at IS NULL OR closes_at > created_at),
    CONSTRAINT jobs_currency_length CHECK (char_length(salary_currency) = 3)
);

CREATE INDEX idx_jobs_org_id ON jobs(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_org_status ON jobs(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_department ON jobs(department_id);
CREATE INDEX idx_jobs_pipeline ON jobs(pipeline_id);
CREATE INDEX idx_jobs_public_listing ON jobs(organization_id, status, published_at)
    WHERE status = 'open' AND deleted_at IS NULL;
CREATE INDEX idx_jobs_fts ON jobs USING GIN(
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))
);

-- Trigger: Maintain hired_count when application status changes to/from 'hired'
CREATE OR REPLACE FUNCTION update_job_hired_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'hired' AND OLD.status != 'hired' THEN
        UPDATE jobs SET hired_count = hired_count + 1 WHERE id = NEW.job_id;
    ELSIF OLD.status = 'hired' AND NEW.status != 'hired' THEN
        UPDATE jobs SET hired_count = GREATEST(0, hired_count - 1) WHERE id = NEW.job_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applications_update_hired_count
    AFTER UPDATE OF status ON applications
    FOR EACH ROW EXECUTE FUNCTION update_job_hired_count();
```

---

### 4.10 `job_team_members`

**Why it exists:** Without job-level team assignment, every recruiter and hiring manager would see every job — a privacy concern and UX problem at scale. This table enables the "assigned jobs only" permission scoping for Hiring Manager roles and drives targeted notifications ("You have a new application for Senior Engineer").

```sql
CREATE TABLE job_team_members (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id              UUID            NOT NULL
                        REFERENCES jobs(id)
                        ON DELETE CASCADE,
    user_id             UUID            NOT NULL
                        REFERENCES users(id)
                        ON DELETE CASCADE,
    role                job_team_member_role NOT NULL,
    notify_on_apply     BOOLEAN         NOT NULL DEFAULT FALSE,
    notify_on_stage_change BOOLEAN      NOT NULL DEFAULT FALSE,
    added_by            UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    added_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT job_team_members_unique UNIQUE (job_id, user_id, role)
);

CREATE INDEX idx_job_team_members_job_id ON job_team_members(job_id);
CREATE INDEX idx_job_team_members_user_id ON job_team_members(user_id);
```

---

### 4.11 `candidates`

**Why it exists:** The candidate profile is the central asset of any ATS. It must exist independently of any single job application so that: (1) a candidate can apply to multiple roles, (2) recruiters can build talent pools, (3) historical data is preserved after a job closes. The `parsed_data` JSONB allows the resume parsing system to evolve its output schema without database migrations.

```sql
CREATE TABLE candidates (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    first_name          VARCHAR(255)    NOT NULL,
    last_name           VARCHAR(255)    NOT NULL,
    email               VARCHAR(255)    NOT NULL,
    phone               VARCHAR(50)     NULL,               -- E.164 format: +12025551234
    location_city       VARCHAR(255)    NULL,
    location_state      VARCHAR(100)    NULL,
    location_country    CHAR(2)         NULL,
    headline            TEXT            NULL,               -- "Senior Backend Engineer at Stripe"
    current_company     VARCHAR(255)    NULL,
    current_title       VARCHAR(255)    NULL,
    experience_years    NUMERIC(4, 1)   NULL,
    linkedin_url        TEXT            NULL,
    github_url          TEXT            NULL,
    portfolio_url       TEXT            NULL,
    twitter_url         TEXT            NULL,
    resume_url          TEXT            NULL,               -- S3 pre-signed base URL
    resume_filename     VARCHAR(500)    NULL,
    resume_uploaded_at  TIMESTAMPTZ     NULL,
    parsed_data         JSONB           NULL,               -- Structured output from parsing worker
    -- {skills[], languages[], certifications[], summary_raw, parse_version, parsed_at}
    ai_summary          TEXT            NULL,               -- 2-3 paragraph narrative (GPT-4o)
    ai_summary_generated_at TIMESTAMPTZ NULL,
    skills              TEXT[]          NOT NULL DEFAULT '{}', -- Denormalized from parsed_data for GIN filtering
    source              candidate_source NOT NULL DEFAULT 'manual',
    source_detail       TEXT            NULL,
    referrer_user_id    UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    is_blacklisted      BOOLEAN         NOT NULL DEFAULT FALSE,
    blacklist_reason    TEXT            NULL,
    blacklisted_by      UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    blacklisted_at      TIMESTAMPTZ     NULL,
    gdpr_consent_given  BOOLEAN         NOT NULL DEFAULT FALSE,
    gdpr_consent_at     TIMESTAMPTZ     NULL,
    gdpr_delete_requested_at TIMESTAMPTZ NULL,
    gdpr_deleted_at     TIMESTAMPTZ     NULL,
    merged_into_id      UUID            NULL
                        REFERENCES candidates(id)
                        ON DELETE SET NULL,
    added_by            UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ     NULL,
    custom_fields       JSONB           NOT NULL DEFAULT '{}',

    CONSTRAINT candidates_email_unique_per_org UNIQUE (organization_id, email),
    CONSTRAINT candidates_email_format CHECK (
        email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT candidates_experience_positive CHECK (experience_years IS NULL OR experience_years >= 0),
    CONSTRAINT candidates_blacklist_complete CHECK (
        (is_blacklisted = TRUE AND blacklisted_at IS NOT NULL) OR (is_blacklisted = FALSE)
    ),
    CONSTRAINT candidates_no_self_merge CHECK (merged_into_id != id)
);

CREATE INDEX idx_candidates_org_id ON candidates(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_candidates_email ON candidates(organization_id, email);
CREATE INDEX idx_candidates_skills ON candidates USING GIN(skills);
CREATE INDEX idx_candidates_source ON candidates(organization_id, source);
CREATE INDEX idx_candidates_merged ON candidates(merged_into_id) WHERE merged_into_id IS NOT NULL;
CREATE INDEX idx_candidates_gdpr ON candidates(gdpr_delete_requested_at)
    WHERE gdpr_delete_requested_at IS NOT NULL AND gdpr_deleted_at IS NULL;
CREATE INDEX idx_candidates_fts ON candidates USING GIN(
    to_tsvector('english',
        coalesce(first_name,'') || ' ' || coalesce(last_name,'') || ' ' ||
        coalesce(headline,'') || ' ' || coalesce(current_company,'')
    )
);
CREATE INDEX idx_candidates_parsed ON candidates USING GIN(parsed_data jsonb_path_ops);
```

---

### 4.12 `candidate_work_experiences`

**Why it exists:** Resume work history stored as structured rows (not JSONB) enables SQL-level filtering: "Find candidates with 3+ years at FAANG companies" or "All candidates previously in a Director role." This powers the "Similar Candidates" AI feature and advanced pipeline filtering.

```sql
CREATE TABLE candidate_work_experiences (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id        UUID            NOT NULL
                        REFERENCES candidates(id)
                        ON DELETE CASCADE,
    company             VARCHAR(255)    NOT NULL,
    title               VARCHAR(255)    NOT NULL,
    description         TEXT            NULL,
    location            VARCHAR(255)    NULL,
    start_date          DATE            NOT NULL,
    end_date            DATE            NULL,               -- NULL = current position
    is_current          BOOLEAN         NOT NULL DEFAULT FALSE,
    industry            VARCHAR(100)    NULL,
    company_size        org_size        NULL,
    is_ai_parsed        BOOLEAN         NOT NULL DEFAULT TRUE,
    position            SMALLINT        NOT NULL DEFAULT 0, -- 0 = most recent
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT work_exp_dates_valid CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT work_exp_current_no_end CHECK (
        (is_current = TRUE AND end_date IS NULL) OR (is_current = FALSE)
    ),
    CONSTRAINT work_exp_position_non_negative CHECK (position >= 0)
);

CREATE INDEX idx_work_exp_candidate ON candidate_work_experiences(candidate_id);
CREATE INDEX idx_work_exp_company ON candidate_work_experiences(company);
CREATE INDEX idx_work_exp_dates ON candidate_work_experiences(candidate_id, start_date DESC);
```

---

### 4.13 `candidate_educations`

**Why it exists:** Many roles have education requirements (degree level, field of study) that need to be displayed and filtered on. Normalized rows enable queries like "Find all candidates with Computer Science degrees" that are impossible on unstructured text.

```sql
CREATE TABLE candidate_educations (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id        UUID            NOT NULL
                        REFERENCES candidates(id)
                        ON DELETE CASCADE,
    institution         VARCHAR(255)    NOT NULL,
    degree              VARCHAR(100)    NULL,
    field_of_study      VARCHAR(255)    NULL,
    gpa                 NUMERIC(3, 2)   NULL,
    start_year          SMALLINT        NULL,
    end_year            SMALLINT        NULL,
    graduated_at        DATE            NULL,
    is_completed        BOOLEAN         NOT NULL DEFAULT TRUE,
    is_ai_parsed        BOOLEAN         NOT NULL DEFAULT TRUE,
    position            SMALLINT        NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT education_gpa_range CHECK (gpa IS NULL OR (gpa >= 0.00 AND gpa <= 4.00)),
    CONSTRAINT education_years_valid CHECK (
        start_year IS NULL OR end_year IS NULL OR end_year >= start_year
    ),
    CONSTRAINT education_year_range CHECK (
        start_year IS NULL OR (start_year >= 1900 AND start_year <= 2100)
    )
);

CREATE INDEX idx_education_candidate ON candidate_educations(candidate_id);
```

---

### 4.14 `applications`

**Why it exists:** The application cleanly separates "who is this person" (candidate) from "how are they performing in this specific hiring process" (application). A candidate who applies to 3 jobs has 3 applications, each with their own AI score, stage position, and outcome — none of which should bleed into the others. This is the most queried table in the system.

```sql
CREATE TABLE applications (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id              UUID            NOT NULL
                        REFERENCES jobs(id)
                        ON DELETE CASCADE,
    candidate_id        UUID            NOT NULL
                        REFERENCES candidates(id)
                        ON DELETE CASCADE,
    stage_id            UUID            NOT NULL
                        REFERENCES pipeline_stages(id)
                        ON DELETE RESTRICT,                -- Cannot delete a stage with active candidates
    status              application_status NOT NULL DEFAULT 'active',
    rejection_reason    rejection_reason NULL,
    rejection_note      TEXT            NULL,
    rejected_by         UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    rejected_at         TIMESTAMPTZ     NULL,

    -- AI Scoring
    ai_score            NUMERIC(5, 2)   NULL,               -- 0.00–100.00; NULL = not yet scored
    ai_score_breakdown  JSONB           NULL,
    -- {skills, experience, education, culture, overall, highlights[], concerns[], model, scored_at}
    ai_summary          TEXT            NULL,               -- AI narrative about fit for THIS job
    ai_scored_at        TIMESTAMPTZ     NULL,

    -- Offer Management
    offer_extended_at   TIMESTAMPTZ     NULL,
    offer_accepted_at   TIMESTAMPTZ     NULL,
    offer_declined_at   TIMESTAMPTZ     NULL,
    offer_declined_reason TEXT          NULL,
    start_date          DATE            NULL,

    -- Source Tracking
    source              candidate_source NOT NULL DEFAULT 'careers_page',
    source_detail       TEXT            NULL,
    utm_source          VARCHAR(255)    NULL,
    utm_medium          VARCHAR(255)    NULL,
    utm_campaign        VARCHAR(255)    NULL,
    cover_letter        TEXT            NULL,
    applied_via_api     BOOLEAN         NOT NULL DEFAULT FALSE,

    -- Timestamps
    applied_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    moved_to_stage_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW(), -- Updated when stage_id changes
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    custom_fields       JSONB           NOT NULL DEFAULT '{}',

    CONSTRAINT applications_unique_per_job_candidate UNIQUE (job_id, candidate_id),
    CONSTRAINT applications_ai_score_range CHECK (
        ai_score IS NULL OR (ai_score >= 0.00 AND ai_score <= 100.00)
    ),
    CONSTRAINT applications_rejection_complete CHECK (
        (status = 'rejected' AND rejection_reason IS NOT NULL) OR (status != 'rejected')
    ),
    CONSTRAINT applications_offer_dates_valid CHECK (
        offer_extended_at IS NULL OR offer_accepted_at IS NULL OR
        offer_accepted_at >= offer_extended_at
    )
);

CREATE INDEX idx_apps_job ON applications(job_id);
CREATE INDEX idx_apps_candidate ON applications(candidate_id);
CREATE INDEX idx_apps_job_stage ON applications(job_id, stage_id);
CREATE INDEX idx_apps_job_status ON applications(job_id, status);
CREATE INDEX idx_apps_score ON applications(job_id, ai_score DESC NULLS LAST)
    WHERE status = 'active';
CREATE INDEX idx_apps_applied_at ON applications(job_id, applied_at DESC);
CREATE INDEX idx_apps_active_kanban ON applications(job_id, stage_id, ai_score DESC)
    WHERE status = 'active';
CREATE INDEX idx_apps_score_breakdown ON applications USING GIN(ai_score_breakdown jsonb_path_ops);
```

---

### 4.15 `application_stage_transitions`

**Why it exists:** The `applications.stage_id` column only tells you where a candidate is *now*. Without this append-only log, you cannot answer "How long does the average candidate spend in the Technical Interview stage?" It is the raw data behind funnel analytics, bottleneck detection, and the candidate activity timeline.

```sql
CREATE TABLE application_stage_transitions (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id      UUID            NOT NULL
                        REFERENCES applications(id)
                        ON DELETE CASCADE,
    from_stage_id       UUID            NULL
                        REFERENCES pipeline_stages(id)
                        ON DELETE SET NULL,                -- NULL = initial application entry
    to_stage_id         UUID            NOT NULL
                        REFERENCES pipeline_stages(id)
                        ON DELETE RESTRICT,
    moved_by            UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,                -- NULL = system/automation
    move_reason         TEXT            NULL,
    is_automated        BOOLEAN         NOT NULL DEFAULT FALSE,
    transitioned_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    time_in_from_stage_hours NUMERIC(8, 2) NULL,           -- Cached for analytics; computed by trigger

    -- APPEND-ONLY: no updated_at column intentional
    CONSTRAINT stage_transitions_different_stages CHECK (
        from_stage_id IS NULL OR from_stage_id != to_stage_id
    )
);

-- REVOKE UPDATE, DELETE ON application_stage_transitions FROM hiretrack_app_role;

CREATE INDEX idx_stage_transitions_application ON application_stage_transitions(application_id);
CREATE INDEX idx_stage_transitions_transitioned_at ON application_stage_transitions(transitioned_at);
CREATE INDEX idx_stage_transitions_to_stage ON application_stage_transitions(to_stage_id);
```

---

### 4.16 `tags` and `candidate_tags`

**Why they exist:** Tags must be reusable (the "React Expert" tag applied to 50 candidates should be consistent), not free-text strings per candidate. The separate `tags` table with `candidate_tags` join enables: renaming a tag once to update everywhere, bulk actions on tagged candidates, and tag usage analytics.

```sql
CREATE TABLE tags (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    name                VARCHAR(100)    NOT NULL,
    color               CHAR(7)         NOT NULL DEFAULT '#6366f1',
    description         TEXT            NULL,
    category            VARCHAR(100)    NULL,
    created_by          UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT tags_name_unique_per_org UNIQUE (organization_id, name),
    CONSTRAINT tags_name_length CHECK (char_length(name) BETWEEN 1 AND 100),
    CONSTRAINT tags_color_format CHECK (color ~* '^#[0-9A-Fa-f]{6}$')
);

CREATE INDEX idx_tags_org_id ON tags(organization_id);
CREATE INDEX idx_tags_name ON tags(organization_id, lower(name));

CREATE TABLE candidate_tags (
    candidate_id        UUID            NOT NULL
                        REFERENCES candidates(id)
                        ON DELETE CASCADE,
    tag_id              UUID            NOT NULL
                        REFERENCES tags(id)
                        ON DELETE CASCADE,
    tagged_by           UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    tagged_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (candidate_id, tag_id)
);

CREATE INDEX idx_candidate_tags_tag_id ON candidate_tags(tag_id);
CREATE INDEX idx_candidate_tags_candidate_id ON candidate_tags(candidate_id);
```

---

### 4.17 `interviews`

**Why it exists:** An interview is not just a note — it is a structured event with scheduling, calendar integration, panel assignment, and feedback collection. Storing interviews as first-class entities enables the calendar view, automatic reminder triggers, feedback completion tracking, and interviewer performance analytics over time.

```sql
CREATE TABLE interviews (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id      UUID            NOT NULL
                        REFERENCES applications(id)
                        ON DELETE CASCADE,
    title               VARCHAR(255)    NOT NULL,
    type                interview_type  NOT NULL,
    status              interview_status NOT NULL DEFAULT 'scheduled',
    scheduled_at        TIMESTAMPTZ     NOT NULL,
    duration_minutes    SMALLINT        NOT NULL DEFAULT 60,
    end_at              TIMESTAMPTZ     GENERATED ALWAYS AS
                        (scheduled_at + (duration_minutes || ' minutes')::INTERVAL) STORED,
    location_type       VARCHAR(20)     NOT NULL DEFAULT 'video'
                        CHECK (location_type IN ('video', 'phone', 'in_person')),
    physical_address    TEXT            NULL,
    video_platform      VARCHAR(50)     NULL,
    video_link          TEXT            NULL,
    video_password      TEXT            NULL,
    google_event_id     TEXT            NULL,
    outlook_event_id    TEXT            NULL,
    scorecard_template_id UUID          NULL
                        REFERENCES scorecard_templates(id)
                        ON DELETE SET NULL,
    internal_notes      TEXT            NULL,
    candidate_notes     TEXT            NULL,
    cancelled_at        TIMESTAMPTZ     NULL,
    cancelled_by        UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    cancellation_reason TEXT            NULL,
    created_by          UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT interviews_title_length CHECK (char_length(title) BETWEEN 1 AND 255),
    CONSTRAINT interviews_duration_positive CHECK (duration_minutes > 0),
    CONSTRAINT interviews_duration_max CHECK (duration_minutes <= 480),
    CONSTRAINT interviews_cancelled_complete CHECK (
        (status = 'cancelled' AND cancelled_at IS NOT NULL) OR (status != 'cancelled')
    )
);

CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_interviews_scheduled ON interviews(scheduled_at)
    WHERE status IN ('scheduled', 'rescheduled');
CREATE INDEX idx_interviews_google_event ON interviews(google_event_id)
    WHERE google_event_id IS NOT NULL;
```

---

### 4.18 `interview_panelists`

**Why it exists:** Panel interviews involve multiple independent observers. This table enables: individual calendar invitations per panelist, tracking who has/hasn't submitted feedback, targeted reminders to exactly the panelists with pending feedback, and the consensus view aggregating all scorecards. The `shadow` constraint prevents non-decision-makers from submitting scorecards.

```sql
CREATE TABLE interview_panelists (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id        UUID            NOT NULL
                        REFERENCES interviews(id)
                        ON DELETE CASCADE,
    user_id             UUID            NOT NULL
                        REFERENCES users(id)
                        ON DELETE CASCADE,
    role                panelist_role   NOT NULL DEFAULT 'interviewer',
    scorecard_id        UUID            NULL
                        REFERENCES scorecards(id)
                        ON DELETE SET NULL,
    calendar_invite_sent BOOLEAN        NOT NULL DEFAULT FALSE,
    calendar_event_id   TEXT            NULL,
    feedback_submitted_at TIMESTAMPTZ  NULL,
    feedback_reminded_at  TIMESTAMPTZ  NULL,
    added_by            UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    added_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT panelists_unique UNIQUE (interview_id, user_id),
    CONSTRAINT panelists_shadow_no_scorecard CHECK (
        (role = 'shadow' AND scorecard_id IS NULL) OR (role != 'shadow')
    )
);

CREATE INDEX idx_panelists_interview ON interview_panelists(interview_id);
CREATE INDEX idx_panelists_user ON interview_panelists(user_id);
CREATE INDEX idx_panelists_pending_feedback ON interview_panelists(user_id, interview_id)
    WHERE feedback_submitted_at IS NULL AND role != 'shadow';
```

---

### 4.19 `scorecard_templates`

**Why it exists:** Structured scorecards solve the "feedback in Slack DMs" problem. Templates ensure every candidate is evaluated on the same dimensions, reducing bias through structured criteria and enabling aggregate rating computation and interviewer effectiveness measurement over time.

```sql
CREATE TABLE scorecard_templates (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    name                VARCHAR(255)    NOT NULL,
    description         TEXT            NULL,
    interview_type      interview_type  NULL,               -- NULL = applies to all types
    criteria            JSONB           NOT NULL,
    -- [{id, name, description, weight, rating_scale, required}]
    is_default          BOOLEAN         NOT NULL DEFAULT FALSE,
    requires_summary    BOOLEAN         NOT NULL DEFAULT TRUE,
    min_summary_length  SMALLINT        NOT NULL DEFAULT 50,
    created_by          UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT scorecard_templates_name_length CHECK (char_length(name) BETWEEN 1 AND 255),
    CONSTRAINT scorecard_templates_criteria_non_empty CHECK (jsonb_array_length(criteria) > 0)
);

CREATE INDEX idx_scorecard_templates_org ON scorecard_templates(organization_id);
```

---

### 4.20 `scorecards`

**Why it exists:** Each panelist submits an independent scorecard, preventing group-think anchoring. The `is_private` flag hides scorecards until all panelists have submitted, further reducing bias. The `criterion_responses` JSONB allows the template to evolve without migrating old scorecard data.

```sql
CREATE TABLE scorecards (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id        UUID            NOT NULL
                        REFERENCES interviews(id)
                        ON DELETE CASCADE,
    interviewer_id      UUID            NOT NULL
                        REFERENCES users(id)
                        ON DELETE CASCADE,
    application_id      UUID            NOT NULL
                        REFERENCES applications(id)
                        ON DELETE CASCADE,
    template_id         UUID            NULL
                        REFERENCES scorecard_templates(id)
                        ON DELETE SET NULL,
    overall_rating      NUMERIC(3, 1)   NOT NULL,           -- 1.0–5.0 in 0.5 steps
    recommendation      scorecard_recommendation NOT NULL,
    criterion_responses JSONB           NOT NULL,           -- {criterion_id: {rating, notes}}
    summary             TEXT            NOT NULL,
    strengths           TEXT            NULL,
    areas_of_concern    TEXT            NULL,
    ai_summary          TEXT            NULL,
    ai_red_flags        TEXT[]          NULL,
    is_private          BOOLEAN         NOT NULL DEFAULT FALSE,
    is_draft            BOOLEAN         NOT NULL DEFAULT TRUE,
    submitted_at        TIMESTAMPTZ     NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT scorecards_unique_per_panelist UNIQUE (interview_id, interviewer_id),
    CONSTRAINT scorecards_rating_range CHECK (overall_rating >= 1.0 AND overall_rating <= 5.0),
    CONSTRAINT scorecards_rating_half_steps CHECK (
        (overall_rating * 2) = FLOOR(overall_rating * 2)
    ),
    CONSTRAINT scorecards_summary_min_length CHECK (char_length(summary) >= 20),
    CONSTRAINT scorecards_submitted_not_draft CHECK (
        (submitted_at IS NOT NULL AND is_draft = FALSE) OR
        (submitted_at IS NULL AND is_draft = TRUE)
    )
);

CREATE INDEX idx_scorecards_interview ON scorecards(interview_id);
CREATE INDEX idx_scorecards_application ON scorecards(application_id);
CREATE INDEX idx_scorecards_interviewer ON scorecards(interviewer_id);
CREATE INDEX idx_scorecards_pending ON scorecards(interview_id) WHERE is_draft = TRUE;
```

---

### 4.21 `notes`

**Why it exists:** Hiring decisions require team discussion. Notes provide the collaboration layer where recruiters ping hiring managers, managers respond, and the full conversation is preserved on the candidate's record. The `mentioned_user_ids` array stores pre-parsed mention targets for efficient notification queries without re-parsing content at read time.

```sql
CREATE TABLE notes (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    candidate_id        UUID            NOT NULL
                        REFERENCES candidates(id)
                        ON DELETE CASCADE,
    application_id      UUID            NULL
                        REFERENCES applications(id)
                        ON DELETE CASCADE,                 -- NULL = org-level candidate note
    author_id           UUID            NOT NULL
                        REFERENCES users(id)
                        ON DELETE CASCADE,
    content             TEXT            NOT NULL,           -- Markdown; @mentions as @[Name](user-id)
    content_html        TEXT            NULL,               -- Pre-rendered HTML for display
    mentioned_user_ids  UUID[]          NOT NULL DEFAULT '{}',
    is_private          BOOLEAN         NOT NULL DEFAULT FALSE,
    is_pinned           BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ     NULL,

    CONSTRAINT notes_content_non_empty CHECK (char_length(trim(content)) > 0),
    CONSTRAINT notes_content_max_length CHECK (char_length(content) <= 10000)
);

CREATE INDEX idx_notes_candidate ON notes(candidate_id, created_at DESC)
    WHERE deleted_at IS NULL;
CREATE INDEX idx_notes_application ON notes(application_id, created_at DESC)
    WHERE application_id IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_notes_author ON notes(author_id);
CREATE INDEX idx_notes_mentions ON notes USING GIN(mentioned_user_ids);
```

---

### 4.22 `email_templates` and `emails`

**Why they exist:** Email is the primary candidate communication channel. Without `emails`, there is no audit trail ("Did we send a rejection?"), no delivery tracking, and no basis for analytics. `email_templates` ensures consistent voice and branding without copy-pasting — a single template rename updates everywhere.

```sql
CREATE TABLE email_templates (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,                 -- NULL = global system template
    name                VARCHAR(255)    NOT NULL,
    description         TEXT            NULL,
    type                email_template_type NOT NULL DEFAULT 'custom',
    subject             VARCHAR(500)    NOT NULL,
    body_html           TEXT            NOT NULL,
    body_text           TEXT            NULL,
    variables           TEXT[]          NOT NULL DEFAULT '{}',
    is_global           BOOLEAN         NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    created_by          UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT email_templates_name_length CHECK (char_length(name) BETWEEN 1 AND 255),
    CONSTRAINT email_templates_subject_length CHECK (char_length(subject) BETWEEN 3 AND 500)
);

CREATE INDEX idx_email_templates_org ON email_templates(organization_id);
CREATE INDEX idx_email_templates_type ON email_templates(organization_id, type);
CREATE INDEX idx_email_templates_global ON email_templates(type) WHERE is_global = TRUE;

CREATE TABLE emails (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    candidate_id        UUID            NOT NULL
                        REFERENCES candidates(id)
                        ON DELETE CASCADE,
    application_id      UUID            NULL
                        REFERENCES applications(id)
                        ON DELETE SET NULL,
    template_id         UUID            NULL
                        REFERENCES email_templates(id)
                        ON DELETE SET NULL,
    from_user_id        UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    from_name           VARCHAR(255)    NOT NULL,
    from_email          VARCHAR(255)    NOT NULL,
    to_email            VARCHAR(255)    NOT NULL,
    to_name             VARCHAR(255)    NULL,
    cc_emails           TEXT[]          NOT NULL DEFAULT '{}',
    subject             VARCHAR(500)    NOT NULL,
    body_html           TEXT            NOT NULL,
    body_text           TEXT            NULL,
    status              email_status    NOT NULL DEFAULT 'queued',
    provider            VARCHAR(50)     NOT NULL DEFAULT 'resend',
    provider_message_id TEXT            NULL,               -- Correlates with inbound delivery webhooks
    queued_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    sent_at             TIMESTAMPTZ     NULL,
    delivered_at        TIMESTAMPTZ     NULL,
    opened_at           TIMESTAMPTZ     NULL,
    clicked_at          TIMESTAMPTZ     NULL,
    bounced_at          TIMESTAMPTZ     NULL,
    failed_at           TIMESTAMPTZ     NULL,
    failure_reason      TEXT            NULL,
    scheduled_for       TIMESTAMPTZ     NULL,               -- NULL = send immediately
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT emails_to_email_format CHECK (
        to_email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT emails_subject_length CHECK (char_length(subject) BETWEEN 1 AND 500)
);

CREATE INDEX idx_emails_candidate ON emails(candidate_id, created_at DESC);
CREATE INDEX idx_emails_application ON emails(application_id);
CREATE INDEX idx_emails_provider_message ON emails(provider_message_id)
    WHERE provider_message_id IS NOT NULL;
CREATE INDEX idx_emails_queued ON emails(status, scheduled_for)
    WHERE status IN ('queued', 'scheduled');
```

---

### 4.23 `automation_rules`

**Why it exists:** Stage-level automation is fixed (enter Interview stage -> create scorecard). Organization-level automation rules are dynamic and condition-based ("when AI score > 85 AND job is Engineering, notify hiring manager immediately"). This table enables the "set-it-and-forget-it" automation that saves recruiters hours per week.

```sql
CREATE TABLE automation_rules (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    name                VARCHAR(255)    NOT NULL,
    description         TEXT            NULL,
    trigger_event       webhook_event   NOT NULL,
    trigger_conditions  JSONB           NOT NULL DEFAULT '{}',
    -- {filters: [{field, operator, value}], logic: "AND"|"OR"}
    action_type         VARCHAR(50)     NOT NULL
                        CHECK (action_type IN (
                            'send_email', 'move_stage', 'add_tag',
                            'notify_slack', 'notify_member', 'create_scorecard',
                            'trigger_webhook', 'reject_application'
                        )),
    action_config       JSONB           NOT NULL DEFAULT '{}',
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    execution_limit     INTEGER         NULL,               -- NULL = unlimited
    execution_count     INTEGER         NOT NULL DEFAULT 0,
    created_by          UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT automation_rules_name_length CHECK (char_length(name) BETWEEN 1 AND 255)
);

CREATE INDEX idx_automation_rules_org ON automation_rules(organization_id)
    WHERE is_active = TRUE;
CREATE INDEX idx_automation_rules_event ON automation_rules(organization_id, trigger_event)
    WHERE is_active = TRUE;
```

---

### 4.24 `api_keys`

**Why it exists:** Enterprise customers and integrations require programmatic API access. The hashed storage pattern (SHA-256, only prefix shown in UI) mirrors industry best practices. Scope-limited access, IP restrictions, and full revocation capability make this enterprise-grade.

```sql
CREATE TABLE api_keys (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    name                VARCHAR(255)    NOT NULL,
    description         TEXT            NULL,
    key_prefix          CHAR(8)         NOT NULL,           -- First 8 chars shown in UI (e.g., 'htk_xYz1')
    key_hash            CHAR(64)        NOT NULL,           -- SHA-256 hex; actual key never stored
    scopes              TEXT[]          NOT NULL DEFAULT '{}',
    -- Format: 'resource:action' e.g., ['candidates:read', 'jobs:read', 'applications:read']
    allowed_ips         INET[]          NOT NULL DEFAULT '{}',
    rate_limit_per_min  SMALLINT        NOT NULL DEFAULT 100,
    last_used_at        TIMESTAMPTZ     NULL,
    usage_count         BIGINT          NOT NULL DEFAULT 0,
    created_by          UUID            NOT NULL
                        REFERENCES users(id)
                        ON DELETE CASCADE,
    expires_at          TIMESTAMPTZ     NULL,
    revoked_at          TIMESTAMPTZ     NULL,
    revoked_by          UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT api_keys_hash_unique UNIQUE (key_hash),
    CONSTRAINT api_keys_prefix_length CHECK (char_length(key_prefix) = 8),
    CONSTRAINT api_keys_name_length CHECK (char_length(name) BETWEEN 1 AND 255),
    CONSTRAINT api_keys_scopes_not_empty CHECK (cardinality(scopes) > 0),
    CONSTRAINT api_keys_rate_limit_positive CHECK (rate_limit_per_min > 0)
);

CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);      -- Hot path for every API request auth
CREATE INDEX idx_api_keys_org ON api_keys(organization_id) WHERE revoked_at IS NULL;
```

---

### 4.25 `webhooks` and `webhook_deliveries`

**Why they exist:** Webhooks without delivery logs are unusable in production. When a customer says "We didn't receive the event for this candidate," engineering needs `webhook_deliveries` to diagnose: Was the event fired? Was the endpoint down? What was the response code? The delivery log also enables the "Redeliver" button — a critical integration feature.

```sql
CREATE TABLE webhooks (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    name                VARCHAR(255)    NOT NULL,
    url                 TEXT            NOT NULL,
    secret              TEXT            NOT NULL,           -- ENCRYPTED HMAC-SHA256 signing secret
    events              webhook_event[] NOT NULL,
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    api_version         VARCHAR(10)     NOT NULL DEFAULT 'v1',
    consecutive_failures SMALLINT       NOT NULL DEFAULT 0,
    last_success_at     TIMESTAMPTZ     NULL,
    last_failure_at     TIMESTAMPTZ     NULL,
    last_failure_reason TEXT            NULL,
    disabled_at         TIMESTAMPTZ     NULL,               -- Auto-disabled after N consecutive failures
    created_by          UUID            NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT webhooks_url_https CHECK (url LIKE 'https://%'),
    CONSTRAINT webhooks_name_length CHECK (char_length(name) BETWEEN 1 AND 255),
    CONSTRAINT webhooks_events_non_empty CHECK (cardinality(events) > 0),
    CONSTRAINT webhooks_failures_non_negative CHECK (consecutive_failures >= 0)
);

CREATE INDEX idx_webhooks_org ON webhooks(organization_id)
    WHERE is_active = TRUE AND disabled_at IS NULL;
CREATE INDEX idx_webhooks_events ON webhooks USING GIN(events);

CREATE TABLE webhook_deliveries (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id          UUID            NOT NULL
                        REFERENCES webhooks(id)
                        ON DELETE CASCADE,
    event               webhook_event   NOT NULL,
    event_id            UUID            NOT NULL,
    payload             JSONB           NOT NULL,
    attempt_number      SMALLINT        NOT NULL DEFAULT 1,
    status              webhook_delivery_status NOT NULL DEFAULT 'pending',
    request_headers     JSONB           NULL,
    response_status_code SMALLINT       NULL,
    response_body       TEXT            NULL,               -- Truncated at 10KB
    response_time_ms    INTEGER         NULL,
    scheduled_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    delivered_at        TIMESTAMPTZ     NULL,
    next_retry_at       TIMESTAMPTZ     NULL,               -- Exponential backoff retry scheduling
    failure_reason      TEXT            NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
    -- No updated_at: effectively immutable event log
);

CREATE INDEX idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id, created_at DESC);
CREATE INDEX idx_webhook_deliveries_pending ON webhook_deliveries(next_retry_at)
    WHERE status IN ('pending', 'retrying');
CREATE INDEX idx_webhook_deliveries_event ON webhook_deliveries(event, event_id);
```

---

### 4.26 `audit_logs`

**Why it exists:** SOC 2 Type II requires proof that every data access and change is logged. EEOC compliance requires demonstrating hiring decisions were consistent and non-discriminatory. The actor email denormalization is intentional — if a bad actor's account is later deleted, the audit record of their actions must remain accurate and attributable.

```sql
CREATE TABLE audit_logs (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NULL,               -- NULL for system-level events
    -- NO FK REFERENCE on actor_user_id: log must outlive deleted users
    actor_user_id       UUID            NULL,
    actor_email         VARCHAR(255)    NULL,               -- Denormalized at write time
    actor_role          membership_role NULL,               -- Denormalized: role at time of action
    actor_ip            INET            NULL,
    actor_user_agent    TEXT            NULL,
    actor_is_api_key    BOOLEAN         NOT NULL DEFAULT FALSE,
    actor_api_key_prefix CHAR(8)        NULL,
    action              audit_action    NOT NULL,
    resource_type       VARCHAR(100)    NOT NULL,
    resource_id         UUID            NULL,
    changes             JSONB           NOT NULL DEFAULT '{}',
    -- {before: {field: value}, after: {field: value}}
    request_id          UUID            NULL,
    session_id          UUID            NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
    -- Intentionally NO: updated_at, deleted_at, or any mutable columns
);

-- REVOKE UPDATE, DELETE ON audit_logs FROM hiretrack_app_role;
-- GRANT SELECT, INSERT ON audit_logs TO hiretrack_app_role;

CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id, created_at DESC)
    WHERE organization_id IS NOT NULL;
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_user_id, created_at DESC)
    WHERE actor_user_id IS NOT NULL;
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id, created_at DESC)
    WHERE resource_id IS NOT NULL;
CREATE INDEX idx_audit_logs_action ON audit_logs(organization_id, action, created_at DESC);
```

---

### 4.27 `notifications`

**Why it exists:** The notification bell with unread count requires server-side storage — client state is lost on page refresh. This table enables "Mark all as read," notification preferences, the unread count badge, and future analytics ("What percentage of users click interview reminder notifications?").

```sql
CREATE TABLE notifications (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL
                        REFERENCES users(id)
                        ON DELETE CASCADE,
    type                notification_type NOT NULL,
    channel             notification_channel NOT NULL DEFAULT 'in_app',
    title               VARCHAR(255)    NOT NULL,
    body                TEXT            NULL,
    action_url          TEXT            NULL,
    resource_type       VARCHAR(100)    NULL,
    resource_id         UUID            NULL,
    triggered_by_user_id UUID           NULL
                        REFERENCES users(id)
                        ON DELETE SET NULL,
    is_read             BOOLEAN         NOT NULL DEFAULT FALSE,
    read_at             TIMESTAMPTZ     NULL,
    is_dismissed        BOOLEAN         NOT NULL DEFAULT FALSE,
    dismissed_at        TIMESTAMPTZ     NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ     NULL,

    CONSTRAINT notifications_title_length CHECK (char_length(title) BETWEEN 1 AND 255),
    CONSTRAINT notifications_read_state CHECK (
        (is_read = TRUE AND read_at IS NOT NULL) OR
        (is_read = FALSE AND read_at IS NULL)
    )
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC)
    WHERE is_dismissed = FALSE;
CREATE INDEX idx_notifications_unread ON notifications(user_id)
    WHERE is_read = FALSE AND is_dismissed = FALSE;
CREATE INDEX idx_notifications_expires ON notifications(expires_at)
    WHERE expires_at IS NOT NULL;
```

---

### 4.28 `subscription_plans` and `billing_subscriptions`

**Why they exist:** Revenue is the business model. `subscription_plans` defines what each tier includes — adding a new plan is a data migration, not a code change. `billing_subscriptions` tracks which tier each customer is on and their Stripe billing state, driving feature flag enforcement at the API layer.

```sql
CREATE TABLE subscription_plans (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    code                VARCHAR(50)     NOT NULL UNIQUE,
    name                VARCHAR(100)    NOT NULL,
    description         TEXT            NULL,
    price_monthly_cents INTEGER         NOT NULL DEFAULT 0,
    price_yearly_cents  INTEGER         NOT NULL DEFAULT 0,
    max_active_jobs     SMALLINT        NULL,               -- NULL = unlimited
    max_members         SMALLINT        NULL,
    max_candidates      INTEGER         NULL,
    ai_credits_monthly  INTEGER         NULL,
    features            JSONB           NOT NULL DEFAULT '{}',
    -- {ai_scoring, ai_jd_generator, custom_roles, api_access, sso_saml, dei_analytics, ...}
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    display_order       SMALLINT        NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscription_plans_active ON subscription_plans(display_order)
    WHERE is_active = TRUE;

CREATE TABLE billing_subscriptions (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID            NOT NULL UNIQUE
                        REFERENCES organizations(id)
                        ON DELETE CASCADE,
    plan_id             UUID            NOT NULL
                        REFERENCES subscription_plans(id)
                        ON DELETE RESTRICT,
    stripe_customer_id      VARCHAR(255)    NULL UNIQUE,
    stripe_subscription_id  VARCHAR(255)    NULL UNIQUE,
    stripe_price_id         VARCHAR(255)    NULL,
    billing_interval    VARCHAR(20)     NOT NULL DEFAULT 'monthly'
                        CHECK (billing_interval IN ('monthly', 'yearly')),
    current_period_start TIMESTAMPTZ    NULL,
    current_period_end  TIMESTAMPTZ     NULL,
    trial_start         TIMESTAMPTZ     NULL,
    trial_end           TIMESTAMPTZ     NULL,
    status              VARCHAR(50)     NOT NULL DEFAULT 'trialing'
                        CHECK (status IN (
                            'trialing', 'active', 'past_due',
                            'cancelled', 'unpaid', 'paused'
                        )),
    cancelled_at        TIMESTAMPTZ     NULL,
    cancel_at_period_end BOOLEAN        NOT NULL DEFAULT FALSE,
    ai_credits_used     INTEGER         NOT NULL DEFAULT 0,
    ai_credits_reset_at TIMESTAMPTZ     NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT billing_trial_dates_valid CHECK (
        trial_start IS NULL OR trial_end IS NULL OR trial_end > trial_start
    )
);

CREATE INDEX idx_billing_stripe_customer ON billing_subscriptions(stripe_customer_id);
CREATE INDEX idx_billing_stripe_sub ON billing_subscriptions(stripe_subscription_id);
CREATE INDEX idx_billing_trial_expiry ON billing_subscriptions(trial_end)
    WHERE status = 'trialing' AND trial_end IS NOT NULL;
```

---

## 5. Index Strategy

### Index Design Philosophy

| Rule | Reasoning |
|------|-----------|
| Every FK column gets an index | PostgreSQL does not auto-index FKs; without indexes, cascade operations and JOIN queries become sequential scans |
| Partial indexes for common filtered queries | Reduces index size and maintenance cost; e.g., `WHERE status = 'active'` covers 90% of queries |
| GIN indexes for JSONB and arrays | Enables containment queries (`@>`, `?`, `&&`) without full table scans |
| Full-text search via GIN on `to_tsvector()` | Fast, ranked full-text search across candidate names and job descriptions |
| Composite indexes ordered by selectivity | Most selective (high cardinality) column first; least selective (e.g., boolean) last |
| UNIQUE indexes enforce business rules | Where data integrity requires uniqueness beyond just data type |

### Append-Only Table Privilege Management

```sql
-- These tables must never be updated or deleted from the application role
REVOKE UPDATE, DELETE ON audit_logs FROM hiretrack_app_role;
REVOKE UPDATE, DELETE ON application_stage_transitions FROM hiretrack_app_role;

-- Application role only has INSERT + SELECT on these tables
GRANT SELECT, INSERT ON audit_logs TO hiretrack_app_role;
GRANT SELECT, INSERT ON application_stage_transitions TO hiretrack_app_role;
```

---

## 6. Cascade Rules Summary

| Parent Table | Child Table | FK Column | ON DELETE | Reasoning |
|---|---|---|---|---|
| `users` | `oauth_accounts` | `user_id` | CASCADE | OAuth credentials are meaningless without the user |
| `users` | `sessions` | `user_id` | CASCADE | Deleting user ends all sessions |
| `users` | `memberships` | `user_id` | CASCADE | Membership meaningless after user deletion |
| `users` | `job_team_members` | `user_id` | CASCADE | Automatically removes from hiring teams |
| `users` | `notes` | `author_id` | CASCADE | Notes unattributable after user deletion |
| `users` | `interview_panelists` | `user_id` | CASCADE | Removed from interview panels |
| `users` (owner) | `organizations` | `owner_id` | RESTRICT | Cannot delete a user who owns an org |
| `organizations` | `memberships` | `organization_id` | CASCADE | All members belong to org |
| `organizations` | `departments` | `organization_id` | CASCADE | All departments belong to org |
| `organizations` | `pipelines` | `organization_id` | CASCADE | All pipelines belong to org |
| `organizations` | `jobs` | `organization_id` | CASCADE | All jobs belong to org |
| `organizations` | `candidates` | `organization_id` | CASCADE | All candidate records belong to org |
| `organizations` | `tags` | `organization_id` | CASCADE | Tags are org-specific |
| `organizations` | `email_templates` | `organization_id` | CASCADE | Templates are org-specific |
| `organizations` | `api_keys` | `organization_id` | CASCADE | Keys invalid without org |
| `organizations` | `webhooks` | `organization_id` | CASCADE | Webhooks are org-specific |
| `organizations` | `billing_subscriptions` | `organization_id` | CASCADE | Billing belongs to org |
| `departments` | `departments` | `parent_id` (self) | RESTRICT | Cannot delete department with children |
| `departments` | `memberships` | `department_id` | SET NULL | Member stays in org; dept cleared |
| `departments` | `jobs` | `department_id` | SET NULL | Job stays; dept cleared |
| `pipelines` | `pipeline_stages` | `pipeline_id` | CASCADE | Stages meaningless without pipeline |
| `jobs` | `applications` | `job_id` | CASCADE | Applications belong to the job |
| `jobs` | `job_team_members` | `job_id` | CASCADE | Team is specific to job |
| `candidates` | `applications` | `candidate_id` | CASCADE | Applications belong to candidate |
| `candidates` | `candidate_work_experiences` | `candidate_id` | CASCADE | Work history belongs to candidate |
| `candidates` | `candidate_educations` | `candidate_id` | CASCADE | Education belongs to candidate |
| `candidates` | `notes` | `candidate_id` | CASCADE | Notes are on the candidate |
| `candidates` | `emails` | `candidate_id` | CASCADE | Email log part of candidate record |
| `candidates` | `candidate_tags` | `candidate_id` | CASCADE | Remove all tag assignments |
| `tags` | `candidate_tags` | `tag_id` | CASCADE | Deleting tag removes all assignments |
| `applications` | `application_stage_transitions` | `application_id` | CASCADE | History part of application |
| `applications` | `interviews` | `application_id` | CASCADE | Interviews belong to application |
| `interviews` | `interview_panelists` | `interview_id` | CASCADE | Panel list belongs to interview |
| `interviews` | `scorecards` | `interview_id` | CASCADE | Scorecards belong to interview |
| `pipeline_stages` | `applications` | `stage_id` | RESTRICT | Cannot delete a stage with active candidates |
| `webhooks` | `webhook_deliveries` | `webhook_id` | CASCADE | Delivery log belongs to webhook |

---

## 7. Relationship Map

```
users (1) ────────────────────────── (N) oauth_accounts
users (1) ────────────────────────── (N) sessions
users (N) ──── memberships ────────── (N) organizations
organizations (1) ─────────────────── (N) departments (self-ref: 1 -> N)
organizations (1) ─────────────────── (N) pipelines
pipelines (1) ──────────────────────── (N) pipeline_stages
organizations (1) ─────────────────── (N) jobs
jobs (1) ───────────────────────────── (N) job_team_members
jobs (1) ───────────────────────────── (N) applications
organizations (1) ─────────────────── (N) candidates
candidates (N) ── candidate_tags ───── (N) tags
candidates (1) ─────────────────────── (N) candidate_work_experiences
candidates (1) ─────────────────────── (N) candidate_educations
applications (1) ───────────────────── (N) application_stage_transitions [append-only]
applications (1) ───────────────────── (N) interviews
interviews (1) ─────────────────────── (N) interview_panelists
interview_panelists (1) ─────────────── (1) scorecards
scorecard_templates (1) ─────────────── (N) scorecards
candidates (1) ─────────────────────── (N) notes
candidates (1) ─────────────────────── (N) emails
email_templates (1) ─────────────────── (N) emails
organizations (1) ─────────────────── (N) email_templates
organizations (1) ─────────────────── (N) automation_rules
organizations (1) ─────────────────── (N) api_keys
organizations (1) ─────────────────── (N) webhooks
webhooks (1) ───────────────────────── (N) webhook_deliveries
organizations (1) ─────────────────── (N) audit_logs [append-only]
subscription_plans (1) ──────────────── (N) billing_subscriptions
organizations (1) ─────────────────── (1) billing_subscriptions
```

---

## 8. Row-Level Security Notes

HireTrack AI uses **application-layer multi-tenancy** (every query filters by `organization_id` injected from the verified JWT claim, never from user input) rather than PostgreSQL RLS policies.

**Rationale for application-layer over RLS:**
- RLS policies are complex to maintain across 30+ tables and frequently cause N+1 query issues with ORMs like Prisma
- Application-layer filtering is transparent, debuggable, and unit-testable
- NestJS `OrganizationGuard` injects `organization_id` from the verified JWT at the guard layer — before any controller logic executes

**Where PostgreSQL-level privilege restriction IS used (append-only tables):**

```sql
-- Enforce append-only via privilege revocation
REVOKE UPDATE, DELETE ON audit_logs FROM hiretrack_app_role;
REVOKE UPDATE, DELETE ON application_stage_transitions FROM hiretrack_app_role;
GRANT SELECT, INSERT ON audit_logs TO hiretrack_app_role;
GRANT SELECT, INSERT ON application_stage_transitions TO hiretrack_app_role;
```

---

## 9. Partitioning Strategy

As data grows, the following high-volume tables should be range-partitioned on their timestamp column:

| Table | Strategy | Threshold | Benefit |
|-------|----------|-----------|---------|
| `audit_logs` | Monthly range on `created_at` | > 50M rows | Queries always date-filtered; old partitions can be archived |
| `emails` | Quarterly range on `created_at` | > 10M rows | Most queries are recent; old emails rarely accessed |
| `webhook_deliveries` | Monthly range on `created_at` | > 20M rows | 30-day retention; monthly DROP PARTITION replaces expensive DELETEs |
| `application_stage_transitions` | Quarterly range on `transitioned_at` | > 5M rows | Analytics queries always include date filters |
| `notifications` | Monthly range on `created_at` | > 30M rows | Auto-expire; whole partition drops are efficient |

### Automated Partitioning (pg_partman)

```sql
-- Example: Monthly auto-partitioning of audit_logs
SELECT partman.create_parent(
    p_parent_table => 'public.audit_logs',
    p_control      => 'created_at',
    p_type         => 'native',
    p_interval     => 'monthly',
    p_retention    => '24 months',
    p_retention_keep_table => FALSE
);
```

---

## 10. Extension Requirements

```sql
-- Required PostgreSQL extensions (run once during database initialization)

-- Cryptographic functions including gen_random_uuid() for UUID v4
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- UUID v7 support (time-ordered, sortable — preferred over v4 for primary keys)
-- Install via: https://github.com/fboulnois/pg_uuidv7
CREATE EXTENSION IF NOT EXISTS "pg_uuidv7";

-- Automated partition management
CREATE EXTENSION IF NOT EXISTS "pg_partman";

-- Query performance monitoring (used by Datadog agent and slow query analysis)
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Built-in (no extension needed):
-- - INET type (for IP address storage)
-- - Full-text search with GIN indexes and to_tsvector()
-- - JSONB with GIN indexing
-- - GENERATED ALWAYS AS computed columns
-- - TIMESTAMPTZ (timezone-aware timestamps)
```

---

## Database Object Summary

| Category | Count |
|---|---|
| ENUM types | 22 |
| Tables | 32 |
| Primary Key constraints | 32 |
| UNIQUE constraints (explicit) | 24 |
| CHECK constraints | 65+ |
| Foreign Key relationships | 68+ |
| Secondary indexes (non-PK) | 75+ |
| Partial indexes | 28 |
| GIN indexes (JSONB / arrays / FTS) | 8 |
| Database triggers | 25+ |
| Computed columns (GENERATED ALWAYS AS) | 1 |
| Append-only tables (privilege-restricted) | 2 |

---

*Database Design v1.0.0 — HireTrack AI Engineering — 2026-07-10*  
*This document is the canonical source of truth. All Prisma schema definitions must mirror these tables exactly.*
