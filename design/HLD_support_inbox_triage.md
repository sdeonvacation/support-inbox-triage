# HLD: AI Support Inbox Triage — MVP

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Language | TypeScript | Type safety, full-stack consistency |
| Framework | Next.js 14+ (App Router) | Full-stack SSR/API routes, Vercel-native |
| Database | Supabase (Postgres) | Managed Postgres, built-in auth |
| Auth | Supabase Auth (Google OAuth) | Native token refresh, Gmail scope |
| AI | OpenAI-compatible API | Provider-agnostic via env vars |
| Styling | Tailwind CSS + shadcn/ui + Framer Motion | Polished UI with animations |
| Hosting | Vercel | Zero-config deployment |
| Validation | Zod | Runtime type checking for LLM responses |

## Components

| Component | Responsibility | Dependencies |
|-----------|---------------|--------------|
| Gmail Service | Fetch emails via Gmail API, parse/clean bodies | Supabase Auth (OAuth token) |
| AI Service | Classify emails via OpenAI-compatible API | AI env vars |
| Prompt Builder | Format compact classification prompt | None |
| Sync Pipeline API | Orchestrate fetch → classify → persist | Gmail Service, AI Service, Supabase |
| Supabase Client | DB reads/writes, auth session | Supabase env vars |
| Landing Page | Hero section, login CTA, feature preview | None |
| Dashboard Page | Render classified emails with filters/grouping | Supabase Client |
| Demo Page | Render pre-classified seeded data | Seeded data module |
| Executive Summary | Aggregate stats widget | Dashboard data |
| Activity Feed | Animated sequential log | Sync response data |
| Email Card + Detail | Display email with expandable detail view | Dashboard data |

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER (Client)                            │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ / (Landing)  │  │ /dashboard   │  │ /demo        │             │
│  │              │  │              │  │              │             │
│  │ Hero + CTA   │  │ Real data    │  │ Seeded data  │             │
│  │ Feature list │  │ from Supabase│  │ No API calls │             │
│  └──────────────┘  └──────┬───────┘  └──────────────┘             │
│                            │                                        │
│  Shared Components:        │ Supabase client query                  │
│  ├─ ExecutiveSummary       │                                        │
│  ├─ EmailCard + Detail     │ "Sync Inbox" → POST /api/gmail/sync   │
│  ├─ ActivityFeed           │                                        │
│  ├─ FilterBar              │                                        │
│  ├─ ConfidenceBar          │                                        │
│  └─ EscalationBanner       │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SERVER (Next.js API Routes)                     │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              POST /api/gmail/sync                               │ │
│  │                                                                 │ │
│  │  1. Get session (Supabase Auth)                                │ │
│  │  2. Get provider_token (Google OAuth)                          │ │
│  │  3. Fetch emails (Gmail API)                                   │ │
│  │  4. For each email:                                            │ │
│  │     a. Clean/parse body                                        │ │
│  │     b. Call LLM → structured JSON                              │ │
│  │     c. Validate with Zod (skip on failure)                     │ │
│  │     d. Upsert to Supabase                                      │ │
│  │  5. Return summary                                             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ lib/gmail.ts │  │ lib/ai.ts    │  │ lib/prompts.ts           │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────────┘  │
└─────────┼──────────────────┼────────────────────────────────────────┘
          │                  │
          ▼                  ▼
┌──────────────────┐  ┌──────────────────┐
│  Gmail API       │  │  LLM Provider    │
│  (Google)        │  │  (OpenAI-compat) │
└──────────────────┘  └──────────────────┘

          ▼ Persist
┌──────────────────────────────────────┐
│         Supabase (Postgres)          │
│  ┌────────────────────────────────┐  │
│  │  emails table (flat, single)   │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  auth.users (managed)          │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

No queues. No workers. No event buses. No separate endpoints. No RLS (single user demo, service role server-side).

## Interfaces

