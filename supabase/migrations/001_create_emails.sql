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
