import { ClassificationResult } from '@/lib/types';
import { classificationSchema } from '@/lib/schemas';
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/prompts';

type AIProvider = 'openai' | 'anthropic';

function detectProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  if (provider === 'anthropic') return 'anthropic';
  return 'openai';
}

async function callOpenAI(baseUrl: string, apiKey: string, model: string, subject: string, sender: string, body: string, signal: AbortSignal): Promise<string | null> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserMessage(subject, sender, body) },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300,
    }),
    signal,
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? null;
}

async function callAnthropic(baseUrl: string, apiKey: string, model: string, subject: string, sender: string, body: string, signal: AbortSignal): Promise<string | null> {
  const response = await fetch(`${baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: buildUserMessage(subject, sender, body) },
      ],
      max_tokens: 1024,
    }),
    signal,
  });
  if (!response.ok) {
    console.log('[ai] anthropic http error:', response.status, await response.text());
    return null;
  }
  const data = await response.json();
  console.log('[ai] anthropic raw response keys:', Object.keys(data), 'content:', JSON.stringify(data).slice(0, 300));
  // Find the text content block — skip thinking/reasoning blocks
  const textBlock = Array.isArray(data?.content)
    ? data.content.find((b: { type: string }) => b.type === 'text')
    : null;
  return textBlock?.text ?? null;
}

export async function classifyEmail(
  subject: string,
  sender: string,
  body: string
): Promise<ClassificationResult | null> {
  const provider = detectProvider();
  const baseUrl = process.env.AI_BASE_URL || (provider === 'anthropic' ? 'https://api.anthropic.com' : 'https://api.openai.com/v1');
  const apiKey = provider === 'anthropic'
    ? process.env.ANTHROPIC_API_KEY
    : process.env.OPENAI_API_KEY;
  const model = process.env.AI_MODEL || (provider === 'anthropic' ? 'claude-3-5-haiku-20241022' : 'gpt-4o-mini');

  if (!apiKey) {
    console.log('[ai] no apiKey — AI_PROVIDER:', process.env.AI_PROVIDER, 'ANTHROPIC_API_KEY set:', !!process.env.ANTHROPIC_API_KEY, 'OPENAI_API_KEY set:', !!process.env.OPENAI_API_KEY);
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const resolvedProvider = detectProvider();
    console.log('[ai] calling', resolvedProvider, 'model:', model, 'url:', baseUrl);
    const content = resolvedProvider === 'anthropic'
      ? await callAnthropic(baseUrl, apiKey, model, subject, sender, body, controller.signal)
      : await callOpenAI(baseUrl, apiKey, model, subject, sender, body, controller.signal);

    if (!content) {
      console.log('[ai] no content returned from API');
      return null;
    }

    const cleaned = content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/, '').trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Model returned prose — attempt to extract first {...} substring
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start !== -1 && end > start) {
        parsed = JSON.parse(cleaned.slice(start, end + 1));
      } else {
        console.log('[ai] no JSON object found in response');
        return null;
      }
    }
    const validated = classificationSchema.safeParse(parsed);
    if (!validated.success) {
      console.log('[ai] zod validation failed:', JSON.stringify(validated.error.issues));
      return null;
    }

    return validated.data as ClassificationResult;
  } catch (e) {
    console.log('[ai] error:', e instanceof Error ? e.message : String(e));
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
