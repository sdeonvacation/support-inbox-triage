export interface EmailInput {
  subject: string;
  sender: string;
  body: string;
  receivedAt: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  sender: string;
  body: string;
  receivedAt: string;
}

export interface ClassificationResult {
  category: 'Bills & Invoices' | 'Bank Notifications' | 'Promotions' | 'Meeting Requests' | 'Job Alerts' | 'Newsletters' | 'OTPs' | 'Interview Invites' | 'Customer Complaint' | 'Bug Report' | 'Pull Request' | 'Sales Inquiry' | 'Feature Request' | 'General';
  priority: 'High' | 'Medium' | 'Low';
  summary: string;
  sentiment: string;
  confidence: number;
  escalation_risk: boolean;
  rationale: string;
}

export interface SyncResponse {
  success: boolean;
  processed: number;
  skipped: number;
  escalations: number;
  totalTimeMs: number;
  error?: string;
  errorCode?: 'GMAIL_FETCH_FAILED' | 'AI_UNAVAILABLE' | 'PARTIAL_FAILURE';
}

export interface EmailRow {
  id: string;
  user_id: string;
  gmail_message_id: string;
  sender: string;
  subject: string;
  body: string | null;
  received_at: string | null;
  category: string | null;
  priority: string | null;
  summary: string | null;
  sentiment: string | null;
  confidence: number | null;
  escalation_risk: boolean;
  rationale: string | null;
  processing_time_ms: number | null;
  created_at: string;
}

export type GroupBy = 'priority' | 'category';

export interface DashboardFilters {
  category: string;
  priority: string;
  groupBy: GroupBy;
}

export interface ExecutiveSummaryData {
  totalProcessed: number;
  escalationCount: number;
  topCategory: string;
  avgSentiment: string;
  avgConfidence: number;
  totalTimeMs: number;
}

export interface ActivityFeedItem {
  id: string;
  message: string;
  timestamp: number;
  type: 'success' | 'warning' | 'info';
}

export interface SyncState {
  status: 'idle' | 'syncing' | 'complete' | 'error';
  steps: { label: string; status: 'pending' | 'active' | 'complete' | 'error' }[];
}
