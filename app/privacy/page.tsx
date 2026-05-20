import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Triagent',
  description: 'How Triagent collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Triagent
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: May 21, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Overview</h2>
          <p>Triagent (&quot;we&quot;, &quot;our&quot;, &quot;the app&quot;) is an AI-powered email triage tool that helps you classify and prioritise your Gmail inbox. This Privacy Policy explains what data we access, how we use it, and your rights as a user.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Data We Access</h2>
          <p>When you sign in with Google, Triagent requests the following OAuth scopes:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li><strong className="text-slate-300">gmail.readonly</strong> — read-only access to your Gmail messages. We never send, modify, or delete emails.</li>
            <li><strong className="text-slate-300">userinfo.email / userinfo.profile</strong> — your email address and name, used to identify your account.</li>
          </ul>
          <p>We do <strong className="text-slate-200">not</strong> access contacts, Google Drive, Calendar, or any other Google service.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Email subject lines and bodies are sent to the <strong className="text-slate-300">OpenAI API</strong> solely to generate priority, category, sentiment, and summary classifications.</li>
            <li>Classification results (not raw email bodies) are stored in our database (Supabase) so you can view your triage history.</li>
            <li>We do <strong className="text-slate-200">not</strong> sell, share, or use your email content for advertising or model training.</li>
            <li>OAuth tokens are stored securely in your session and are used only to fetch emails on your explicit request (&quot;Sync Gmail&quot;).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Data Storage &amp; Security</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Classification metadata is stored in Supabase (PostgreSQL), hosted on secure cloud infrastructure.</li>
            <li>Raw email bodies are <strong className="text-slate-300">not</strong> persisted — they are processed in memory and discarded after classification.</li>
            <li>All data is transmitted over HTTPS/TLS.</li>
            <li>Access to your data is restricted to your authenticated account only.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Third-Party Services</h2>
          <ul className="list-disc list-inside space-y-2 text-slate-400">
            <li><strong className="text-slate-300">Google OAuth 2.0</strong> — authentication and Gmail access. Governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Google&apos;s Privacy Policy</a>.</li>
            <li><strong className="text-slate-300">OpenAI API</strong> — email classification. Governed by <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">OpenAI&apos;s Privacy Policy</a>. API data is not used to train OpenAI models.</li>
            <li><strong className="text-slate-300">Supabase</strong> — database and authentication. Governed by <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Supabase&apos;s Privacy Policy</a>.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">6. Your Rights</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li><strong className="text-slate-300">Access</strong> — you can view all classification data stored for your account in the dashboard.</li>
            <li><strong className="text-slate-300">Deletion</strong> — you can request full deletion of your account and associated data by contacting us.</li>
            <li><strong className="text-slate-300">Revoke access</strong> — you can revoke Triagent&apos;s Gmail access at any time via <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Google Account Permissions</a>.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">7. Data Retention</h2>
          <p>Classification results are retained as long as your account is active. Raw email content is never stored. You may request deletion of all stored data at any time.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">8. Children&apos;s Privacy</h2>
          <p>Triagent is not directed at children under 13. We do not knowingly collect data from minors.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">9. Changes to This Policy</h2>
          <p>We may update this policy as the product evolves. Significant changes will be communicated via the app. Continued use after changes constitutes acceptance.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">10. Contact</h2>
          <p>Questions about this policy or data deletion requests:</p>
          <p className="text-purple-400">privacy@triagent.app</p>
        </section>

        <div className="border-t border-slate-800 pt-8">
          <Link href="/" className="text-sm text-slate-500 hover:text-white transition-colors">
            ← Back to Triagent
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-600">
        © 2026 Triagent · Built with Next.js, Supabase &amp; OpenAI
      </footer>
    </div>
  );
}
