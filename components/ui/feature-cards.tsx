'use client';

import { motion } from 'framer-motion';
import { Zap, Tag, AlertTriangle } from 'lucide-react';

export function FeatureCards() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {/* Card: Auto-Classify */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="group relative rounded-2xl bg-gradient-to-br from-blue-500/10 to-slate-900/80 border border-blue-500/20 p-7 hover:border-blue-400/40 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60" />
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500/70">01</span>
          </div>
          <h3 className="font-bold text-white text-xl mb-3 leading-tight">Auto-Classify</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Automatically categorizes every email into Billing, Bug Reports, Feature Requests, and more — instantly.
          </p>
          <div className="flex items-center gap-2 pt-4 border-t border-blue-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-xs text-blue-400/70 font-mono tracking-wide">~0.3s per email</span>
          </div>
        </div>
      </motion.div>

      {/* Card: Smart Priority */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="group relative rounded-2xl bg-gradient-to-br from-purple-500/10 to-slate-900/80 border border-purple-500/20 p-7 hover:border-purple-400/40 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60" />
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-purple-500/5 blur-2xl group-hover:bg-purple-500/10 transition-all" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
              <Tag className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500/70">02</span>
          </div>
          <h3 className="font-bold text-white text-xl mb-3 leading-tight">Smart Priority</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Detects urgency and revenue impact to surface High priority emails before they become crises.
          </p>
          <div className="flex items-center gap-2 pt-4 border-t border-purple-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-xs text-purple-400/70 font-mono tracking-wide">Revenue-aware scoring</span>
          </div>
        </div>
      </motion.div>

      {/* Card: Escalation Detection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="group relative rounded-2xl bg-gradient-to-br from-red-500/10 to-slate-900/80 border border-red-500/20 p-7 hover:border-red-400/40 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-red-500/5 blur-2xl group-hover:bg-red-500/10 transition-all" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500/70">03</span>
          </div>
          <h3 className="font-bold text-white text-xl mb-3 leading-tight">Escalation Detection</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Flags threats, outages, and legal risks automatically so your team can respond before it escalates.
          </p>
          <div className="flex items-center gap-2 pt-4 border-t border-red-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-xs text-red-400/70 font-mono tracking-wide">Zero missed escalations</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
