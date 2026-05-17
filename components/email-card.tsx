'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EmailRow } from '@/lib/types';
import { getPriorityColor, getCategoryColor, formatProcessingTime } from '@/lib/email-utils';
import { EscalationBanner } from '@/components/escalation-banner';
import { ConfidenceBar } from '@/components/confidence-bar';
import { RationaleSection } from '@/components/rationale-section';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronDown } from 'lucide-react';

interface EmailCardProps {
  email: EmailRow;
  animationDelay?: number;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function EmailCard({ email, animationDelay = 0 }: EmailCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: animationDelay }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
      className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 cursor-pointer transition-colors hover:border-slate-700"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-white truncate">{email.subject}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{email.sender}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-600 shrink-0">
          <Clock className="h-3 w-3" />
          {formatDate(email.received_at)}
        </div>
      </div>

      {/* Escalation banner */}
      <EscalationBanner escalation_risk={email.escalation_risk} />

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {email.priority && (
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getPriorityColor(email.priority)}`}>
            {email.priority}
          </span>
        )}
        {email.category && (
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getCategoryColor(email.category)}`}>
            {email.category}
          </span>
        )}
        {email.sentiment && (
          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
            {email.sentiment}
          </Badge>
        )}
      </div>

      {/* Confidence bar */}
      {email.confidence !== null && (
        <div className="mb-2">
          <ConfidenceBar confidence={email.confidence} showLabel />
        </div>
      )}

      {/* Summary */}
      {email.summary && (
        <p className="text-xs text-slate-400 line-clamp-2">{email.summary}</p>
      )}

      {/* Expand indicator */}
      <div className="flex justify-center mt-2">
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-slate-600" />
        </motion.div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="overflow-hidden border-t border-slate-800 mt-3 pt-3 space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          {email.body && (
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Email Body</p>
              <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                {email.body}
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-slate-500">
            {email.processing_time_ms !== null && (
              <span>⚡ Processed in {formatProcessingTime(email.processing_time_ms)}</span>
            )}
          </div>

          {email.rationale && <RationaleSection rationale={email.rationale} />}
        </motion.div>
      )}
    </motion.div>
  );
}