### Gmail Service (`lib/gmail.ts`)

| Method | Input | Output | Behavior |
|--------|-------|--------|----------|
| `fetchEmails` | `(accessToken: string, maxResults?: number)` | `Promise<GmailMessage[]>` | Lists messages, fetches content, parses headers/body. Throws on auth/network failure. |
| `parseMessageBody` | `(payload: GmailPayload)` | `string` | Extracts text, strips HTML, truncates to 2000 chars. Returns empty string on failure. |

### AI Service (`lib/ai.ts`)

| Method | Input | Output | Behavior |
|--------|-------|--------|----------|
| `classifyEmail` | `(email: EmailInput)` | `Promise<ClassificationResult \| null>` | Calls LLM, validates with Zod. Returns `null` on failure (skip email). No retries. |

### Sync Pipeline (`app/api/gmail/sync/route.ts`)

| Method | Input | Output | Behavior |
|--------|-------|--------|----------|
| `POST` | `Request` (session from cookie) | `SyncResponse` | Auth → fetch → classify → persist → summary. 401 if no session. |

### Prompt Builder (`lib/prompts.ts`)

| Method | Input | Output | Behavior |
|--------|-------|--------|----------|
| `buildClassificationPrompt` | `(email: EmailInput)` | `ChatMessage[]` | Returns system + user messages. Never throws. |

## Data Flow

### Sync Flow

| Step | Action | On Failure |
|------|--------|-----------|
| 1 | User clicks "Sync Inbox" → POST `/api/gmail/sync` | — |
| 2 | Get Supabase session + provider_token | → 401 + toast |
| 3 | Fetch Gmail messages (max 20) | → 500 + error toast |
| 4 | Parse/clean each message body | → skip email |
| 5 | Call LLM for classification (parallel with `Promise.allSettled`) | → skip email |
| 6 | Validate response with Zod | → skip email |
| 7 | Upsert to Supabase (deduplicate by gmail_message_id) | → skip email |
| 8 | Return `SyncResponse` | — |
| 9 | UI animates activity feed + refreshes dashboard | — |

### Demo Flow

| Step | Action |
|------|--------|
| 1 | `/demo` imports `lib/demo-data.ts` |
| 2 | Pass data to same dashboard components |
| 3 | Auto-animate activity feed on page load |

**Error handling philosophy**: try/catch + skip + toast. No custom error classes. No retry loops. If LLM fails for one email, move on. Return partial success.

## Data Model

### SQL Schema

```sql
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gmail_message_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  received_at TIMESTAMPTZ,
  category TEXT,
  priority TEXT,
  summary TEXT,
  sentiment TEXT,
  confidence FLOAT4,
  escalation_risk BOOLEAN DEFAULT FALSE,
  rationale TEXT,
  processing_time_ms INT4,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, gmail_message_id)
);
```

No RLS. No indexes. No CHECK constraints. <100 rows. Single user. Don't overthink it.

## TypeScript Interfaces

