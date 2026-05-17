'use client';

import { motion } from 'framer-motion';

export function ArchDiagram() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {/* Gmail Inbox Box */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm p-6 w-44 text-center shadow-lg shadow-blue-500/10"
        >
          <div className="text-3xl mb-2">📧</div>
          <div className="text-sm font-semibold text-blue-300">Gmail Inbox</div>
          <div className="text-xs text-slate-400 mt-1">20 emails</div>
        </motion.div>

        {/* Arrow 1 */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center"
        >
          <div className="relative w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500">
            <motion.div
              animate={{ x: [0, 48, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-purple-500" />
          </div>
        </motion.div>

        {/* AI Classification Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative rounded-xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm p-6 w-44 text-center shadow-lg shadow-purple-500/10"
        >
          <div className="text-3xl mb-2">🤖</div>
          <div className="text-sm font-semibold text-purple-300">AI Classification</div>
          <div className="text-xs text-slate-400 mt-1">GPT-4o-mini</div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-400"
          />
        </motion.div>

        {/* Arrow 2 */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="flex items-center"
        >
          <div className="relative w-16 h-0.5 bg-gradient-to-r from-purple-500 to-emerald-500">
            <motion.div
              animate={{ x: [0, 48, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.5 }}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-emerald-500" />
          </div>
        </motion.div>

        {/* Dashboard Box */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="relative rounded-xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm p-6 w-44 text-center shadow-lg shadow-emerald-500/10"
        >
          <div className="text-3xl mb-2">📊</div>
          <div className="text-sm font-semibold text-emerald-300">Prioritized Dashboard</div>
          <div className="text-xs text-slate-400 mt-1">Triaged & sorted</div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-sm text-slate-400 font-mono bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700"
      >
        ⚡ 20 emails processed in 8.2s
      </motion.p>
    </div>
  );
}
