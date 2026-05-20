import { z } from 'zod';

export const classificationSchema = z.object({
  category: z.enum(['Bills & Invoices', 'Bank Notifications', 'Promotions', 'Meeting Requests', 'Job Alerts', 'Newsletters', 'OTPs', 'Interview Invites', 'Customer Complaint', 'Bug Report', 'Pull Request', 'Sales Inquiry', 'Feature Request', 'General']),
  priority: z.enum(['High', 'Medium', 'Low']),
  summary: z.string().min(10).max(200),
  sentiment: z.string().min(3).max(30),
  confidence: z.number().min(0).max(1),
  escalation_risk: z.boolean(),
  rationale: z.string().min(10).max(300),
});