```typescript
// === Core Types ===

interface EmailInput {
  subject: string;
  sender: string;
  body: string;
  receivedAt: string;
}

interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  sender: string;
  body: string;
  receivedAt: string;
}

// === AI Response (Zod-validated) ===

interface ClassificationResult {
  category: 'Billing' | 'Bug Report' | 'Feature Request' | 'Customer Complaint' | 'Sales Inquiry' | 'General';
  priority: 'High' | 'Medium' | 'Low';
  summary: string;
  sentiment: string;
  confidence: number;
  escalation_risk: boolean;
  rationale: string;
}

// === API Response ===

interface SyncResponse {
  success: boolean;
  processed: number;
  skipped: number;
  escalations: number;
  totalTimeMs: number;
}

// === DB Row ===

interface EmailRow {
  id: string;
  user_id: string;
  gmail_message_id: string;
  sender: string;
  subject: string;
  body: string | null;
  received_at: string | null;
  category: string | null;
  priority: string | null;
  summary: string | null;
  sentiment: string | null;
  confidence: number | null;
  escalation_risk: boolean;
  rationale: string | null;
  processing_time_ms: number | null;
  created_at: string;
}

// === UI State ===

type GroupBy = 'priority' | 'category';

interface DashboardFilters {
  category: string;
  priority: string;
  groupBy: GroupBy;
}

interface ExecutiveSummaryData {
  totalProcessed: number;
  escalationCount: number;
  topCategory: string;
  avgSentiment: string;
  avgConfidence: number;
  totalTimeMs: number;  // "Processed in X.Xs" — high-impact metric
}

interface ActivityFeedItem {
  id: string;
  message: string;
  timestamp: number;  // ms offset for animation delay
  type: 'success' | 'warning' | 'info';
}

interface SyncState {
  status: 'idle' | 'syncing' | 'complete' | 'error';
  steps: { label: string; status: 'pending' | 'active' | 'complete' | 'error' }[];
}
```

## Zod Schema

```typescript
import { z } from 'zod';

export const classificationSchema = z.object({
  category: z.enum(['Billing', 'Bug Report', 'Feature Request', 'Customer Complaint', 'Sales Inquiry', 'General']),
  priority: z.enum(['High', 'Medium', 'Low']),
  summary: z.string().min(10).max(200),
  sentiment: z.string().min(3).max(30),
  confidence: z.number().min(0).max(1),
  escalation_risk: z.boolean(),
  rationale: z.string().min(10).max(300),
});
```

## AI Integration Design

### Client Config

```typescript
// lib/ai.ts
// Uses OpenAI-compatible fetch — no SDK dependency needed
// Config from env: AI_BASE_URL, AI_API_KEY, AI_MODEL
// Timeout: 30s per email
// On failure: return null (skip email)
```

### Prompt Design

- System prompt: ≤200 tokens. Role + JSON schema + rules. No chain-of-thought.
- User message: `Subject: ...\nFrom: ...\nBody: ...` (truncated 2000 chars)
- Response: `response_format: { type: "json_object" }` where supported
- Fallback: JSON.parse from response text

### Prompt Template (compact)

```
SYSTEM: You classify support emails. Return JSON only.
{category, priority, summary, sentiment, confidence, escalation_risk, rationale}
Categories: Billing, Bug Report, Feature Request, Customer Complaint, Sales Inquiry, General
Priority: High (urgent/revenue impact), Medium (needs attention), Low (informational)
escalation_risk: true if angry tone, threats, outage, revenue impact.
rationale: 1 sentence explaining classification.

USER: Subject: {subject}\nFrom: {sender}\nBody: {body}
```

## Auth Flow

```
User clicks "Sign in with Google"
    → Supabase Auth redirects to Google OAuth
    → User grants gmail.readonly scope
    → Callback to /auth/callback
    → Supabase stores session + provider_token
    → Redirect to /dashboard

On sync:
    → getSession() → session.provider_token
    → Use as Bearer token for Gmail API
    → Supabase handles refresh automatically
```

That's it. No manual refresh logic. Trust the SDK.

## Frontend Component Tree

```
app/
├── layout.tsx                     # Root (Tailwind, fonts, dark mode, Supabase provider)
├── page.tsx                       # Landing page (hero, features, login CTA)
├── dashboard/
│   └── page.tsx                   # Main dashboard
│       ├── <ExecutiveSummary />   # Stats bar at top
│       ├── <SyncButton />        # Sync + processing animation
│       ├── <FilterBar />         # Category + Priority filters, GroupBy toggle
│       ├── <EmailGrid />         # Grouped cards
│       │   └── <EmailCard />     # Per-email (expandable to detail view)
│       │       ├── PriorityBadge, CategoryTag, ConfidenceBar
│       │       ├── EscalationBanner
│       │       └── RationaleSection (expandable "Classification Rationale")
│       └── <ActivityFeed />      # Animated log (sidebar)
├── demo/
│   └── page.tsx                   # Same components, seeded data, no auth
└── auth/
    └── callback/
        └── route.ts               # OAuth callback
```

