'use client';

import { motion } from 'framer-motion';

interface EscalationBannerProps {
  escalation_risk: boolean;
}

export function EscalationBanner({ escalation_risk }: EscalationBannerProps) {
  if (!escalation_risk) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-1.5 mb-2">
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-red-500"
        />
        <span className="text-xs font-semibold text-red-400">⚠ Escalation Risk Detected</span>
      </div>
    </motion.div>
  );
}
