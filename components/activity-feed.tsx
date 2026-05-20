'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ActivityFeedItem } from '@/lib/types';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ActivityFeedProps {
  items: ActivityFeedItem[];
  isAnimating?: boolean;
}

const iconMap = { success: CheckCircle, warning: AlertTriangle, info: Info };
const colorMap = { success: 'text-emerald-400', warning: 'text-yellow-400', info: 'text-blue-400' };
const bgMap    = { success: 'bg-emerald-400/5', warning: 'bg-yellow-400/5', info: 'bg-blue-400/5' };

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function ActivityFeed({ items, isAnimating = false }: ActivityFeedProps) {
  return (
    <div className="relative rounded-2xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-sm overflow-hidden">
      {/* top accent */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-xs font-semibold text-slate-400 ml-2 font-mono">activity.log</span>
        </div>
        {isAnimating && (
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-purple-400"
            />
            <span className="text-xs text-purple-400/70 font-mono">live</span>
          </div>
        )}
      </div>

      {/* Feed items */}
      <div className="space-y-0 max-h-[480px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {items.filter(Boolean).map((item) => {
            const Icon = iconMap[item.type];
            const color = colorMap[item.type];
            const bg = bgMap[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-start gap-3 px-4 py-3 border-b border-slate-800/40 ${bg} hover:bg-white/[0.02] transition-colors`}
              >
                <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">{item.message}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5 font-mono">{formatTime(item.timestamp)}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {items.length === 0 && (
          <p className="text-xs text-slate-600 text-center py-8 font-mono">awaiting events...</p>
        )}
      </div>
    </div>
  );
}
