'use client';

import { motion } from 'framer-motion';
import { Mail, Cpu, LayoutDashboard } from 'lucide-react';

export function ArchDiagram() {
  return (
    <div className="flex flex-col items-center gap-10 py-8 w-full">
      {/* Pipeline row */}
      <div className="flex flex-col md:flex-row items-center gap-0 justify-center w-full md:max-w-3xl">

        {/* Node 1: Gmail Inbox */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-3 w-full max-w-[280px] md:w-44"
        >
          <div className="relative w-full rounded-2xl border border-blue-500/40 bg-gradient-to-br from-blue-500/20 to-blue-900/10 backdrop-blur-md p-6 text-center shadow-xl shadow-blue-500/10 group hover:border-blue-400/60 transition-all duration-300">
            <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full" />
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/25 transition-colors">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-sm font-bold text-blue-300 tracking-wide">Gmail Inbox</p>
            <p className="text-xs text-slate-500 mt-1">20 emails</p>
          </div>
          <p className="text-xs text-slate-600 uppercase tracking-widest">Source</p>
        </motion.div>

        {/* Connector 1 */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.4 }}
  className="flex items-center justify-center my-2 md:my-0 md:px-2 md:mb-6"
>
  {/* Vertical connector (mobile) */}
  <div className="flex md:hidden flex-col items-center">
    <div className="relative h-10 w-[2px] bg-gradient-to-b from-blue-500 to-purple-500">
      <motion.div
        animate={{ y: [0, 28, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-lg shadow-purple-400/60"
      />
      <svg className="absolute bottom-[-6px] left-1/2 -translate-x-1/2" width="12" height="8" viewBox="0 0 12 8" fill="none">
        <path d="M0 0L6 8L12 0H0Z" fill="#a855f7" />
      </svg>
    </div>
  </div>
  {/* Horizontal connector (desktop) */}
  <div className="hidden md:block relative w-14 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500">
    <motion.div
      animate={{ x: [0, 44, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
      className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-lg shadow-purple-400/60"
    />
    <svg className="absolute right-[-6px] top-1/2 -translate-y-1/2" width="8" height="12" viewBox="0 0 8 12" fill="none">
      <path d="M0 0L8 6L0 12V0Z" fill="#a855f7" />
    </svg>
  </div>
</motion.div>

        {/* Node 2: AI Classification */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-3 w-full max-w-[280px] md:w-44"
        >
          <div className="relative w-full rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-500/20 to-violet-900/10 backdrop-blur-md p-6 text-center shadow-xl shadow-purple-500/10 group hover:border-purple-400/60 transition-all duration-300">
            <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full" />
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-purple-400 shadow-lg shadow-purple-400/60"
            />
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/25 transition-colors">
              <Cpu className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-bold text-purple-300 tracking-wide">AI Classification</p>
            <p className="text-xs text-slate-500 mt-1">GPT-4o-mini</p>
          </div>
          <p className="text-xs text-slate-600 uppercase tracking-widest">Processing</p>
        </motion.div>

        {/* Connector 2 */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.8 }}
  className="flex items-center justify-center my-2 md:my-0 md:px-2 md:mb-6"
>
  {/* Vertical connector (mobile) */}
  <div className="flex md:hidden flex-col items-center">
    <div className="relative h-10 w-[2px] bg-gradient-to-b from-purple-500 to-emerald-500">
      <motion.div
        animate={{ y: [0, 28, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 0.6 }}
        className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60"
      />
      <svg className="absolute bottom-[-6px] left-1/2 -translate-x-1/2" width="12" height="8" viewBox="0 0 12 8" fill="none">
        <path d="M0 0L6 8L12 0H0Z" fill="#34d399" />
      </svg>
    </div>
  </div>
  {/* Horizontal connector (desktop) */}
  <div className="hidden md:block relative w-14 h-[2px] bg-gradient-to-r from-purple-500 to-emerald-500">
    <motion.div
      animate={{ x: [0, 44, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 0.6 }}
      className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60"
    />
    <svg className="absolute right-[-6px] top-1/2 -translate-y-1/2" width="8" height="12" viewBox="0 0 8 12" fill="none">
      <path d="M0 0L8 6L0 12V0Z" fill="#34d399" />
    </svg>
  </div>
</motion.div>

        {/* Node 3: Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex flex-col items-center gap-3 w-full max-w-[280px] md:w-44"
        >
          <div className="relative w-full rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 to-teal-900/10 backdrop-blur-md p-6 text-center shadow-xl shadow-emerald-500/10 group hover:border-emerald-400/60 transition-all duration-300">
            <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full" />
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/25 transition-colors">
              <LayoutDashboard className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-emerald-300 tracking-wide">Prioritized Dashboard</p>
            <p className="text-xs text-slate-500 mt-1">Triaged & sorted</p>
          </div>
          <p className="text-xs text-slate-600 uppercase tracking-widest">Output</p>
        </motion.div>

      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex items-center gap-2 bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm px-4 py-2.5 rounded-full max-w-[90vw]"
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
        />
        <span className="text-xs sm:text-sm text-slate-300 font-mono">⚡ 20 emails processed in 8.2s</span>
      </motion.div>
    </div>
  );
}
