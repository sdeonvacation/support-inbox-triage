import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { fetchEmails } from '@/lib/gmail';
import { classifyEmail } from '@/lib/ai';
import { SyncResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
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

  let providerToken: string | null = null;
  try {
    const body = await req.json();
    providerToken = body?.provider_token ?? null;
  } catch { /* no body */ }
  if (!providerToken) providerToken = session.provider_token ?? null;

  if (!providerToken) {
    return NextResponse.json({ error: 'No Gmail access token' }, { status: 400 });
  }

  const startTime = Date.now();
  console.log('[sync] provider_token length:', providerToken.length);
  console.log('[sync] provider_token prefix:', providerToken.slice(0, 20));

  // Fetch emails from Gmail
  const gmailMessages = await fetchEmails(providerToken, 20);

  if (gmailMessages.length === 0) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch emails from Gmail. Check your connection and Gmail permissions.',
      errorCode: 'GMAIL_FETCH_FAILED',
      processed: 0,
      skipped: 0,
      escalations: 0,
      totalTimeMs: Date.now() - startTime,
    } satisfies SyncResponse, { status: 200 });
  }

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
        received_at: (() => {
          const d = new Date(msg.receivedAt);
          return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
        })(),
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
        console.log('[sync] upsert error:', JSON.stringify(error), 'subject:', row.subject?.slice(0, 50));
        skipped++;
      }
    } else {
      if (result.status === 'rejected') {
        console.log('[sync] classification rejected:', result.reason);
      } else {
        console.log('[sync] classification returned null');
      }
      skipped++;
    }
  }

  const totalTimeMs = Date.now() - startTime;

  let error: string | undefined;
  let errorCode: SyncResponse['errorCode'];

  if (processed === 0 && gmailMessages.length > 0) {
    error = 'AI classification failed for all emails. Check your AI provider settings.';
    errorCode = 'AI_UNAVAILABLE';
  } else if (skipped > 0 && processed > 0) {
    error = `${skipped} emails could not be classified.`;
    errorCode = 'PARTIAL_FAILURE';
  }

  const response: SyncResponse = {
    success: true,
    processed,
    skipped,
    escalations,
    totalTimeMs,
    ...(error !== undefined && { error }),
    ...(errorCode !== undefined && { errorCode }),
  };

  return NextResponse.json(response);
}
