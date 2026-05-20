'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { demoEmails } from '@/lib/demo-data';
import { computeExecutiveSummary } from '@/lib/email-utils';
import { ExecutiveSummary } from '@/components/executive-summary';
import { EmailGrid } from '@/components/email-grid';
import { ActivityFeed } from '@/components/activity-feed';
import { FilterBar } from '@/components/filter-bar';
import { AuroraButton } from '@/components/ui/aurora-button';
import { AuroraBorealis } from '@/components/ui/aurora-borealis';
import { Badge } from '@/components/ui/badge';
import { DashboardFilters, ActivityFeedItem } from '@/lib/types';

const summaryData = computeExecutiveSummary(demoEmails);

function buildActivityItems(): ActivityFeedItem[] {
  const items: ActivityFeedItem[] = demoEmails.map((email, i) => ({
    id: email.id,
    message: `Classified "${email.subject.slice(0, 40)}${email.subject.length > 40 ? '...' : ''}" as ${email.category} · ${email.priority}`,
    timestamp: Date.now() - (demoEmails.length - i) * 4000,
    type: email.escalation_risk ? 'warning' : 'success',
  }));

  items.push({
    id: 'summary',
    message: `Processed ${demoEmails.length} emails in ${(summaryData.totalTimeMs / 1000).toFixed(1)}s`,
    timestamp: Date.now(),
    type: 'info',
  });

  return items;
}

export default function DemoPage() {
  const [filters, setFilters] = useState<DashboardFilters>({
    category: 'All',
    priority: 'All',
    groupBy: 'priority',
  });
  const [activityItems, setActivityItems] = useState<ActivityFeedItem[]>([]);

  useEffect(() => {
    // Animate activity feed items in on mount
    const allItems = buildActivityItems();
    let i = 0;
    const interval = setInterval(() => {
      if (i < allItems.length) {
        if (allItems[i]) setActivityItems((prev) => [...prev, allItems[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen">
      <AuroraBorealis />
      <div className="relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-black/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Triagent
            </Link>
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-xs">
              Demo Mode
            </Badge>
            <span className="hidden sm:block text-xs text-slate-600 font-mono">· {demoEmails.length} emails classified</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/"><AuroraButton className="text-sm font-semibold px-5 py-2">Try with your own inbox →</AuroraButton></Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Executive Summary */}
        <ExecutiveSummary data={summaryData} />

        {/* Filter Bar */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Grid — wider */}
          <div className="lg:col-span-2">
            <EmailGrid emails={demoEmails} filters={filters} />
          </div>

          {/* Activity Feed sidebar */}
          <div className="lg:col-span-1">
            <ActivityFeed items={activityItems} isAnimating={activityItems.length < demoEmails.length + 1} />
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
