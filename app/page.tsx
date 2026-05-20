import Link from 'next/link';
import { ArchDiagram } from '@/components/arch-diagram';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@/components/sign-in-button';
import { SplineSceneBasic } from '@/components/ui/spline-scene-basic';
import { BackgroundPaths } from '@/components/ui/background-paths';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';
import { FeatureCards } from '@/components/ui/feature-cards';
import { SparklesCore } from '@/components/ui/sparkles';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-black/80 backdrop-blur-sm">
          <div className="w-full px-4 sm:px-8 md:px-16 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Triagent
          </Link>
          <nav className="flex items-center gap-3">
            <Button asChild variant="ghost" className="h-11 px-4 text-sm">
              <Link href="/demo">Try Demo</Link>
            </Button>
            <SignInButton />
          </nav>
        </div>
      </header>

      {/* Scroll Story */}
      <FlowArt aria-label="Triagent overview">
        {/* Section 1: Hero */}
        <FlowSection aria-label="Hero" className="bg-black">
          <div className="-mx-[4vw] -mt-[clamp(2rem,8vw,4vw)] -mb-[4vw] h-screen">
            <SplineSceneBasic />
          </div>
        </FlowSection>

        {/* Section 2: How It Works */}
        <FlowSection aria-label="How it works" className="bg-neutral-950">
          <BackgroundPaths>
            <div className="min-h-screen flex flex-col items-center justify-center w-full py-16 px-8">
              <div className="mb-10 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400 mb-4">02 / How It Works</p>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                  From inbox chaos<br />
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">to clarity in seconds.</span>
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 mx-auto" />
                <p className="text-slate-400 text-base md:text-lg">From raw inbox to prioritized triage in seconds</p>
              </div>
              <div className="w-full max-w-4xl">
                <ArchDiagram />
              </div>
            </div>
          </BackgroundPaths>
        </FlowSection>

        {/* Section 3: Features */}
        <FlowSection aria-label="Features" className="bg-slate-950">
          <div className="relative w-full flex-1 flex flex-col min-h-screen">
            <SparklesCore
              id="features-sparkles"
              background="transparent"
              particleColor="#FFFFFF"
              particleDensity={80}
              minSize={0.4}
              maxSize={1}
              speed={1}
              className="absolute inset-0 w-full h-full"
            />
            <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 w-full flex flex-col justify-center flex-1">
              <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
                <span className="text-white">Everything you need </span>
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">to triage faster</span>
              </h2>
              <p className="text-center text-slate-500 mb-12 text-sm uppercase tracking-widest">Three tools. One pipeline. Zero noise.</p>
              <FeatureCards />
            </div>
          </div>
        </FlowSection>
      </FlowArt>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-600">
        Built with Next.js · Supabase · OpenAI API
      </footer>
    </div>
  );
}
