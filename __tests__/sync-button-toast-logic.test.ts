/**
 * Unit tests for sync-button toast/state logic.
 *
 * Tests the decision logic that maps SyncResponse errorCode values to
 * toast calls and status transitions — extracted as a pure function
 * so it can be tested without React/DOM.
 *
 * Run with: npx vitest (after adding vitest to devDependencies)
 */

import assert from 'node:assert/strict';
import type { SyncResponse } from '../lib/types';

// ---------------------------------------------------------------------------
// Pure helper — mirrors the handleSync post-fetch branching in sync-button.tsx
// ---------------------------------------------------------------------------
type ToastVariant = 'default' | 'destructive';
interface ToastCall { title: string; description: string | undefined; variant: ToastVariant }
interface HandleResult {
  status: 'complete' | 'error';
  toasts: ToastCall[];
  syncCompleteCalled: boolean;
  syncCompleteData: SyncResponse | null;
}

function handleSyncResponse(data: SyncResponse): HandleResult {
  const toasts: ToastCall[] = [];
  let status: 'complete' | 'error' = 'complete';
  let syncCompleteCalled = false;
  let syncCompleteData: SyncResponse | null = null;

  if (data.errorCode === 'GMAIL_FETCH_FAILED') {
    status = 'error';
    toasts.push({ title: 'Gmail fetch failed', description: data.error, variant: 'destructive' });
    return { status, toasts, syncCompleteCalled, syncCompleteData };
  }

  if (data.errorCode === 'AI_UNAVAILABLE') {
    status = 'error';
    toasts.push({ title: 'AI classification failed', description: data.error, variant: 'destructive' });
    return { status, toasts, syncCompleteCalled, syncCompleteData };
  }

  if (data.errorCode === 'PARTIAL_FAILURE') {
    toasts.push({ title: 'Partial sync', description: data.error, variant: 'default' });
  }

  status = 'complete';
  syncCompleteCalled = true;
  syncCompleteData = data;
  return { status, toasts, syncCompleteCalled, syncCompleteData };
}

function handleNonOkResponse(body: { error?: string } | null): HandleResult {
  const errorMsg = body?.error ?? 'Unknown error';
  return {
    status: 'error',
    toasts: [{ title: 'Sync error', description: errorMsg, variant: 'destructive' }],
    syncCompleteCalled: false,
    syncCompleteData: null,
  };
}

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

function describe(suite: string, fn: () => void) {
  console.log(`\n${suite}`);
  fn();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('handleSyncResponse — GMAIL_FETCH_FAILED', () => {
  const data: SyncResponse = {
    success: false,
    errorCode: 'GMAIL_FETCH_FAILED',
    error: 'Failed to fetch emails from Gmail. Check your connection and Gmail permissions.',
    processed: 0, skipped: 0, escalations: 0, totalTimeMs: 50,
  };

  test('sets status to error', () => {
    assert.equal(handleSyncResponse(data).status, 'error');
  });

  test('fires destructive toast with correct title', () => {
    const { toasts } = handleSyncResponse(data);
    assert.equal(toasts.length, 1);
    assert.equal(toasts[0].title, 'Gmail fetch failed');
    assert.equal(toasts[0].variant, 'destructive');
    assert.equal(toasts[0].description, data.error);
  });

  test('does NOT call onSyncComplete', () => {
    assert.equal(handleSyncResponse(data).syncCompleteCalled, false);
  });
});

describe('handleSyncResponse — AI_UNAVAILABLE', () => {
  const data: SyncResponse = {
    success: true,
    errorCode: 'AI_UNAVAILABLE',
    error: 'AI classification failed for all emails. Check your AI provider settings.',
    processed: 0, skipped: 5, escalations: 0, totalTimeMs: 200,
  };

  test('sets status to error', () => {
    assert.equal(handleSyncResponse(data).status, 'error');
  });

  test('fires destructive toast with correct title', () => {
    const { toasts } = handleSyncResponse(data);
    assert.equal(toasts.length, 1);
    assert.equal(toasts[0].title, 'AI classification failed');
    assert.equal(toasts[0].variant, 'destructive');
    assert.equal(toasts[0].description, data.error);
  });

  test('does NOT call onSyncComplete', () => {
    assert.equal(handleSyncResponse(data).syncCompleteCalled, false);
  });
});

describe('handleSyncResponse — PARTIAL_FAILURE', () => {
  const data: SyncResponse = {
    success: true,
    errorCode: 'PARTIAL_FAILURE',
    error: '3 emails could not be classified.',
    processed: 7, skipped: 3, escalations: 1, totalTimeMs: 300,
  };

  test('sets status to complete', () => {
    assert.equal(handleSyncResponse(data).status, 'complete');
  });

  test('fires default (non-destructive) toast', () => {
    const { toasts } = handleSyncResponse(data);
    assert.equal(toasts.length, 1);
    assert.equal(toasts[0].title, 'Partial sync');
    assert.equal(toasts[0].variant, 'default');
    assert.equal(toasts[0].description, data.error);
  });

  test('DOES call onSyncComplete with data', () => {
    const result = handleSyncResponse(data);
    assert.equal(result.syncCompleteCalled, true);
    assert.deepEqual(result.syncCompleteData, data);
  });
});

describe('handleSyncResponse — clean success', () => {
  const data: SyncResponse = {
    success: true,
    processed: 10, skipped: 0, escalations: 2, totalTimeMs: 500,
  };

  test('sets status to complete', () => {
    assert.equal(handleSyncResponse(data).status, 'complete');
  });

  test('fires no toasts', () => {
    assert.equal(handleSyncResponse(data).toasts.length, 0);
  });

  test('calls onSyncComplete with data', () => {
    const result = handleSyncResponse(data);
    assert.equal(result.syncCompleteCalled, true);
    assert.deepEqual(result.syncCompleteData, data);
  });
});

describe('handleNonOkResponse — HTTP error', () => {
  test('uses error from response body', () => {
    const result = handleNonOkResponse({ error: 'No Gmail access token' });
    assert.equal(result.status, 'error');
    assert.equal(result.toasts[0].title, 'Sync error');
    assert.equal(result.toasts[0].description, 'No Gmail access token');
    assert.equal(result.toasts[0].variant, 'destructive');
  });

  test('falls back to "Unknown error" when body has no error field', () => {
    const result = handleNonOkResponse(null);
    assert.equal(result.toasts[0].description, 'Unknown error');
  });

  test('does NOT call onSyncComplete', () => {
    assert.equal(handleNonOkResponse({ error: 'oops' }).syncCompleteCalled, false);
  });
});
