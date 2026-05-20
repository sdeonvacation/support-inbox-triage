'use client';

import { DashboardFilters } from '@/lib/types';

interface FilterBarProps {
  filters: DashboardFilters;
  onChange: (f: DashboardFilters) => void;
}

const CATEGORIES = ['All', 'Bills & Invoices', 'Bank Notifications', 'Promotions', 'Meeting Requests', 'Job Alerts', 'Newsletters', 'OTPs', 'Interview Invites', 'Customer Complaint', 'Bug Report', 'Pull Request', 'Sales Inquiry', 'Feature Request', 'General'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const selectClass = "bg-slate-900/80 border border-slate-700/60 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500/60 focus:border-purple-500/40 backdrop-blur-sm transition-colors hover:border-slate-600 appearance-none pr-8 cursor-pointer";

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm">
      {/* Category */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Category</label>
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className={selectClass}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▾</div>
        </div>
      </div>

      {/* Priority */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Priority</label>
        <div className="relative">
          <select
            value={filters.priority}
            onChange={(e) => onChange({ ...filters, priority: e.target.value })}
            className={selectClass}
          >
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▾</div>
        </div>
      </div>

      {/* Group by */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Group by</label>
        <div className="flex rounded-lg border border-slate-700/60 overflow-hidden bg-slate-900/60">
          {(['priority', 'category'] as const).map((g) => (
            <button
              key={g}
              onClick={() => onChange({ ...filters, groupBy: g })}
              className={`px-3 py-2 text-xs font-semibold capitalize transition-all duration-200 ${
                filters.groupBy === g
                  ? 'bg-purple-600/80 text-white shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
