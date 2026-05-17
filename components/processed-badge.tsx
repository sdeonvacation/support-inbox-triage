import { Badge } from '@/components/ui/badge';
import { formatProcessingTime } from '@/lib/email-utils';

interface ProcessedBadgeProps {
  count: number;
  timeMs: number;
}

export function ProcessedBadge({ count, timeMs }: ProcessedBadgeProps) {
  return (
    <Badge variant="secondary" className="font-mono text-xs">
      {count} emails processed in {formatProcessingTime(timeMs)}
    </Badge>
  );
}
