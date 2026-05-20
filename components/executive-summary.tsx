import { ExecutiveSummaryData } from '@/lib/types';
import { ProcessedBadge } from '@/components/processed-badge';
import { Inbox, AlertTriangle, Tag, BarChart2 } from 'lucide-react';

interface ExecutiveSummaryProps {
  data: ExecutiveSummaryData;
}

const stats = (data: ExecutiveSummaryData) => [
  {
    label: 'Total Processed',
    value: data.totalProcessed,
    icon: Inbox,
    accent: 'blue',
    accentClasses: {
      border: 'border-blue-500/30',
      bg: 'from-blue-500/10 to-slate-900/80',
      icon: 'bg-blue-500/15 border-blue-500/30',
      iconColor: 'text-blue-400',
      line: 'via-blue-500',
      value: 'text-blue-300',
    },
  },
  {
    label: 'Escalations',
    value: data.escalationCount,
    icon: AlertTriangle,
    accent: 'red',
    accentClasses: {
      border: data.escalationCount > 0 ? 'border-red-500/30' : 'border-slate-700/50',
      bg: data.escalationCount > 0 ? 'from-red-500/10 to-slate-900/80' : 'from-slate-800/50 to-slate-900/80',
      icon: data.escalationCount > 0 ? 'bg-red-500/15 border-red-500/30' : 'bg-slate-700/30 border-slate-700',
      iconColor: data.escalationCount > 0 ? 'text-red-400' : 'text-slate-500',
      line: data.escalationCount > 0 ? 'via-red-500' : 'via-slate-700',
      value: data.escalationCount > 0 ? 'text-red-300' : 'text-slate-400',
    },
  },
  {
    label: 'Top Category',
    value: data.topCategory,
    icon: Tag,
    accent: 'purple',
    accentClasses: {
      border: 'border-purple-500/30',
      bg: 'from-purple-500/10 to-slate-900/80',
      icon: 'bg-purple-500/15 border-purple-500/30',
      iconColor: 'text-purple-400',
      line: 'via-purple-500',
      value: 'text-purple-300',
    },
  },
  {
    label: 'Avg Confidence',
    value: `${Math.round(data.avgConfidence * 100)}%`,
    icon: BarChart2,
    accent: 'emerald',
    accentClasses: {
      border: 'border-emerald-500/30',
      bg: 'from-emerald-500/10 to-slate-900/80',
      icon: 'bg-emerald-500/15 border-emerald-500/30',
      iconColor: 'text-emerald-400',
      line: 'via-emerald-500',
      value: 'text-emerald-300',
    },
  },
];

export function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats(data).map((stat) => (
          <div
            key={stat.label}
            className={`relative rounded-2xl border ${stat.accentClasses.border} bg-gradient-to-br ${stat.accentClasses.bg} backdrop-blur-sm p-5 overflow-hidden`}
          >
            {/* top accent line */}
            <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent ${stat.accentClasses.line} to-transparent`} />
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${stat.accentClasses.icon}`}>
                <stat.icon className={`h-4 w-4 ${stat.accentClasses.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">{stat.label}</p>
                <p className={`text-2xl font-black leading-none ${stat.accentClasses.value}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {data.totalTimeMs > 0 && (
        <div className="flex justify-end">
          <ProcessedBadge count={data.totalProcessed} timeMs={data.totalTimeMs} />
        </div>
      )}
    </div>
  );
}
