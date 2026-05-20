import { getConfidenceColor } from '@/lib/email-utils';

interface ConfidenceBarProps {
  confidence: number;
  showLabel?: boolean;
}

export function ConfidenceBar({ confidence, showLabel = false }: ConfidenceBarProps) {
  const color = getConfidenceColor(confidence);
  const pct = Math.round(confidence * 100);

  const fillClass =
    color === 'green'
      ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
      : color === 'yellow'
      ? 'bg-gradient-to-r from-amber-600 to-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
      : 'bg-gradient-to-r from-red-700 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${fillClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-bold font-mono w-9 text-right text-slate-300">{pct}%</span>
      )}
    </div>
  );
}
