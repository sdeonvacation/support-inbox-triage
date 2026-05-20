'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SyncResponse, SyncState } from '@/lib/types';
import { RefreshCw, Check, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase';

interface SyncButtonProps {
  onSyncComplete: (response: SyncResponse) => void;
}

const INITIAL_STEPS = [
  { label: 'Fetching emails...', status: 'pending' as const },
  { label: 'Classifying with AI...', status: 'pending' as const },
  { label: 'Saving results...', status: 'pending' as const },
];

export function SyncButton({ onSyncComplete }: SyncButtonProps) {
  const [syncState, setSyncState] = useState<SyncState>({
    status: 'idle',
    steps: INITIAL_STEPS,
  });
  const [result, setResult] = useState<SyncResponse | null>(null);
  const { toast } = useToast();

  const updateStep = (index: number, status: SyncState['steps'][0]['status']) => {
    setSyncState((prev) => ({
      ...prev,
      steps: prev.steps.map((s, i) => (i === index ? { ...s, status } : s)),
    }));
  };

  const handleSync = async () => {
    setSyncState({ status: 'syncing', steps: INITIAL_STEPS });
    setResult(null);

    try {
      // Step 1: Fetching
      updateStep(0, 'active');
      await new Promise((r) => setTimeout(r, 400));
      updateStep(0, 'complete');

      // Step 2: Classifying
      updateStep(1, 'active');

      const session = (await createClient().auth.getSession()).data.session;
      console.log('[sync] provider_token:', session?.provider_token ? 'PRESENT' : 'NULL');
      console.log('[sync] user:', session?.user?.email);

      const res = await fetch('/api/gmail/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_token: session?.provider_token ?? null,
        }),
      });

      updateStep(1, 'complete');

      // Step 3: Saving
      updateStep(2, 'active');
      await new Promise((r) => setTimeout(r, 300));
      updateStep(2, 'complete');

      if (!res.ok) {
        let errorMsg = 'Unknown error';
        try {
          const body = await res.json();
          errorMsg = body.error ?? errorMsg;
        } catch { /* unparseable body */ }
        setSyncState((prev) => ({ ...prev, status: 'error' }));
        toast({ title: 'Sync error', description: errorMsg, variant: 'destructive' });
        return;
      }

      const data: SyncResponse = await res.json();
      setResult(data);

      if (data.errorCode === 'GMAIL_FETCH_FAILED') {
        setSyncState((prev) => ({ ...prev, status: 'error' }));
        toast({ title: 'Gmail fetch failed', description: data.error, variant: 'destructive' });
        return;
      }

      if (data.errorCode === 'AI_UNAVAILABLE') {
        setSyncState((prev) => ({ ...prev, status: 'error' }));
        toast({ title: 'AI classification failed', description: data.error, variant: 'destructive' });
        return;
      }

      if (data.errorCode === 'PARTIAL_FAILURE') {
        toast({ title: 'Partial sync', description: data.error, variant: 'default' });
      }

      setSyncState((prev) => ({ ...prev, status: 'complete' }));
      onSyncComplete(data);
    } catch (error) {
      setSyncState((prev) => ({ ...prev, status: 'error' }));
      toast({ title: "Sync failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    }
  };

  const isIdle = syncState.status === 'idle';
  const isSyncing = syncState.status === 'syncing';
  const isComplete = syncState.status === 'complete';
  const isError = syncState.status === 'error';

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleSync}
        disabled={isSyncing}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-2"
      >
        {isSyncing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        {isSyncing ? 'Syncing...' : 'Sync Gmail'}
      </Button>

      <AnimatePresence>
        {(isSyncing || isComplete || isError) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 space-y-2">
              {syncState.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {step.status === 'pending' && (
                    <div className="w-4 h-4 rounded-full border border-slate-600" />
                  )}
                  {step.status === 'active' && (
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  )}
                  {step.status === 'complete' && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                  {step.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span
                    className={
                      step.status === 'complete'
                        ? 'text-emerald-400'
                        : step.status === 'active'
                        ? 'text-white'
                        : 'text-slate-500'
                    }
                  >
                    {step.label}
                  </span>
                </div>
              ))}

              {isComplete && result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-1 border-t border-slate-800 text-xs text-slate-400 font-mono"
                >
                  ✓ Done in {(result.totalTimeMs / 1000).toFixed(1)}s · {result.processed} processed · {result.escalations} escalations
                </motion.div>
              )}

              {isError && (
                <div className="pt-1 border-t border-slate-800 text-xs text-red-400">
                  Sync failed. Check your connection and try again.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
