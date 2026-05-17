import { Card, CardContent } from '@/components/ui/card';
import { ExecutiveSummaryData } from '@/lib/types';
import { ProcessedBadge } from '@/components/processed-badge';
import { Inbox, AlertTriangle, Tag, BarChart2 } from 'lucide-react';

interface ExecutiveSummaryProps {
  data: ExecutiveSummaryData;
}

export function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  const stats = [
    {
      label: 'Total Processed',
      value: data.totalProcessed,
      icon: Inbox,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Escalations',
      value: data.escalationCount,
      icon: AlertTriangle,
      color: data.escalationCount > 0 ? 'text-red-400' : 'text-slate-400',
      bg: data.escalationCount > 0 ? 'bg-red-400/10' : 'bg-slate-400/10',
    },
    {
      label: 'Top Category',
      value: data.topCategory,
      icon: Tag,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
    {
      label: 'Avg Confidence',
      value: `${Math.round(data.avgConfidence * 100)}%`,
      icon: BarChart2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
