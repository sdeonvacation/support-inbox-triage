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
      className="overflow-hidden mb-2"
    >
      <div className="relative flex items-center gap-2 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2 overflow-hidden">
        {/* subtle glow behind */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
        <motion.div
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/60 shrink-0"
        />
        <span className="text-xs font-bold text-red-300 tracking-wide relative">⚠ Escalation Risk Detected</span>
      </div>
    </motion.div>
  );
}
