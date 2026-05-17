import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { fetchEmails } from '@/lib/gmail';
import { classifyEmail } from '@/lib/ai';
import { SyncResponse } from '@/lib/types';

export async function POST(_req: NextRequest) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch { /* ignore */ }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch { /* ignore */ }
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const providerToken = session.provider_token;
  if (!providerToken) {
    return NextResponse.json({ error: 'No Gmail access token' }, { status: 400 });
  }

  const startTime = Date.now();

  // Fetch emails from Gmail
  const gmailMessages = await fetchEmails(providerToken, 20);

  // Classify all emails in parallel
  const results = await Promise.allSettled(
    gmailMessages.map(async (msg) => {
      const t0 = Date.now();
      const classification = await classifyEmail(msg.subject, msg.sender, msg.body);
      const processingTimeMs = Date.now() - t0;

      if (!classification) return null;

      return {
        user_id: session.user.id,
        gmail_message_id: msg.id,
        sender: msg.sender,
        subject: msg.subject,
        body: msg.body,
        received_at: msg.receivedAt,
        category: classification.category,
        priority: classification.priority,
        summary: classification.summary,
        sentiment: classification.sentiment,
        confidence: classification.confidence,
        escalation_risk: classification.escalation_risk,
        rationale: classification.rationale,
        processing_time_ms: processingTimeMs,
      };
    })
  );

  let processed = 0;
  let skipped = 0;
  let escalations = 0;

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value !== null) {
      const row = result.value;
      const { error } = await supabase
        .from('emails')
        .upsert(row, { onConflict: 'user_id,gmail_message_id' });

      if (!error) {
        processed++;
        if (row.escalation_risk) escalations++;
      } else {
        skipped++;
      }
    } else {
      skipped++;
    }
  }

  const totalTimeMs = Date.now() - startTime;

  const response: SyncResponse = {
    success: true,
    processed,
    skipped,
    escalations,
    totalTimeMs,
  };

  return NextResponse.json(response);
}
