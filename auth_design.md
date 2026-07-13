# HireTrack AI — Complete Authentication System Design

> **Version:** 1.0.0
> **Date:** 2026-07-12
> **Classification:** Engineering Architecture Reference
> **Status:** Approved for Development
> **Companion Documents:** [database_design.md](./database_design.md) · [plan.md](./plan.md)

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Auth Methods Supported](#2-auth-methods-supported)
3. [Token Architecture — JWT + Session Hybrid](#3-token-architecture--jwt--session-hybrid)
4. [Session Strategy](#4-session-strategy)
5. [Email / Password Login Flow](#5-email--password-login-flow)
6. [Google OAuth Login Flow](#6-google-oauth-login-flow)
7. [Email Verification Flow](#7-email-verification-flow)
8. [Forgot Password Flow](#8-forgot-password-flow)
9. [Password Reset Flow](#9-password-reset-flow)
10. [Role-Based Access Control (RBAC)](#10-role-based-access-control-rbac)
11. [Middleware Design](#11-middleware-design)
12. [Protected Routes](#12-protected-routes)
13. [Auth Flow Diagram](#13-auth-flow-diagram)
14. [Security Controls](#14-security-controls)
15. [Error States & Edge Cases](#15-error-states--edge-cases)

---

## 1. System Overview

HireTrack AI uses a **hybrid stateless + stateful authentication model**:

- **Access Tokens** (JWT, short-lived) → carried in HTTP headers for every API request — stateless, no DB lookup required
- **Refresh Tokens** (opaque, long-lived) → stored as SHA-256 hash in the `sessions` table — revocable, auditable, multi-device

This gives us the best of both worlds: JWT speed for request authentication, and database-backed session control for revocation, listing, and security.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│  ┌───────────────┐    ┌─────────────────────────────────────┐  │
│  │  Access Token │    │  Refresh Token (HttpOnly Cookie)    │  │
│  │  (Memory Only)│    │  Secure · SameSite=Strict · HTTPS   │  │
│  └───────────────┘    └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
             │                          │
             ▼                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API LAYER                            │
│                                                                 │
│  Auth Middleware → Route Handler → Service Layer → Prisma/DB   │
└─────────────────────────────────────────────────────────────────┘
             │                          │
             ▼                          ▼
┌──────────────────────┐   ┌───────────────────────────────────┐
│   JWT Verification   │   │  sessions table (PostgreSQL)      │
│   (stateless, fast)  │   │  token_hash · expires_at ·        │
│                      │   │  revoked_at · ip · user_agent     │
└──────────────────────┘   └───────────────────────────────────┘
```

---

## 2. Auth Methods Supported

| Method | Provider | Table Involved | Notes |
|---|---|---|---|
| **Email + Password** | Internal | `users` | bcrypt cost=12, zxcvbn strength check |
| **Google OAuth 2.0** | Google | `users` + `oauth_accounts` | PKCE flow, provider email auto-verified |
| **Magic Link** *(future)* | Internal | `users` | One-time token via email |
| **SAML SSO** *(enterprise)* | Any IdP | `oauth_accounts` (provider=`saml`) | For Enterprise plan orgs only |

---

## 3. Token Architecture — JWT + Session Hybrid

### 3.1 Access Token (JWT)

| Property | Value |
|---|---|
| **Algorithm** | RS256 (asymmetric — private key signs, public key verifies) |
| **Lifetime** | **15 minutes** |
| **Storage** | JavaScript memory only (never localStorage, never cookie) |
| **Transport** | `Authorization: Bearer <token>` header |
| **Rotation** | Silent refresh via refresh token before expiry |

**JWT Payload Structure:**

```
{
  // Standard Claims
  sub:     "uuid-of-user",           // Subject — user ID
  iss:     "https://app.hiretrack.ai",
  aud:     "hiretrack-api",
  iat:     1720800000,               // Issued At
  exp:     1720800900,               // Expires At (+15 min)
  jti:     "uuid-of-this-token",     // JWT ID (for future deny-list)

  // HireTrack Custom Claims
  email:   "user@example.com",
  name:    "Alex Rivera",
  email_verified: true,
  mfa_verified:   true,              // false = only MFA-partial access

  // Active Organization Context
  org_id:  "uuid-of-org",           // Currently selected organization
  role:    "admin",                  // membership_role in that org
  plan:    "growth",                 // org_plan for feature gating

  // Session Binding
  session_id: "uuid-of-session"     // Ties JWT to a specific sessions row
}
```

### 3.2 Refresh Token (Opaque)

| Property | Value |
|---|---|
| **Format** | Cryptographically random 256-bit string (hex or base64url) |
| **Lifetime** | **30 days** (sliding window — resets on each use) |
| **Storage** | `HttpOnly; Secure; SameSite=Strict` cookie |
| **Server Record** | SHA-256 hash stored in `sessions.token_hash` |
| **Rotation** | Rotated on every use (Refresh Token Rotation) |
| **Family Tracking** | Reuse of an old refresh token triggers **full session revocation** (theft detection) |

### 3.3 Token Lifecycle

```
Login
  │
  ├─→ Issue: Access Token (15 min, memory)
  └─→ Issue: Refresh Token (30 days, cookie) + sessions row created

Every API Request
  └─→ Attach Access Token in Authorization header

Access Token Expires
  └─→ Silent Refresh: POST /api/auth/refresh
        ├─→ Validate Refresh Token hash against sessions table
        ├─→ Check: not expired, not revoked
        ├─→ Rotate: delete old token_hash, insert new token_hash
        ├─→ Issue: new Access Token (15 min)
        └─→ Issue: new Refresh Token (30 days)

Logout
  └─→ POST /api/auth/logout
        ├─→ Revoke session: sessions.revoked_at = NOW()
        └─→ Clear Refresh Token cookie
```

---

## 4. Session Strategy

### 4.1 Session Record (`sessions` table)

Every login creates one row in the `sessions` table. This enables:

- **Multi-device management** — list all active sessions from UI
- **Remote logout** — revoke any individual session by setting `revoked_at`
- **Security anomaly detection** — detect logins from new countries/IPs
- **Refresh token rotation theft detection** — reuse of stale token kills entire session family

### 4.2 Session States

```
             ┌─────────┐
             │  ACTIVE │  ← token_hash SET, revoked_at NULL, expires_at > NOW()
             └────┬────┘
                  │
       ┌──────────┼──────────────┐
       ▼          ▼              ▼
  ┌─────────┐ ┌──────────┐ ┌──────────────┐
  │ EXPIRED │ │ REVOKED  │ │  ROTATED     │
  │ expires │ │ (logout  │ │  (refresh    │
  │ < NOW() │ │  / admin)│ │   → new row) │
  └─────────┘ └──────────┘ └──────────────┘
```

### 4.3 Session Metadata Captured

| Field | Purpose |
|---|---|
| `ip_address` | Anomaly detection, audit log |
| `user_agent` | Device identification |
| `device_fingerprint` | Browser fingerprint for "trusted device" feature |
| `country_code` | Geo-block, unusual login alerts |
| `city` | Display in "Active sessions" UI |
| `last_used_at` | Activity tracking, idle session cleanup |

### 4.4 Session Cleanup Policy

| Scenario | Action |
|---|---|
| Token expired + not used in 30 days | Soft-deleted by cron job |
| Explicit logout | `revoked_at = NOW()` immediately |
| Admin suspends user | All sessions: `revoked_at = NOW()` |
| Password changed | All **other** sessions revoked (keep current) |
| MFA disabled | All sessions revoked (security re-verification required) |
| Theft detected (token reuse) | **Entire session family** revoked |

---

## 5. Email / Password Login Flow

### 5.1 Step-by-Step

```
User submits email + password
         │
         ▼
[STEP 1] Input Validation
  ├─→ Email: valid format, non-empty
  ├─→ Password: non-empty, min 8 chars
  └─→ FAIL → 400 Bad Request (generic: "Invalid credentials")

[STEP 2] Rate Limiting Check
  ├─→ IP-based: max 20 attempts / 15 min window (Redis or DB)
  └─→ FAIL → 429 Too Many Requests (cooldown timer in response)

[STEP 3] User Lookup
  ├─→ SELECT users WHERE email = :email AND deleted_at IS NULL
  └─→ NOT FOUND → artificial delay (300ms) + 401 Unauthorized
       (timing attack prevention: don't reveal if email exists)

[STEP 4] Account Lock Check
  ├─→ IF locked_until > NOW() → 423 Locked + seconds_remaining
  └─→ ELSE → proceed

[STEP 5] Password Verification
  ├─→ bcrypt.compare(input_password, users.password_hash)
  ├─→ FAIL → increment failed_login_attempts
  │     ├─→ attempts >= 5 → SET locked_until = NOW() + 15 min
  │     └─→ 401 Unauthorized
  └─→ SUCCESS → reset failed_login_attempts = 0

[STEP 6] Email Verification Check
  ├─→ IF email_verified_at IS NULL → 403 Forbidden
  │     └─→ Response: { code: "EMAIL_NOT_VERIFIED", email }
  └─→ ELSE → proceed

[STEP 7] MFA Check
  ├─→ IF mfa_enabled = TRUE
  │     ├─→ Issue short-lived MFA challenge token (5 min, signed JWT)
  │     └─→ Response: { code: "MFA_REQUIRED", challenge_token }
  │           └─→ Client redirects to /auth/mfa-verify
  └─→ ELSE → proceed to Step 8

[STEP 8] Issue Tokens
  ├─→ Create sessions row (ip, user_agent, fingerprint, 30-day expiry)
  ├─→ Sign Access Token (RS256, 15 min)
  ├─→ Generate Refresh Token (256-bit random)
  ├─→ Store SHA-256(refresh_token) in sessions.token_hash
  ├─→ Set Refresh Token as HttpOnly cookie
  ├─→ Update users.last_login_at = NOW()
  └─→ Write audit_log: { action: 'auth.login', actor: user.id }

[STEP 9] Org Context Resolution
  ├─→ Fetch user's active memberships
  ├─→ IF 1 org → auto-select it
  ├─→ IF multiple orgs → embed all in JWT, require org selection
  └─→ Response: { access_token, user, orgs[] }
```

### 5.2 Login State Machine

```
                    ┌───────────────┐
                    │ UNAUTHENTICATED│
                    └───────┬───────┘
                            │ POST /api/auth/login
                            ▼
                   ┌─────────────────┐
          ┌───────►│  VALIDATING     │◄──────────┐
          │        └────────┬────────┘           │
          │                 │                    │
     [rate limit]     [credentials OK]     [wrong password]
          │                 │ (no MFA)           │
          ▼                 ▼                    │
   ┌────────────┐  ┌──────────────────┐          │
   │  REJECTED  │  │  AUTHENTICATED   │          │
   │  (429/401) │  │  (tokens issued) │──────────┘
   └────────────┘  └──────────────────┘
                            │ (if MFA enabled)
                            ▼
                  ┌────────────────────┐
                  │  MFA_CHALLENGE     │
                  │  (partial session) │
                  └─────────┬──────────┘
                            │ POST /api/auth/mfa/verify
                  ┌─────────┴──────────┐
                  │                    │
            [TOTP valid]         [TOTP invalid]
                  │                    │
                  ▼                    ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  AUTHENTICATED   │  │  MFA_FAILED      │
        │  (full tokens)   │  │  (retry / lock)  │
        └──────────────────┘  └──────────────────┘
```

---

## 6. Google OAuth Login Flow

### 6.1 PKCE Flow (RFC 7636)

Google OAuth uses **PKCE (Proof Key for Code Exchange)** — the industry-standard extension for public clients that eliminates the authorization code interception attack.

```
CLIENT                              SERVER                          GOOGLE
  │                                    │                              │
  │ User clicks "Sign in with Google"  │                              │
  │                                    │                              │
  ├─→ Generate code_verifier          │                              │
  │   (cryptographic random, 43-128   │                              │
  │    chars, stored in memory)        │                              │
  │                                    │                              │
  ├─→ code_challenge =                │                              │
  │   BASE64URL(SHA256(code_verifier)) │                              │
  │                                    │                              │
  ├─→ GET /api/auth/google/authorize  │                              │
  │                                    │                              │
  │                                    ├─→ Generate state (CSRF nonce)│
  │                                    │   stored in session cookie   │
  │                                    │                              │
  │◄────────────────────────────────── │ Redirect to Google with:     │
  │   Redirect to Google Auth UI       │ client_id, redirect_uri,    │
  │                                    │ scope, state, code_challenge │
  │                                    │                              │
  ├───────────────────────────────────────────────────────────────────►│
  │                              User grants consent                   │
  │◄───────────────────────────────────────────────────────────────────│
  │   GET /api/auth/google/callback?code=AUTH_CODE&state=STATE_TOKEN   │
  │                                    │                              │
  │──────────────────────────────────► │                              │
  │                                    │ Verify state (CSRF check)    │
  │                                    │                              │
  │                                    ├──────────────────────────────►│
  │                                    │ POST /token with:            │
  │                                    │  code, code_verifier,        │
  │                                    │  client_id, client_secret    │
  │                                    │◄──────────────────────────────│
  │                                    │ { access_token,              │
  │                                    │   id_token, refresh_token }  │
  │                                    │                              │
  │                                    │ Verify id_token (JWT)        │
  │                                    │ Extract: sub, email,         │
  │                                    │          email_verified, name│
  │                                    │                              │
  │                                    │ UPSERT Logic:                │
  │                                    │  1. Lookup oauth_accounts    │
  │                                    │     WHERE provider='google'  │
  │                                    │     AND provider_user_id=sub │
  │                                    │                              │
  │                                    │  ┌─ FOUND: existing user ──┐ │
  │                                    │  │  Update tokens, login    │ │
  │                                    │  └──────────────────────────┘ │
  │                                    │                              │
  │                                    │  ┌─ NOT FOUND: ────────────┐ │
  │                                    │  │  Check users by email    │ │
  │                                    │  │  ┌ EXISTS: link account ┐│ │
  │                                    │  │  │ INSERT oauth_accounts ││ │
  │                                    │  │  └──────────────────────┘│ │
  │                                    │  │  ┌ NEW USER: ───────────┐│ │
  │                                    │  │  │ INSERT users          ││ │
  │                                    │  │  │ INSERT oauth_accounts ││ │
  │                                    │  │  │ email_verified=TRUE   ││ │
  │                                    │  │  │ (Google guarantees it)││ │
  │                                    │  │  └──────────────────────┘│ │
  │                                    │  └──────────────────────────┘ │
  │                                    │                              │
  │                                    │ Issue Access + Refresh Tokens│
  │                                    │ Create sessions row          │
  │◄────────────────────────────────── │                              │
  │ Redirect to /dashboard             │                              │
  │ (access_token fetched via          │                              │
  │  /api/auth/me after redirect)      │                              │
```

### 6.2 Google Account Linking Rules

| Scenario | Action |
|---|---|
| New Google user, email never seen | Create `users` row + `oauth_accounts` row. `email_verified_at = NOW()` |
| Google email matches existing email/password user | Link OAuth account to existing user. Prompt to confirm account linking. |
| Google user previously linked | Update `access_token`, `refresh_token`, `expires_at`. Login normally. |
| Google email differs from linked provider email | Log warning, update `provider_email` in `oauth_accounts` |

---

## 7. Email Verification Flow

### 7.1 When It Triggers

Email verification is required for:
- New accounts created via email/password (not OAuth — Google guarantees verification)
- When a user changes their email address

### 7.2 Step-by-Step

```
[REGISTER]
  │
  ├─→ Insert users row: email_verified_at = NULL
  │
  ├─→ Generate verification token:
  │     raw_token = crypto.randomBytes(32).toString('hex')
  │     stored_hash = SHA-256(raw_token)
  │     expiry = NOW() + 24 hours
  │
  ├─→ Store in: email_verification_tokens table
  │     { token_hash, user_id, expires_at, used_at: NULL }
  │
  ├─→ Queue email: "Verify your HireTrack AI account"
  │     Link: https://app.hiretrack.ai/auth/verify-email?token=<raw_token>
  │
  └─→ Response to client: { code: "EMAIL_VERIFICATION_SENT" }
       ← No access token issued yet

[USER CLICKS LINK]
  │
  ├─→ GET /api/auth/verify-email?token=<raw_token>
  │
  ├─→ Hash incoming token: SHA-256(raw_token)
  ├─→ Lookup WHERE token_hash = hash AND used_at IS NULL
  │
  ├─→ FAIL (not found / used):
  │     → Show "Link invalid or already used" page
  │
  ├─→ FAIL (expired):
  │     → Show "Link expired" page with "Resend verification email" CTA
  │
  ├─→ SUCCESS:
  │     ├─→ UPDATE users SET email_verified_at = NOW()
  │     ├─→ UPDATE token: used_at = NOW()
  │     ├─→ Issue Access + Refresh Tokens (auto-login)
  │     └─→ Redirect to /onboarding (first time) or /dashboard

[RESEND VERIFICATION]
  ├─→ POST /api/auth/resend-verification { email }
  ├─→ Rate limit: max 3 resends per hour per email
  ├─→ Invalidate previous token
  ├─→ Generate + send new token
  └─→ Always respond 200 (don't reveal if email exists)
```

---

## 8. Forgot Password Flow

```
[USER ON /auth/forgot-password]
  │
  ├─→ User enters email
  │
  ├─→ POST /api/auth/forgot-password { email }
  │
  ├─→ Rate Limit: 3 requests / hour per email, 10 per IP
  │
  ├─→ Lookup user by email (soft delete filter)
  │
  ├─→ IF NOT FOUND → respond 200 anyway
  │     (timing-safe: always same response regardless of existence)
  │
  ├─→ IF FOUND + OAuth-only account (no password_hash):
  │     Send email: "You signed up with Google. Use Google to log in."
  │
  ├─→ IF FOUND + has password:
  │     ├─→ Generate reset token:
  │     │     raw_token = crypto.randomBytes(32).toString('hex')
  │     │     token_hash = SHA-256(raw_token)
  │     │     expires_at = NOW() + 1 hour
  │     │
  │     ├─→ Invalidate any previous active reset tokens for this user
  │     │
  │     ├─→ Store: { token_hash, user_id, expires_at, used_at: NULL }
  │     │     in password_reset_tokens table
  │     │
  │     └─→ Queue email: "Reset your HireTrack AI password"
  │           Link: https://app.hiretrack.ai/auth/reset-password?token=<raw>
  │           Expiry warning: "This link expires in 1 hour"
  │
  └─→ Response: 200 OK { message: "If an account exists, you'll receive an email" }
```

---

## 9. Password Reset Flow

```
[USER ARRIVES AT /auth/reset-password?token=<raw>]
  │
  ├─→ GET /api/auth/reset-password/validate?token=<raw>
  │     ├─→ Hash token: SHA-256(raw)
  │     ├─→ Lookup WHERE token_hash = hash AND used_at IS NULL
  │     ├─→ FAIL → Show "Link expired or invalid" UI
  │     └─→ SUCCESS → Show password reset form

[USER SUBMITS NEW PASSWORD]
  │
  ├─→ POST /api/auth/reset-password
  │     { token: <raw>, new_password, confirm_password }
  │
  ├─→ Validate:
  │     ├─→ Passwords match
  │     ├─→ Min 8 chars
  │     ├─→ zxcvbn score >= 3 (strength check)
  │     └─→ Not same as current password (bcrypt compare)
  │
  ├─→ Validate token (re-verify):
  │     ├─→ token_hash exists, not used, not expired
  │     └─→ FAIL → 400 "Token expired or already used"
  │
  ├─→ Update user:
  │     ├─→ password_hash = bcrypt(new_password, cost=12)
  │     ├─→ failed_login_attempts = 0
  │     └─→ locked_until = NULL
  │
  ├─→ Mark token used: used_at = NOW()
  │
  ├─→ Revoke ALL active sessions for this user:
  │     UPDATE sessions SET revoked_at = NOW()
  │     WHERE user_id = :user_id AND revoked_at IS NULL
  │     (Assumption: someone with reset access may have had account compromise)
  │
  ├─→ Write audit_log: { action: 'auth.password_reset', actor: user.id }
  │
  ├─→ Send confirmation email: "Your password has been changed"
  │     Include: "If this wasn't you, contact support immediately"
  │
  └─→ Response: 200 OK → Redirect to /auth/login
       (No auto-login: forces fresh credential entry for security)
```

---

## 10. Role-Based Access Control (RBAC)

### 10.1 Roles Hierarchy

Roles are defined per-membership (per org). A user can have different roles in different organizations.

```
SYSTEM HIERARCHY
─────────────────────────────────────────────────────────────
owner              ← Full control. Cannot be removed by others.
  └─► admin        ← Manage members, settings, billing
        └─► recruiter        ← Manage jobs, candidates, pipelines
              └─► hiring_manager  ← Manage assigned jobs + candidates
                    └─► interviewer  ← View assigned interviews, submit scorecards
                          └─► viewer   ← Read-only across org data
─────────────────────────────────────────────────────────────
```

### 10.2 Permission Matrix

| Permission | owner | admin | recruiter | hiring_manager | interviewer | viewer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Manage org settings | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Manage billing | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Invite / remove members | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Change member roles | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Create / publish jobs | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manage all jobs | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manage assigned jobs | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Add / reject candidates | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Move pipeline stages | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Schedule interviews | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Submit scorecards | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| View candidates | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View analytics | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ |
| View audit logs | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Manage API keys | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Manage webhooks | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Export data | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Delete org | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

### 10.3 Hiring Manager Scoping

`hiring_manager` role is additionally scoped to **assigned jobs only** via `job_team_members`. A hiring manager cannot see jobs they are not assigned to, even within the same organization.

```
PERMISSION CHECK: hiring_manager accessing a candidate
  │
  ├─→ Is user active member of org? (membership.status = 'active')
  ├─→ Is user's role >= 'recruiter'? → Full access
  ├─→ Is user's role = 'hiring_manager'?
  │     └─→ Is user in job_team_members for this candidate's jobs?
  │           ├─→ YES → Access granted
  │           └─→ NO  → 403 Forbidden
  └─→ Is user's role in ['interviewer', 'viewer']?
        └─→ Read-only, scoped by interview assignment
```

### 10.4 Plan-Based Feature Gating

Certain features are gated by the organization's subscription plan, checked alongside RBAC:

| Feature | free | growth | enterprise |
|---|:---:|:---:|:---:|
| Active jobs | 3 | 25 | Unlimited |
| Team members | 5 | 25 | Unlimited |
| AI scoring | ✗ | ✓ | ✓ |
| Custom pipelines | ✗ | ✓ | ✓ |
| Analytics dashboard | Basic | Full | Full + Custom |
| API access | ✗ | ✓ | ✓ |
| SSO / SAML | ✗ | ✗ | ✓ |
| Audit logs | ✗ | 90 days | Unlimited |
| Webhooks | ✗ | ✓ | ✓ |

---

## 11. Middleware Design

### 11.1 Middleware Execution Order

All HTTP requests pass through this pipeline in order:

```
Incoming Request
       │
       ▼
┌─────────────────────────────────────────────────┐
│  1. RATE LIMITER                                │
│     - IP-based sliding window (Redis/Upstash)   │
│     - Auth endpoints: 20 req/15 min per IP      │
│     - API endpoints: 1000 req/min per user      │
│     - Block → 429 Too Many Requests             │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  2. SECURITY HEADERS                            │
│     - Content-Security-Policy                   │
│     - X-Frame-Options: DENY                     │
│     - X-Content-Type-Options: nosniff           │
│     - Strict-Transport-Security (HSTS)          │
│     - Referrer-Policy: strict-origin            │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  3. JWT VERIFICATION MIDDLEWARE                 │
│     - Extract Bearer token from header          │
│     - Verify RS256 signature (public key)       │
│     - Check exp claim                           │
│     - Check iss and aud claims                  │
│     - Decode payload → attach to request context│
│     - FAIL → 401 Unauthorized (for auth routes) │
│     - No token → req.user = null (public routes)│
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  4. SESSION VALIDATION MIDDLEWARE               │
│     - Only runs if JWT valid                    │
│     - Lookup sessions WHERE id = jwt.session_id │
│     - Check: not revoked, not expired           │
│     - FAIL → 401 SESSION_REVOKED                │
│     - Update: sessions.last_used_at = NOW()     │
│     - Frequency: every 5 min (cached in Redis)  │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  5. ORG CONTEXT MIDDLEWARE                      │
│     - Extract X-Organization-Id header          │
│     - Validate: user is active member of org    │
│     - Attach: req.org, req.membership.role      │
│     - Check: org not deleted, membership active │
│     - FAIL → 403 Forbidden                      │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  6. ROLE AUTHORIZATION MIDDLEWARE               │
│     - Route-level: requireRole('admin')         │
│     - Resource-level: checkOwnership()          │
│     - Plan-level: requirePlan('growth')         │
│     - FAIL → 403 Forbidden + reason code        │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  7. AUDIT LOG MIDDLEWARE                        │
│     - Intercepts mutating requests (POST/PUT/   │
│       PATCH/DELETE) on sensitive resources       │
│     - Writes to audit_logs (async, non-blocking)│
│     - Captures: before/after state via diff     │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
               Route Handler
```

### 11.2 Middleware Applicability by Route Type

| Middleware | Public Routes | Auth Routes | Protected API Routes | Admin Routes |
|---|:---:|:---:|:---:|:---:|
| Rate Limiter | ✓ (loose) | ✓ (strict) | ✓ (per-user) | ✓ (strict) |
| Security Headers | ✓ | ✓ | ✓ | ✓ |
| JWT Verification | ✗ | ✗ | ✓ | ✓ |
| Session Validation | ✗ | ✗ | ✓ | ✓ |
| Org Context | ✗ | ✗ | ✓ | ✗ |
| Role Authorization | ✗ | ✗ | Route-specific | ✓ (admin) |
| Audit Log | ✗ | ✓ (login/logout) | Write ops only | ✓ |

### 11.3 Next.js Middleware (`middleware.ts`) Responsibilities

Running at the **Edge layer** (before any route handler):

- Route classification: public vs. auth-required vs. admin
- Redirect unauthenticated users to `/auth/login`
- Redirect authenticated users away from `/auth/*` pages
- Inject `x-user-id` and `x-org-id` into request headers for server components
- Handle `returnTo` query param for post-login redirect

---

## 12. Protected Routes

### 12.1 Route Classification

#### Public Routes (No Auth Required)

```
/                           → Landing page
/auth/login                 → Email/password login
/auth/register              → New account creation
/auth/forgot-password       → Forgot password request
/auth/reset-password        → Password reset (with token)
/auth/verify-email          → Email verification (with token)
/auth/google                → Google OAuth initiation
/auth/google/callback       → Google OAuth callback
/careers/[slug]             → Public careers page
/careers/[slug]/jobs        → Public job listings
/careers/[slug]/jobs/[id]   → Public job detail + apply
/api/health                 → Health check endpoint
```

#### Auth-Required Routes (JWT needed, no specific org required)

```
/onboarding                 → First-time setup
/onboarding/create-org      → Create organization
/onboarding/join-org        → Accept invitation
/auth/select-org            → Org switcher (multi-org users)
/settings/profile           → Personal profile settings
/settings/security          → Password, MFA, active sessions
/api/auth/refresh           → Token refresh endpoint
/api/auth/logout            → Logout endpoint
/api/auth/me                → Current user info
```

#### Org-Scoped Protected Routes (JWT + active org membership)

```
/[org]/dashboard            → Hiring dashboard
/[org]/jobs                 → Job requisitions
/[org]/jobs/new             → Create job
/[org]/jobs/[id]            → Job detail
/[org]/jobs/[id]/edit       → Edit job
/[org]/candidates           → Candidate pool
/[org]/candidates/[id]      → Candidate profile
/[org]/interviews           → Interview calendar
/[org]/interviews/[id]      → Interview detail + scorecard
/[org]/reports              → Analytics + reports
/[org]/settings/org         → Org settings (admin+)
/[org]/settings/members     → Team management (admin+)
/[org]/settings/billing     → Billing (admin+)
/[org]/settings/pipelines   → Pipeline templates (admin+)
/[org]/settings/api-keys    → API key management (admin+)
/[org]/settings/webhooks    → Webhook config (admin+)
/[org]/settings/audit-log   → Audit log viewer (admin+)
```

#### Admin-Only Routes (Internal Platform)

```
/admin                      → Platform admin panel
/admin/orgs                 → All organizations
/admin/users                → All users
/admin/billing              → Revenue + subscriptions
/admin/support              → Support tools
```

### 12.2 Route Guard Logic

```
Request to protected route
          │
          ▼
  Has valid JWT?
  ├─→ NO  → Redirect /auth/login?returnTo=<current_path>
  └─→ YES
          │
          ▼
  Route requires org context?
  ├─→ NO  → Allow (profile, settings)
  └─→ YES
          │
          ▼
  User is active member of requested org?
  ├─→ NO  → 403 Forbidden page (or redirect to /auth/select-org)
  └─→ YES
          │
          ▼
  Route requires specific role?
  ├─→ NO  → Allow
  └─→ YES
          │
          ▼
  User's role >= required role?
  ├─→ NO  → 403 Forbidden page (with role explanation)
  └─→ YES
          │
          ▼
  Route requires specific plan?
  ├─→ NO  → Allow
  └─→ YES
          │
          ▼
  Org's plan includes this feature?
  ├─→ NO  → Upgrade prompt page
  └─→ YES → Allow access
```

---

## 13. Auth Flow Diagram

### 13.1 Complete Authentication Decision Tree

```
                        ┌─────────────────────┐
                        │   User Visits App   │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  Has valid Access Token?    │
                    └──────┬──────────────┬───────┘
                           │ YES          │ NO
                           │              │
                           │    ┌─────────▼──────────┐
                           │    │ Has Refresh Cookie? │
                           │    └──────┬─────────┬────┘
                           │           │ YES      │ NO
                           │           │          │
                           │    ┌──────▼──────┐   │
                           │    │ Silent      │   │
                           │    │ Token       │   │
                           │    │ Refresh     │   │
                           │    └──┬───────┬──┘   │
                           │       │ OK    │ FAIL  │
                           │       │       │       │
                  ┌────────▼───────▼─┐    ┌▼───────▼──────────────┐
                  │  AUTHENTICATED   │    │ → /auth/login          │
                  │  Route allowed   │    │   ?returnTo=<path>     │
                  └────────┬─────────┘    └────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │  Route Type?            │
              └──┬──────────────┬───────┘
                 │ Public       │ Protected
                 │              │
           ┌─────▼─────┐  ┌────▼──────────────────────────┐
           │  Allow    │  │  Org Context Check             │
           │  Access   │  └────┬────────────────────┬──────┘
           └───────────┘       │ Active Member       │ Not Member
                               │                     │
                          ┌────▼───────┐    ┌────────▼────────┐
                          │ Role Check │    │ 403 Forbidden   │
                          └───┬────┬───┘    └─────────────────┘
                              │ OK │ Insufficient
                              │    │
                     ┌────────▼┐  ┌▼──────────────┐
                     │  Plan   │  │ 403 + Role    │
                     │  Check  │  │ Explanation   │
                     └───┬─┬───┘  └───────────────┘
                         │  │
              ┌──────────▼┐ └▼──────────────┐
              │  Allow    │  │ Upgrade       │
              │  Access   │  │ Prompt        │
              └───────────┘  └───────────────┘
```

### 13.2 Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     SILENT REFRESH FLOW                         │
│                                                                 │
│  Every 14 minutes (proactive, before 15-min JWT expires):       │
│                                                                 │
│  Client ──► POST /api/auth/refresh                              │
│              (Refresh Token auto-sent via cookie)               │
│                                                                 │
│  Server:                                                        │
│    1. Extract refresh token from HttpOnly cookie                │
│    2. Hash it: SHA-256(token)                                   │
│    3. SELECT sessions WHERE token_hash = hash                   │
│    4. Check: revoked_at IS NULL AND expires_at > NOW()          │
│                                                                 │
│    IF token was already rotated (old token reused):             │
│      → Refresh Token Reuse Attack detected!                     │
│      → Revoke ALL sessions for this user                        │
│      → Return 401 SESSION_REUSE_DETECTED                        │
│      → Force re-login everywhere                                │
│                                                                 │
│    IF valid:                                                    │
│      5. Generate new refresh token                              │
│      6. UPDATE sessions: new token_hash, extends expires_at     │
│      7. Sign new Access Token (JWT, 15 min)                     │
│      8. Set new refresh token cookie                            │
│      9. Return: { access_token }                                │
└─────────────────────────────────────────────────────────────────┘
```

### 13.3 Multi-Organization Auth Flow

```
User has memberships in 3 organizations
         │
         ▼
   Login succeeds
         │
         ▼
  JWT encodes: orgs[] array with [id, name, role, plan]
         │
         ▼
  Client checks localStorage for last_active_org_id
         │
    ┌────┴────┐
    │ Found?  │
    └────┬────┘
    YES  │  NO
         │   └──► Show /auth/select-org page
         │         (list all orgs with role badges)
         │
         ▼
  Auto-select stored org
         │
         ▼
  Fetch full JWT for that org context
  (includes: org_id, role, plan in token claims)
         │
         ▼
  Redirect to /[org-slug]/dashboard
```

### 13.4 Full End-to-End Auth Sequence (New User via Email)

```
BROWSER                     NEXT.JS SERVER                    DATABASE
   │                               │                              │
   │ 1. POST /api/auth/register    │                              │
   │    { email, password, name }  │                              │
   │──────────────────────────────►│                              │
   │                               │ 2. Validate input            │
   │                               │ 3. Hash password (bcrypt)    │
   │                               │──────────────────────────────►
   │                               │ 4. INSERT users              │
   │                               │    email_verified=NULL        │
   │                               │◄──────────────────────────────
   │                               │ 5. Generate verify token     │
   │                               │──────────────────────────────►
   │                               │ 6. INSERT email_verify_token  │
   │                               │◄──────────────────────────────
   │                               │ 7. Queue verification email  │
   │◄──────────────────────────────│                              │
   │ 200: EMAIL_VERIFICATION_SENT  │                              │
   │                               │                              │
   │ [User opens email, clicks]    │                              │
   │                               │                              │
   │ 8. GET /api/auth/verify?t=X   │                              │
   │──────────────────────────────►│                              │
   │                               │ 9. Hash token (SHA-256)      │
   │                               │──────────────────────────────►
   │                               │ 10. SELECT token, validate   │
   │                               │◄──────────────────────────────
   │                               │ 11. UPDATE users:            │
   │                               │     email_verified=NOW()     │
   │                               │──────────────────────────────►
   │                               │ 12. Mark token used          │
   │                               │◄──────────────────────────────
   │                               │ 13. INSERT sessions row      │
   │                               │──────────────────────────────►
   │                               │◄──────────────────────────────
   │                               │ 14. Sign JWT (RS256)         │
   │                               │ 15. Set Refresh cookie       │
   │◄──────────────────────────────│                              │
   │ 200: { access_token, user }   │                              │
   │                               │                              │
   │ 16. Redirect → /onboarding    │                              │
```

---

## 14. Security Controls

### 14.1 Defense-in-Depth Layers

| Layer | Control | Rationale |
|---|---|---|
| **Transport** | HTTPS + HSTS | Prevents MITM, token interception |
| **Token Storage** | Access token in memory only | Prevents XSS token theft |
| **Cookie Security** | HttpOnly + Secure + SameSite=Strict | Prevents XSS + CSRF |
| **CSRF Protection** | SameSite=Strict + state param (OAuth) | Prevents cross-site request forgery |
| **Password Hashing** | bcrypt, cost=12 | Renders stolen hash unusable |
| **Token Hashing** | SHA-256 of all stored tokens | DB breach doesn't expose tokens |
| **Token Rotation** | Refresh tokens rotated on every use | Limits window of stolen token use |
| **Reuse Detection** | Old refresh token triggers full revoke | Detects and contains token theft |
| **Rate Limiting** | Per-IP and per-user sliding windows | Prevents brute force |
| **Account Locking** | 5 failed attempts → 15-min lock | Stops credential stuffing |
| **Timing Attacks** | Constant-time compare + artificial delays | Prevents user enumeration |
| **MFA (TOTP)** | RFC 6238 TOTP (Google Authenticator) | Second factor against compromise |
| **Sensitive Field Encryption** | AES-256-GCM for OAuth tokens + MFA secret | Column-level encryption |
| **Audit Trail** | Append-only `audit_logs` table | Tamper-evident security log |
| **Session Binding** | `session_id` in JWT payload | Ties stateless token to revocable session |

### 14.2 Security Event Triggers

| Event | Action |
|---|---|
| Login from new country | Email alert to user, log audit event |
| 5 failed login attempts | Lock account 15 min, email alert |
| Password changed | Revoke all other sessions, email alert |
| MFA disabled | Revoke all sessions, email alert |
| Refresh token reuse detected | Revoke all sessions, email alert |
| Admin suspends member | Revoke all sessions immediately |
| Unusual session count (>10 active) | Alert user, suggest "sign out everywhere" |

---

## 15. Error States & Edge Cases

### 15.1 Auth Error Code Reference

| HTTP Code | Error Code | User-Facing Message | Description |
|---|---|---|---|
| 400 | `VALIDATION_ERROR` | Check your inputs | Invalid request body |
| 401 | `INVALID_CREDENTIALS` | Incorrect email or password | Wrong email/password |
| 401 | `TOKEN_EXPIRED` | Session expired, please log in | JWT exp claim past |
| 401 | `TOKEN_INVALID` | Invalid session | JWT signature fail |
| 401 | `SESSION_REVOKED` | You've been signed out | Session revoked_at set |
| 401 | `SESSION_REUSE_DETECTED` | Security alert: re-login required | Token theft detected |
| 403 | `EMAIL_NOT_VERIFIED` | Please verify your email first | email_verified_at is NULL |
| 403 | `MFA_REQUIRED` | Two-factor authentication required | mfa_enabled = true |
| 403 | `INSUFFICIENT_ROLE` | You don't have permission for this | Role too low |
| 403 | `PLAN_FEATURE_LOCKED` | Upgrade to access this feature | Feature not in plan |
| 403 | `ORG_MEMBERSHIP_INACTIVE` | Your account is suspended | membership.status not active |
| 423 | `ACCOUNT_LOCKED` | Account temporarily locked | locked_until > NOW() |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests, try again later | Rate limit hit |

### 15.2 Edge Cases

| Scenario | Handling |
|---|---|
| Google account email changes | Update `oauth_accounts.provider_email`, do NOT update `users.email` automatically — require explicit confirmation |
| User deletes Google account | OAuth refresh fails silently; user must re-link or use email/password |
| Org invitation for existing user | If user exists: link membership. If new: create account + membership simultaneously |
| Org invitation expires | Resend invitation; invalidate old token |
| User belongs to 0 active orgs | Redirect to `/onboarding` after login |
| User is org owner + tries to leave | Block — ownership must be transferred first |
| TOTP device lost | Allow backup codes (stored hashed in `users.mfa_backup_codes`) |
| Concurrent refresh requests | First wins; second receives the newly rotated token |
| JWT issued before password reset | Session validation catches it (session revoked on reset) |
| SSO / SAML flow | Identical to Google OAuth flow but with `provider = 'saml'`, IdP-configured per org |

---

## Appendix: Supporting Tables Required

Beyond the tables already in [database_design.md](./database_design.md), the auth system requires these two auxiliary tables:

### `email_verification_tokens`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK → users | CASCADE DELETE |
| `token_hash` | VARCHAR(64) | SHA-256 of raw token |
| `expires_at` | TIMESTAMPTZ | NOW() + 24 hours |
| `used_at` | TIMESTAMPTZ NULL | NULL = unused |
| `created_at` | TIMESTAMPTZ | |

### `password_reset_tokens`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK → users | CASCADE DELETE |
| `token_hash` | VARCHAR(64) | SHA-256 of raw token |
| `expires_at` | TIMESTAMPTZ | NOW() + 1 hour |
| `used_at` | TIMESTAMPTZ NULL | NULL = unused |
| `created_at` | TIMESTAMPTZ | |

> **Note:** Both tables are high-churn. Run a nightly cron to delete rows where `expires_at < NOW() - INTERVAL '7 days'`. Can be partitioned by `created_at` (monthly) if volume is high.
