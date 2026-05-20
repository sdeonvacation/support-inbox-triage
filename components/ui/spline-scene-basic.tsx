'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { motion } from 'framer-motion'
import { ButtonColorful } from '@/components/ui/button-colorful'
import { GlowButton } from '@/components/ui/glow-button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[calc(100vh-64px)] bg-black/[0.96] relative overflow-hidden rounded-none border-0">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 px-6 md:px-16 relative z-10 flex flex-col justify-center pt-12 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full px-4 py-1.5 text-sm text-purple-200 mb-6 shadow-sm shadow-purple-500/20"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Powered by GPT-4o-mini
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
            >
              <span className="bg-gradient-to-br from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                AI-Powered Support{' '}
              </span>
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                Inbox Triage
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-base md:text-lg text-slate-300 mb-8 md:mb-10 max-w-lg leading-relaxed"
            >
              Classify, prioritize, and detect escalations — automatically.
              Connect your Gmail and let AI handle the triage in seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/demo">
                <ButtonColorful label="Try Demo" className="h-11 px-8 text-sm font-semibold" />
              </Link>
              <GlowButton
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
              </GlowButton>
            </motion.div>
          </motion.div>
        </div>

        {/* Right content */}
        <div className="hidden md:flex flex-1 relative">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}
