# Requirement: AI Support Inbox Triage — MVP

## Classification

- **Type**: Operational AI workflow demo with real integrations
- **NOT**: Full SaaS platform
- **Goal**: Deploy fast, look credible, demonstrate backend/AI integration depth, create reusable demo asset

## Core Features

### 1. Gmail Connection

- Supabase Auth with Google OAuth provider (NOT NextAuth)
- Read inbox emails (latest 20-50)
- Manual sync via "Sync Inbox" button (no realtime)
- Token refresh handled by Supabase Auth natively

### 2. AI Email Processing (single pipeline, per email)

- Classify category: Billing, Bug Report, Feature Request, Customer Complaint, Sales Inquiry, General
- Assign priority: High, Medium, Low
- Generate summary
- Sentiment detection
- Confidence score (visualized as bar/badge, not raw number)
- Escalation risk detection (angry tone, refund threats, outage language)
- Classification rationale (why classified this way — enterprise naming, NOT "AI Reasoning")
- Structured JSON output, Zod-validated
- Prompts: compact, deterministic, minimal tokens

### 3. AI Provider

- OpenAI-compatible API (NOT Anthropic SDK directly)
- Configurable via env: `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`
- Supports: OpenAI, Groq, Together, Ollama, Anthropic via proxy
- All inference server-side only — never expose keys to frontend
- Zero code changes to swap providers

### 4. Dashboard UI

- Executive Summary widget at top (emails processed, escalations, top category, avg sentiment)
- Kanban/table hybrid grouped by priority or category (toggle)
- Email cards: Subject, Sender, AI Summary, Priority badge, Confidence bar, Category tag, Escalation warning, Timestamp
- Filters: category, priority only (NO date range)
- Expandable "Classification Rationale" section per card (or "Why this was flagged")

### 5. Processing State Animation

- Step-by-step progress during sync with checkmarks
- "Processing inbox..." → "✓ Emails fetched" → "✓ AI classification complete" → "✓ 3 escalations detected"
- Makes app feel alive and operational

### 6. Activity Feed

- Sequential animated log (faked, not realtime websockets)
- Metrics: emails processed, avg latency, avg confidence, escalations flagged
- Operational perception

### 7. Escalation Detection

- Flag emails with: angry tone, refund threats, outage/production language, revenue impact
- Visual banner: "⚠ Potential escalation risk detected"
- Enterprise/support-ops feel

### 8. Demo Mode

- `/demo` route with 10-15 pre-classified realistic support emails
- No OAuth dependency during demos
- No API calls needed — data is pre-computed

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend + Backend | Next.js (App Router) | Full-stack, fast iteration, Vercel deploy |
| Database + Auth | Supabase (Postgres + Auth) | Single platform, less moving parts |
| AI | OpenAI-compatible API | Provider-agnostic, swap via env vars |
| Hosting | Vercel | Fastest deployment path |
| Styling | Tailwind + shadcn/ui | Polished with minimal effort |

## DB Schema (Flat — Single Table)

```
emails: id, user_id, gmail_message_id, sender, subject, body, received_at,
        category, priority, summary, sentiment, confidence, escalation_risk,
        rationale, processing_time_ms, created_at
```

No separate tables. One table.

## Architecture

```
Gmail API → /api/gmail/sync (fetch + classify + persist, server-side) → Supabase → Dashboard UI
```

Single pipeline. No separate classify endpoint. No queues. No async workers.

## Constraints

- No realtime/Pub/Sub/Gmail watch
- No NextAuth (Supabase Auth only)
- No separate /api/classify endpoint
- No date range filters
- No normalized DB (flat table)
- No verbose/chain-of-thought prompts (compact + deterministic)
- No client-side LLM calls (all server-side)
- No provider lock-in (OpenAI-compatible interface)
- Activity feed is animated sequentially, NOT websocket-based

## Timeline

5 days (Day 1: foundation/Gmail, Day 2: AI pipeline + escalation, Day 3: UI + demo, Day 4: summary/feed/polish, Day 5: deploy/record)

## Stretch (only if time)

- Suggested AI reply drafts
- SLA breach prediction
- Auto-escalation routing
