import { z } from 'zod';

export const classificationSchema = z.object({
  category: z.enum(['Billing', 'Bug Report', 'Feature Request', 'Customer Complaint', 'Sales Inquiry', 'General']),
  priority: z.enum(['High', 'Medium', 'Low']),
  summary: z.string().min(10).max(200),
  sentiment: z.string().min(3).max(30),
  confidence: z.number().min(0).max(1),
  escalation_risk: z.boolean(),
  rationale: z.string().min(10).max(300),
});
