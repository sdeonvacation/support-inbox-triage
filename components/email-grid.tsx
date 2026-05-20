'use client';

import { EmailRow, DashboardFilters } from '@/lib/types';
import { EmailCard } from '@/components/email-card';

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
      : ['Bills & Invoices', 'Bank Notifications', 'Promotions', 'Meeting Requests', 'Job Alerts', 'Newsletters', 'OTPs', 'Interview Invites', 'Customer Complaint', 'Bug Report', 'Pull Request', 'Sales Inquiry', 'Feature Request', 'General'];

  for (const key of order) {
    const group = emails.filter((e) => (groupBy === 'priority' ? e.priority : e.category) === key);
    if (group.length > 0) groups[key] = group;
  }

  const ungrouped = emails.filter((e) => {
    const val = groupBy === 'priority' ? e.priority : e.category;
    return !val || !order.includes(val);
  });
  if (ungrouped.length > 0) groups['Other'] = ungrouped;

  return groups;
}

function getGroupAccent(name: string) {
  switch (name) {
    case 'High':   return { dot: 'bg-red-500',   text: 'text-red-400',   badge: 'bg-red-500/15 text-red-300 border-red-500/30',   line: 'from-red-500/30' };
    case 'Medium': return { dot: 'bg-amber-500',  text: 'text-amber-400', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30', line: 'from-amber-500/30' };
    case 'Low':    return { dot: 'bg-teal-500',   text: 'text-teal-400',  badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',  line: 'from-teal-500/30' };
    default:       return { dot: 'bg-slate-500',  text: 'text-slate-300', badge: 'bg-slate-700/50 text-slate-400 border-slate-700',  line: 'from-slate-500/30' };
  }
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
      {Object.entries(groups).map(([groupName, groupEmails]) => {
        const accent = getGroupAccent(groupName);
        return (
          <div key={groupName}>
            {/* Group header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${accent.dot} shadow-lg`} />
              <h2 className={`text-sm font-bold uppercase tracking-[0.15em] ${accent.text}`}>{groupName}</h2>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold ${accent.badge}`}>
                {groupEmails.length}
              </span>
              <div className={`flex-1 h-px bg-gradient-to-r ${accent.line} to-transparent`} />
            </div>
            <div className="space-y-3">
              {groupEmails.map((email) => {
                const delay = (globalIndex++ % 6) * 0.05;
                return <EmailCard key={email.id} email={email} animationDelay={delay} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
