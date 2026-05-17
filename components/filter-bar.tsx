'use client';

import { DashboardFilters } from '@/lib/types';

interface FilterBarProps {
  filters: DashboardFilters;
  onChange: (f: DashboardFilters) => void;
}

const CATEGORIES = ['All', 'Billing', 'Bug Report', 'Feature Request', 'Customer Complaint', 'Sales Inquiry', 'General'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 font-medium">Category</label>
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 font-medium">Priority</label>
        <select
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 font-medium">Group by</label>
        <div className="flex rounded-md border border-slate-700 overflow-hidden">
          {(['priority', 'category'] as const).map((g) => (
            <button
              key={g}
              onClick={() => onChange({ ...filters, groupBy: g })}
              className={`px-3 py-1.5 text-sm capitalize transition-colors ${
                filters.groupBy === g
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
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
