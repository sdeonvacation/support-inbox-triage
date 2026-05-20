# Triagent

AI-powered inbox classification that transforms Gmail chaos into a prioritized triage dashboard in seconds.

## What it does

Triagent connects to your Gmail account and automatically classifies every email by priority, category, sentiment, and escalation risk using OpenAI or Anthropic. The classified emails appear in a real-time dashboard with advanced filtering, activity tracking, and an executive summary—turning inbox overload into actionable insights.

The pipeline is simple: sign in with Google OAuth → sync Gmail inbox → AI classifies each email → results store in Supabase → interactive dashboard filters and displays classified emails with live activity feed.

## Features

- **Gmail sync** – Fetch your latest emails directly via Google OAuth provider token
- **AI classification** – Automatic categorization into 14 categories (bills, meetings, promotions, alerts, etc.)
- **Priority scoring** – High/Medium/Low with escalation risk detection
- **Sentiment analysis** – Understand emotional tone and urgency
- **Confidence scores** – Know how certain the AI is about each classification
- **Executive summary** – Top category, avg sentiment, escalation count at a glance
- **Advanced filtering** – Filter by priority, category, or group by either
- **Activity feed** – Real-time sync history with per-email processing times
- **Dark mode UI** – Sleek Aurora-themed dashboard with Spline 3D
- **Demo mode** – Try without Gmail by viewing pre-classified sample emails

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, GSAP, Framer Motion |
| Auth | Supabase Auth + Google OAuth |
| Database | Supabase (PostgreSQL) |
| AI | OpenAI API (default) or Anthropic Claude |
| UI Components | Radix UI, Lucide Icons |
| 3D Graphics | Spline, Three.js |
| State Management | React hooks |
| Validation | Zod |

## Architecture

```
1. User → Sign in with Google OAuth
2. Browser → Store provider_token (Gmail access) in Supabase session
3. Dashboard → Click "Sync Gmail" → POST /api/gmail/sync
4. Backend → Fetch ~20 most recent emails via Gmail API
5. Backend → Classify each email in parallel using OpenAI/Anthropic
   - Extracted fields: category, priority, sentiment, summary, 
     confidence, escalation_risk, rationale
6. Backend → Upsert results into Supabase `emails` table
   - Prevents duplicates via (user_id, gmail_message_id) conflict
7. Dashboard → Fetch classified emails from Supabase
8. UI → Render email grid, apply filters, show activity feed
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project (free tier available)
- Google Cloud OAuth 2.0 credentials with `gmail.readonly` scope
- OpenAI API key (or Anthropic Claude API key)

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_key

# AI Provider (openai or anthropic)
AI_PROVIDER=openai
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4-turbo

# OpenAI
OPENAI_API_KEY=sk_...

# Anthropic (if using Claude)
ANTHROPIC_API_KEY=sk-ant-...
```

All variables are required except `AI_BASE_URL` (uses provider defaults if omitted).

### Installation

```bash
git clone https://github.com/sdeonvacation/triagent
cd triagent
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
app/
  page.tsx                    # Landing page with hero, features, how it works
  dashboard/page.tsx          # Main authenticated dashboard
  demo/page.tsx               # Demo mode (no auth required)
  api/gmail/sync/route.ts     # Email sync & AI classification endpoint
  api/auth/...                # Supabase auth routes

components/
  sync-button.tsx             # Trigger Gmail sync with progress
  filter-bar.tsx              # Priority/category filters
  email-grid.tsx              # Display classified emails with details
  activity-feed.tsx           # Real-time sync events log
  executive-summary.tsx       # Stats: processed, escalations, sentiment
  ui/                         # Reusable UI: buttons, cards, spline scene

lib/
  gmail.ts                    # Gmail API (fetch emails via provider token)
  ai.ts                       # OpenAI/Anthropic classification logic
  supabase.ts                 # Client/server Supabase setup
  types.ts                    # TypeScript interfaces
  email-utils.ts              # Summary computation, filtering
  demo-data.ts                # Sample classified emails for demo mode
```

## Live Demo

Try the app without auth: https://triagent.vercel.app/demo

Or sign in with your Google account at https://triagent.vercel.app to use your real inbox.

## Privacy

We respect your data. See our [privacy policy](https://triagent.vercel.app/privacy) for details.

- Gmail emails are fetched on-demand via your OAuth token
- Classifications are stored in your Supabase instance only
- No email content is logged or retained after classification
- You can revoke access anytime via Google Account Settings

## License

MIT

