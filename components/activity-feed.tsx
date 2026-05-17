'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ActivityFeedItem } from '@/lib/types';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ActivityFeedProps {
  items: ActivityFeedItem[];
  isAnimating?: boolean;
}

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'text-emerald-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function ActivityFeed({ items, isAnimating = false }: ActivityFeedProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
        <span>Activity Feed</span>
        {isAnimating && (
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        )}
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence initial={false}>
          {items.map((item, i) => {
            const Icon = iconMap[item.type];
            const color = colorMap[item.type];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-start gap-2 text-xs"
              >
                <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 leading-relaxed">{item.message}</p>
                  <p className="text-slate-600 mt-0.5">{formatTime(item.timestamp)}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {items.length === 0 && (
          <p className="text-xs text-slate-600 text-center py-4">No activity yet</p>
        )}
      </div>
    </div>
  );
}
