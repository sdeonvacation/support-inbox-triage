import { ClassificationResult } from '@/lib/types';
import { classificationSchema } from '@/lib/schemas';
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/prompts';

export async function classifyEmail(
  subject: string,
  sender: string,
  body: string
): Promise<ClassificationResult | null> {
  const baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
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
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    const validated = classificationSchema.safeParse(parsed);
    if (!validated.success) return null;

    return validated.data as ClassificationResult;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
