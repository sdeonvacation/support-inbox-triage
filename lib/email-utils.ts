import { EmailRow, ExecutiveSummaryData } from '@/lib/types';

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'High':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'Medium':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'Low':
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    default:
      return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'Billing':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'Bug Report':
      return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    case 'Feature Request':
      return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    case 'Customer Complaint':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'Sales Inquiry':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'General':
      return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    default:
      return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
}

export function getConfidenceColor(confidence: number): 'green' | 'yellow' | 'red' {
  if (confidence > 0.8) return 'green';
  if (confidence >= 0.5) return 'yellow';
  return 'red';
}

export function formatProcessingTime(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`;
}

export function computeExecutiveSummary(emails: EmailRow[]): ExecutiveSummaryData {
  const totalProcessed = emails.length;
  const escalationCount = emails.filter((e) => e.escalation_risk).length;

  // Top category by frequency
  const categoryCounts: Record<string, number> = {};
  for (const email of emails) {
    if (email.category) {
      categoryCounts[email.category] = (categoryCounts[email.category] || 0) + 1;
    }
  }
  const topCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Average confidence
  const confidences = emails.filter((e) => e.confidence !== null).map((e) => e.confidence as number);
  const avgConfidence =
    confidences.length > 0
      ? confidences.reduce((sum, c) => sum + c, 0) / confidences.length
      : 0;

  // Avg sentiment — derive from sentiments
  const sentiments = emails.filter((e) => e.sentiment).map((e) => e.sentiment as string);
  const negativeKeywords = ['negative', 'angry', 'frustrated', 'upset', 'critical'];
  const positiveKeywords = ['positive', 'happy', 'satisfied', 'pleased', 'grateful'];
  let negCount = 0;
  let posCount = 0;
  for (const s of sentiments) {
    const lower = s.toLowerCase();
    if (negativeKeywords.some((k) => lower.includes(k))) negCount++;
    else if (positiveKeywords.some((k) => lower.includes(k))) posCount++;
  }
  let avgSentiment = 'Neutral';
  if (negCount > posCount && negCount > sentiments.length * 0.3) avgSentiment = 'Negative';
  else if (posCount > negCount && posCount > sentiments.length * 0.3) avgSentiment = 'Positive';

  const totalTimeMs = emails.reduce((sum, e) => sum + (e.processing_time_ms || 0), 0);

  return {
    totalProcessed,
    escalationCount,
    topCategory,
    avgSentiment,
    avgConfidence,
    totalTimeMs,
  };
}