### Component Behavior (what makes it impressive)

| Component | The "Wow" Factor |
|-----------|-----------------|
| Landing Page | Hero + mini architecture diagram (animated arrows) + "20 emails in 8.2s" badge. Dark mode. |
| ExecutiveSummary | 4 stat cards with icons. Includes "Processed in X.Xs" from last sync. |
| SyncButton | Animated steps: "Fetching..." → "✓ Emails fetched" → "Classifying..." → "✓ 3 escalations" → "Done in 8.2s" |
| EmailCard | Hover: subtle lift (Framer Motion). Click: expands to show full detail + rationale. |
| ConfidenceBar | Thin colored progress bar. Green (>0.8), Yellow (0.5-0.8), Red (<0.5). |
| EscalationBanner | Red warning bar with pulse animation. Impossible to miss. |
| RationaleSection | Expandable. "Classification Rationale: mentions production outage + revenue impact" |
| ActivityFeed | Items appear one-by-one with stagger animation. Ends with "Processed 20 emails in 8.2s" |
| ArchDiagram | 3 styled boxes with animated connecting arrows. Tiny but impressive. |
| Dark Mode | Toggle in header. Default: dark. Because it's 2026. |

## Demo Mode Design

### How `/demo` Works

1. Public page — no auth
2. Imports `lib/demo-data.ts` — all data pre-computed
3. Same components as dashboard (code reuse)
4. Activity feed auto-animates on mount
5. "Demo Mode" badge in header (subtle)
6. "Try with your own inbox →" CTA at bottom

### Seeded Email Quality (THIS MATTERS MOST)

| # | Subject | Category | Priority | Escalation | Rationale Preview |
|---|---------|----------|----------|------------|-------------------|
| 1 | "URGENT: Production API returning 500s" | Bug Report | High | ✅ | Mentions production outage affecting paying customers |
| 2 | "Requesting full refund or we escalate legally" | Customer Complaint | High | ✅ | Legal threat + refund demand + aggressive tone |
| 3 | "Enterprise plan pricing for 500 seats" | Sales Inquiry | High | ❌ | High-value opportunity, enterprise language |
| 4 | "Re: Re: Re: Still broken after 3 updates" | Bug Report | High | ✅ | Multiple follow-ups indicate frustration escalation |
| 5 | "Would love to see calendar integration" | Feature Request | Low | ❌ | Polite suggestion, no urgency |
| 6 | "Your product is garbage, canceling NOW" | Customer Complaint | High | ✅ | Hostile language + cancellation intent |
| 7 | "Invoice #4521 doesn't match our agreement" | Billing | Medium | ❌ | Financial discrepancy, needs review |
| 8 | "Can't login since this morning" | Bug Report | Medium | ❌ | Service disruption, not outage-scale |
| 9 | "Partnership inquiry from TechCorp" | Sales Inquiry | Medium | ❌ | B2B opportunity, professional tone |
| 10 | "How do I export my data?" | General | Low | ❌ | Simple question, no urgency |
| 11 | "CRITICAL: Payment processing down for all users" | Bug Report | High | ✅ | Revenue-impacting infrastructure failure |
| 12 | "Thanks for the quick fix last week!" | General | Low | ❌ | Positive feedback, no action needed |

## Landing Page Design

### Structure

