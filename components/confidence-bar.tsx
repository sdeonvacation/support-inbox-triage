import { getConfidenceColor } from '@/lib/email-utils';

interface ConfidenceBarProps {
  confidence: number;
  showLabel?: boolean;
}

export function ConfidenceBar({ confidence, showLabel = false }: ConfidenceBarProps) {
  const color = getConfidenceColor(confidence);
  const pct = Math.round(confidence * 100);

  const colorClass =
    color === 'green'
      ? 'bg-emerald-500'
      : color === 'yellow'
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-slate-400 font-mono w-8 text-right">{pct}%</span>
      )}
    </div>
  );
}
