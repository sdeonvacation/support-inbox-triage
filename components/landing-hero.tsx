'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export function LandingHero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-3xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Powered by GPT-4o-mini
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-6"
        >
          AI-Powered Support Inbox Triage
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
        >
          Classify, prioritize, and detect escalations — automatically.
          Connect your Gmail and let AI handle the triage in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8">
            <Link href="/demo">Try Demo</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-slate-600 hover:border-slate-400 font-semibold px-8"
            onClick={() => {
              const supabase = createClient();
              supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  scopes: 'https://www.googleapis.com/auth/gmail.readonly',
                  redirectTo: window.location.origin + '/auth/callback',
                  queryParams: { access_type: 'offline', prompt: 'consent' },
                },
              });
            }}
          >
            Connect Gmail
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
