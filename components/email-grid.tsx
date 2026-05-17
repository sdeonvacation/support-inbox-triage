'use client';

import { EmailRow, DashboardFilters } from '@/lib/types';
import { EmailCard } from '@/components/email-card';
import { Badge } from '@/components/ui/badge';

interface EmailGridProps {
  emails: EmailRow[];
  filters: DashboardFilters;
}

function filterEmails(emails: EmailRow[], filters: DashboardFilters): EmailRow[] {
  return emails.filter((e) => {
    if (filters.category !== 'All' && e.category !== filters.category) return false;
    if (filters.priority !== 'All' && e.priority !== filters.priority) return false;
    return true;
  });
}

function groupEmails(emails: EmailRow[], groupBy: 'priority' | 'category'): Record<string, EmailRow[]> {
  const groups: Record<string, EmailRow[]> = {};
  const order =
    groupBy === 'priority'
      ? ['High', 'Medium', 'Low']
      : ['Bug Report', 'Customer Complaint', 'Billing', 'Sales Inquiry', 'Feature Request', 'General'];

  for (const key of order) {
    const group = emails.filter((e) => (groupBy === 'priority' ? e.priority : e.category) === key);
    if (group.length > 0) groups[key] = group;
  }

  // Catch any uncategorized
  const ungrouped = emails.filter((e) => {
    const val = groupBy === 'priority' ? e.priority : e.category;
    return !val || !order.includes(val);
  });
  if (ungrouped.length > 0) groups['Other'] = ungrouped;

  return groups;
}

export function EmailGrid({ emails, filters }: EmailGridProps) {
  const filtered = filterEmails(emails, filters);
  const groups = groupEmails(filtered, filters.groupBy);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <p className="text-lg">No emails match the current filters.</p>
      </div>
    );
  }

  let globalIndex = 0;

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([groupName, groupEmails]) => (
        <div key={groupName}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-slate-300">{groupName}</h2>
            <Badge variant="secondary" className="text-xs">
              {groupEmails.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {groupEmails.map((email) => {
              const delay = (globalIndex++ % 6) * 0.05;
              return (
                <EmailCard key={email.id} email={email} animationDelay={delay} />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