```
┌──────────────────────────────────────────────┐
│  HEADER: Logo + "Try Demo" + "Sign In"       │
├──────────────────────────────────────────────┤
│                                              │
│  HERO:                                       │
│  "AI-Powered Support Inbox Triage"           │
│  "Classify, prioritize, and detect           │
│   escalations — automatically."              │
│                                              │
│  [Try Demo]  [Connect Gmail]                 │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  ARCHITECTURE DIAGRAM (mini, styled):        │
│                                              │
│  ┌───────┐    ┌──────────────┐    ┌──────┐ │
│  │ Gmail │ ──▶│AI Classifica-│──▶│Priori-│ │
│  │ Inbox │    │    tion      │    │tized  │ │
│  │       │    │              │    │Dash-  │ │
│  └───────┘    └──────────────┘    │board  │ │
│                                    └──────┘ │
│                                              │
│  "20 emails processed in 8.2s"              │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  FEATURES (3 columns):                       │
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │ 🎯     │ │ ⚡     │ │ 🚨     │          │
│  │Classify│ │Priority│ │Escalate│          │
│  │ Auto-  │ │ Smart  │ │ Detect │          │
│  │ detect │ │ assign │ │ risks  │          │
│  └────────┘ └────────┘ └────────┘          │
│                                              │
├──────────────────────────────────────────────┤
│  FOOTER: "Built with Next.js • OpenAI API"  │
└──────────────────────────────────────────────┘
```

### Architecture Diagram Section

NOT a screenshot. A styled inline SVG or Tailwind-rendered diagram:

```
[Gmail Inbox] ──→ [AI Classification] ──→ [Prioritized Dashboard]
```

- 3 boxes with connecting arrows
- Subtle gradient or glass-morphism on boxes
- Animated: arrows pulse or flow left-to-right on load
- Below diagram: "20 emails processed in 8.2s" (uses real totalTimeMs from last sync, or demo value)

**Why**: Founders/CTOs love architecture visuals. Makes the app feel *technical* and *infrastructural* instead of "just a UI." Minimal effort (3 styled divs + 2 arrows), maximum enterprise perception.

### "Processed in X seconds" Badge

Displayed in two places:
1. **Landing page**: Static demo value ("20 emails processed in 8.2s")
2. **Dashboard**: Live value from last sync (`SyncResponse.totalTimeMs`)

Format: `{count} emails processed in {time}s`

Gives: operational feel, throughput feel, performance feel. Shows the backend is real, not just a pretty frontend.

### Why This Matters

Client lands here first. If this looks like a default Next.js starter, they bounce. 30 seconds to impress.

## Dark Mode

- Default: dark (modern default in 2026)
- Toggle: sun/moon icon in header
- Implementation: Tailwind `dark:` classes + `next-themes`
- Persistence: localStorage

## Micro-Animations (Framer Motion)

| Element | Animation | Purpose |
|---------|-----------|---------|
| Email cards | `whileHover: { y: -2, shadow }` | Cards feel interactive |
| Card enter | `initial: { opacity: 0, y: 20 }` staggered | Dashboard feels alive on load |
| Activity feed items | Stagger in with 400ms delays | Simulates real-time processing |
| Sync button | Pulse while syncing | Shows activity |
| Escalation banner | Subtle pulse on red background | Draws eye to urgent items |
| Page transitions | Fade in (200ms) | Smooth navigation |

## Folder Structure

