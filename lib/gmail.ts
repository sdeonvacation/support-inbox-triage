import { GmailMessage } from '@/lib/types';

interface GmailMessageHeader {
  name: string;
  value: string;
}

interface GmailMessagePart {
  mimeType: string;
  body?: {
    data?: string;
    size?: number;
  };
  parts?: GmailMessagePart[];
}

interface GmailMessagePayload {
  headers?: GmailMessageHeader[];
  mimeType?: string;
  body?: {
    data?: string;
    size?: number;
  };
  parts?: GmailMessagePart[];
}

interface GmailApiMessage {
  id: string;
  threadId: string;
  payload?: GmailMessagePayload;
}

export function parseMessageBody(payload: unknown): string {
  try {
    const p = payload as GmailMessagePayload;

    // Try direct body first
    if (p?.body?.data) {
      const decoded = Buffer.from(p.body.data, 'base64').toString('utf-8');
      return decoded.slice(0, 2000);
    }

    // Recursively search parts
    if (p?.parts && Array.isArray(p.parts)) {
      // Prefer text/plain
      for (const part of p.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          const decoded = Buffer.from(part.body.data, 'base64').toString('utf-8');
          return decoded.slice(0, 2000);
        }
      }
      // Fall back to text/html
      for (const part of p.parts) {
        if (part.mimeType === 'text/html' && part.body?.data) {
          const decoded = Buffer.from(part.body.data, 'base64').toString('utf-8');
          const stripped = decoded.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          return stripped.slice(0, 2000);
        }
      }
      // Recurse into nested parts
      for (const part of p.parts) {
        if (part.parts) {
          const result = parseMessageBody(part);
          if (result) return result;
        }
      }
    }

    return '';
  } catch {
    return '';
  }
}

export async function fetchEmails(
  accessToken: string,
  maxResults = 20
): Promise<GmailMessage[]> {
  const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=in:inbox`;

  const listController = new AbortController();
  const listTimeout = setTimeout(() => listController.abort(), 8000);
  const listRes = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: listController.signal,
  });
  clearTimeout(listTimeout);

  if (!listRes.ok) {
    console.log('[gmail] list failed:', listRes.status, await listRes.text());
    return [];
  }

  const listData = await listRes.json();
  console.log('[gmail] messages found:', listData.messages?.length ?? 0);
  const messages: { id: string }[] = listData.messages || [];

  const results = await Promise.allSettled(
    messages.map(async (msg) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
          { headers: { Authorization: `Bearer ${accessToken}` }, signal: controller.signal }
        );
        clearTimeout(timeout);
        if (!detailRes.ok) return null;

        const detail: GmailApiMessage = await detailRes.json();
        const headers = detail.payload?.headers || [];

        const getHeader = (name: string) =>
          headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

        const subject = getHeader('Subject') || '(no subject)';
        const sender = getHeader('From') || 'unknown';
        const date = getHeader('Date') || new Date().toISOString();
        const body = parseMessageBody(detail.payload);

        return {
          id: detail.id,
          threadId: detail.threadId,
          subject,
          sender,
          body,
          receivedAt: date,
        } as GmailMessage;
      } catch {
        return null;
      }
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<GmailMessage> => r.status === 'fulfilled' && r.value !== null)
    .map((r) => r.value);
}
