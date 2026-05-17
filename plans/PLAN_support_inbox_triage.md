# Plan: AI Support Inbox Triage — MVP

## Overview

Operational AI workflow demo: Gmail → LLM classification → polished dark-mode dashboard with escalation detection, classification rationale, and executive summary. Single pipeline. Reusable demo asset that showcases workflow orchestration + operational visibility. Optimized for the "client browses it for 2 minutes" scenario.

## Tech Stack

- **Runtime**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase (Postgres, no RLS, no indexes — <100 rows)
- **Auth**: Supabase Auth with Google OAuth provider
- **AI**: OpenAI-compatible API (configurable via env: `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`)
- **Hosting**: Vercel
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion
- **Dark mode**: `next-themes` (default: dark)

## Testing Strategy

- **No automated tests.** Manual verify:
  1. Demo mode loads correctly
  2. Landing page renders
  3. Dark mode works
  4. One real sync (if OAuth available)
  5. Mobile responsive
- **Done when**: Demo mode impresses in a 2-minute walkthrough

## Phases

### Phase 1: Foundation & Gmail Sync (Day 1)

- Step 1: Initialize Next.js (TypeScript, Tailwind, shadcn/ui, Framer Motion, next-themes)
- Step 2: Configure Supabase — flat `emails` table (no RLS, no indexes)
- Step 3: Set up Supabase Auth with Google OAuth (Gmail read scope)
- Step 4: Implement Gmail fetch service (`/lib/gmail.ts`)
- Step 5: Create `/api/gmail/sync` route — single pipeline: fetch → classify → persist
- Step 6: Basic "Sync Inbox" button (verify pipeline works)

### Phase 2: AI Classification + Escalation (Day 2)

- Step 1: Create AI service (`/lib/ai.ts`) — raw fetch to OpenAI-compatible endpoint, no SDK
- Step 2: Define compact prompt (`/lib/prompts.ts`) — ≤200 token system prompt, structured JSON output
- Step 3: Integrate into sync pipeline (parallel via `Promise.allSettled`)
- Step 4: Zod validation — on failure, return null, skip email, move on
- Step 5: Escalation detection (via prompt — angry tone, threats, outage language)
- Step 6: Persist with processing_time_ms

### Phase 3: Dashboard + Demo Mode (Day 3)

- Step 1: Build landing page (hero section, mini architecture diagram with animated arrows, "Try Demo" + "Sign In" CTAs)
- Step 2: Build dashboard layout (executive summary + main grid + activity sidebar)
- Step 3: Create email card with hover animation (Framer Motion lift effect)
- Step 4: Expandable detail view + "Classification Rationale" section
- Step 5: Confidence bars, priority badges, category tags, escalation banners
- Step 6: Create `/demo` with 12 high-quality seeded emails (pre-classified, no API calls)

### Phase 4: Polish & Animations (Day 4)

- Step 1: Executive Summary widget (4 stat cards + "Processed in X.Xs" badge — uses totalTimeMs)
- Step 2: Activity feed with stagger animation (ends with "Processed 20 emails in 8.2s")
- Step 3: Sync button with processing state animation (step-by-step checkmarks)
- Step 4: Filter bar (category + priority) + grouping toggle
- Step 5: Dark mode (default dark, toggle in header)
- Step 6: Responsive layout, loading states, error toasts

### Phase 5: Deploy & Package (Day 5)

- Step 1: Vercel deployment
- Step 2: Verify demo mode works (THE critical check)
- Step 3: Verify landing page → demo flow is smooth
- Step 4: README with screenshots
- Step 5: Loom recording (2 min following the Client Demo Script)
- Step 6: GitHub cleanup + screenshots for portfolio

## DB Schema

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

No RLS. No indexes. No CHECK constraints. Done.

## Architecture

```
Landing Page ("Try Demo" / "Sign In")
    ↓
/api/gmail/sync (single pipeline, server-side)
    ├── Fetch emails (Gmail API)
    ├── Classify in parallel (Promise.allSettled → LLM)
    ├── Zod validate (skip on failure)
    └── Upsert to Supabase
    ↓
Dashboard UI
    ├── Executive Summary (4 stats)
    ├── Email cards (animated, expandable)
    ├── Escalation banners (pulsing)
    ├── Classification Rationale (expandable)
    ├── Confidence bars (colored)
    ├── Filters + grouping
    └── Activity feed (stagger animated)
```

## Error Handling

Simple: try/catch + skip + toast. No retry loops. No custom error classes. If something fails, show a toast and move on. Demo mode is the safety net.

## Client Demo Script (optimized 2-min path)

| Time | Action | Impression |
|------|--------|-----------|
| 0:00 | Land on hero page (dark, architecture diagram with animated arrows) | "This is technical" |
| 0:05 | See "20 emails processed in 8.2s" below diagram | "Real backend, not a toy" |
| 0:10 | Click "Try Demo" | "No friction" |
| 0:15 | See executive summary + "Processed in 8.2s" + animated feed | "Ops tool" |
| 0:30 | Scan cards, notice red escalation banners | "Smart prioritization" |
| 0:45 | Expand card → read Classification Rationale | "Explainable AI" |
| 1:00 | Toggle grouping, filter by category | "Well-built" |
| 1:30 | Notice dark mode, confidence bars, animations | "Polished" |
| 2:00 | Overall: "This person builds operational AI tools" | **Hired** |

## Key Differentiators

| Feature | Why It Wins |
|---------|-------------|
| Architecture Diagram on Landing | Founders love diagrams. Feels technical/infrastructural. |
| "Processed in X.Xs" Badge | Throughput feel. Shows backend is real. |
| Classification Rationale | Explainable > black box |
| Escalation Detection | Enterprise ops feel |
| Executive Summary | Management-oriented |
| Processing Animation | App feels alive |
| Dark Mode Default | Modern in 2026 |
| Landing Page Hero | First impression matters |
| Micro-animations | "Polished" in 2 seconds flat |

## Risks

| Risk | Mitigation |
|------|------------|
| OAuth verification warning | Demo mode (clients never need to auth) |
| LLM returns garbage | Zod → skip. Demo data is pre-computed. |
| Vercel timeout | Parallel LLM calls + max 20 emails |
| Scope creep | No tests, no RLS, no indexes, no retries |
