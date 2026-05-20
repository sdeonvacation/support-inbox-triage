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
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch { return dateStr; }
}

function getPriorityAccent(priority: string | null) {
  switch (priority) {
    case 'High':   return { border: 'border-l-red-500',    bg: 'hover:bg-red-500/5',    glow: 'hover:shadow-red-500/10' };
    case 'Medium': return { border: 'border-l-amber-500',  bg: 'hover:bg-amber-500/5',  glow: 'hover:shadow-amber-500/10' };
    case 'Low':    return { border: 'border-l-teal-500',   bg: 'hover:bg-teal-500/5',   glow: 'hover:shadow-teal-500/10' };
    default:       return { border: 'border-l-slate-700',  bg: '',                       glow: '' };
  }
}

export function EmailCard({ email, animationDelay = 0 }: EmailCardProps) {
  const [expanded, setExpanded] = useState(false);
  const accent = getPriorityAccent(email.priority);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: animationDelay }}
      whileHover={{ y: -1 }}
      className={`relative bg-slate-900/60 border border-slate-800/80 border-l-4 ${accent.border} rounded-xl p-4 cursor-pointer ${accent.bg} hover:border-slate-700 transition-all duration-200 shadow-lg ${accent.glow} hover:shadow-xl backdrop-blur-sm`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-white truncate leading-snug">{email.subject}</h3>
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
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {email.priority && (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPriorityColor(email.priority)}`}>
            {email.priority}
          </span>
        )}
        {email.category && (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getCategoryColor(email.category)}`}>
            {email.category}
          </span>
        )}
        {email.sentiment && (
          <Badge variant="outline" className="text-xs border-slate-700/60 text-slate-500 rounded-full">
            {email.sentiment}
          </Badge>
        )}
      </div>

      {/* Confidence bar */}
      {email.confidence !== null && (
        <div className="mb-3">
          <ConfidenceBar confidence={email.confidence} showLabel />
        </div>
      )}

      {/* Summary */}
      {email.summary && (
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{email.summary}</p>
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
              <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Email Body</p>
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
