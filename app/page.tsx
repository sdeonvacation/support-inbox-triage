import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { LandingHero } from '@/components/landing-hero';
import { ArchDiagram } from '@/components/arch-diagram';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@/components/sign-in-button';
import { Zap, Tag, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            SupportIQ
          </Link>
          <nav className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/demo">Try Demo</Link>
            </Button>
            <SignInButton />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <LandingHero />

      {/* Architecture Diagram */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-200 mb-2">How It Works</h2>
        <p className="text-center text-slate-500 mb-8">From raw inbox to prioritized triage in seconds</p>
        <ArchDiagram />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-200 mb-12">Everything you need to triage faster</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Auto-Classify</h3>
            <p className="text-sm text-slate-400">
              Automatically categorizes every email into Billing, Bug Reports, Feature Requests, and more — instantly.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <Tag className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Smart Priority</h3>
            <p className="text-sm text-slate-400">
              Detects urgency and revenue impact to surface High priority emails before they become crises.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Escalation Detection</h3>
            <p className="text-sm text-slate-400">
              Flags threats, outages, and legal risks automatically so your team can respond before it escalates.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-600">
        Built with Next.js · Supabase · OpenAI API
      </footer>
    </div>
  );
}