```
support-inbox-triage/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Landing page
│   ├── globals.css
│   ├── dashboard/
│   │   └── page.tsx
│   ├── demo/
│   │   └── page.tsx
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts
│   └── api/
│       └── gmail/
│           └── sync/
│               └── route.ts
├── components/
│   ├── ui/                           # shadcn/ui
│   ├── executive-summary.tsx
│   ├── sync-button.tsx
│   ├── filter-bar.tsx
│   ├── email-grid.tsx
│   ├── email-card.tsx
│   ├── confidence-bar.tsx
│   ├── escalation-banner.tsx
│   ├── rationale-section.tsx
│   ├── activity-feed.tsx
│   ├── arch-diagram.tsx              # Mini architecture diagram (landing page)
│   ├── processed-badge.tsx           # "20 emails processed in 8.2s"
│   ├── landing-hero.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── supabase.ts
│   ├── gmail.ts
│   ├── ai.ts
│   ├── prompts.ts
│   ├── schemas.ts
│   ├── email-utils.ts
│   ├── demo-data.ts
│   └── types.ts
├── supabase/
│   └── migrations/
│       └── 001_create_emails.sql
├── public/
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Environment Variables

| Variable | Description | Exposed to Browser |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `AI_BASE_URL` | OpenAI-compatible API URL | No |
| `AI_API_KEY` | LLM provider API key | No |
| `AI_MODEL` | Model identifier (e.g. `gpt-4o-mini`) | No |

5 env vars. That's it. Google OAuth configured in Supabase dashboard, not in app.

## Client Demo Script (2-Minute Walkthrough)

This is the optimized path a client follows:

| Time | What They See | Impression |
|------|--------------|------------|
| 0:00 | Landing page — dark, architecture diagram with flowing arrows | "This is technical, not a toy" |
| 0:05 | Notice "20 emails processed in 8.2s" badge below diagram | "Real infrastructure behind this" |
| 0:10 | Click "Try Demo" → Dashboard loads with 12 pre-classified emails | "Instant, no friction" |
| 0:15 | Executive Summary: "12 processed, 5 escalations" + "Processed in 8.2s" | "Ops tool with performance visibility" |
| 0:20 | Activity feed animates: checkmarks appearing → ends with timing | "Feels alive" |
| 0:30 | Scan email cards — red escalation banners catch eye | "Smart prioritization" |
| 0:40 | Click escalated email → detail expands with full classification | "Thorough" |
| 0:50 | Read "Classification Rationale" — explains WHY it's high priority | "Explainable AI, not a black box" |
| 1:00 | Toggle grouping: priority → category | "Interactive, well-built" |
| 1:10 | Filter to "Bug Reports" only | "Functional" |
| 1:20 | Notice confidence bars — visual, not raw numbers | "Polished" |
| 1:30 | Notice dark mode toggle, try it | "Modern" |
| 2:00 | Done — overall impression: "This person builds operational AI infra" | **Hired** |

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| No RLS | Service role server-side | Single user demo, RLS adds debug time for zero visible benefit |
| No indexes | None needed | <100 rows, Postgres seq-scans in microseconds |
| No retry logic | Try once, skip on failure | Demo has seeded data as fallback. Real sync can lose 1-2 emails. |
| No custom error types | try/catch + generic toast | Client never sees error class names |
| No test suite | Manual verify demo mode + one real sync | Tests are invisible to clients. Time better spent on polish. |
| Framer Motion | Card animations + stagger | Instant "polished" perception for minimal effort |
| Dark mode default | `next-themes` + Tailwind dark: | It's 2026. Light-only feels dated. |
| Landing page hero | Custom (not redirect to login) | First impression. 30 seconds to impress or bounce. |
| Parallel LLM calls | `Promise.allSettled` | Reduces sync time from 60s to ~10s for 20 emails |
| No SDK for LLM | Raw fetch to OpenAI-compatible endpoint | Zero deps, full control, any provider |

## Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Google OAuth unverified app warning | High | Demo mode. Clients never need to auth. |
| LLM returns garbage | Medium | Zod validation → skip email → partial success. Demo data is pre-computed. |
| Vercel function timeout (>10s) | Medium | Parallel LLM calls + limit to 20 emails + upgrade to Pro if needed |
| Gmail token expired | Low | Supabase auto-refreshes. On failure, show re-auth toast. |
| LLM cost during dev | Low | gpt-4o-mini is cheap. Upsert prevents re-classification. |

## Verification (Manual Only)

Before deploy, verify manually:

1. `/demo` loads with all 12 emails, stats correct, animations work
2. Landing page renders, both buttons work
3. Dark mode toggles correctly
4. One real Gmail sync processes + displays (if OAuth available)
5. Mobile responsive (check on phone)

No automated tests. Manual is fine for a demo asset.
