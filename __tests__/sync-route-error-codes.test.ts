/**
 * Unit tests for sync route error-code logic.
 *
 * These tests exercise the pure decision logic extracted from the POST handler:
 * which errorCode/error to attach based on (gmailMessages.length, processed, skipped).
 *
 * Run with: npx vitest (after adding vitest to devDependencies)
 * Or with Jest: npx jest (after adding jest + ts-jest to devDependencies)
 */

import type { SyncResponse } from '../lib/types';

// ---------------------------------------------------------------------------
// Pure helper — mirrors the logic in route.ts so we can unit-test it in
// isolation without spinning up Next.js or mocking Supabase/Gmail/AI.
// ---------------------------------------------------------------------------
function buildSyncResponse(opts: {
  gmailCount: number;
  processed: number;
  skipped: number;
  escalations: number;
  totalTimeMs: number;
}): SyncResponse {
  const { gmailCount, processed, skipped, escalations, totalTimeMs } = opts;

  if (gmailCount === 0) {
    return {
      success: false,
      error: 'Failed to fetch emails from Gmail. Check your connection and Gmail permissions.',
      errorCode: 'GMAIL_FETCH_FAILED',
      processed: 0,
      skipped: 0,
      escalations: 0,
      totalTimeMs,
    };
  }

  let error: string | undefined;
  let errorCode: SyncResponse['errorCode'];

  if (processed === 0 && gmailCount > 0) {
    error = 'AI classification failed for all emails. Check your AI provider settings.';
    errorCode = 'AI_UNAVAILABLE';
  } else if (skipped > 0 && processed > 0) {
    error = `${skipped} emails could not be classified.`;
    errorCode = 'PARTIAL_FAILURE';
  }

  return {
    success: true,
    processed,
    skipped,
    escalations,
    totalTimeMs,
    ...(error !== undefined && { error }),
    ...(errorCode !== undefined && { errorCode }),
  };
}

// ---------------------------------------------------------------------------
// Tests — framework-agnostic assertions using Node assert
// ---------------------------------------------------------------------------
import assert from 'node:assert/strict';

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

describe('GMAIL_FETCH_FAILED', () => {
  test('returns success:false with GMAIL_FETCH_FAILED when gmailCount is 0', () => {
    const res = buildSyncResponse({ gmailCount: 0, processed: 0, skipped: 0, escalations: 0, totalTimeMs: 100 });
    assert.equal(res.success, false);
    assert.equal(res.errorCode, 'GMAIL_FETCH_FAILED');
    assert.match(res.error!, /Failed to fetch emails from Gmail/);
    assert.equal(res.processed, 0);
    assert.equal(res.skipped, 0);
    assert.equal(res.escalations, 0);
  });

  test('includes totalTimeMs in GMAIL_FETCH_FAILED response', () => {
    const res = buildSyncResponse({ gmailCount: 0, processed: 0, skipped: 0, escalations: 0, totalTimeMs: 42 });
    assert.equal(res.totalTimeMs, 42);
  });

  test('GMAIL_FETCH_FAILED takes precedence — resets processed to 0', () => {
    const res = buildSyncResponse({ gmailCount: 0, processed: 3, skipped: 0, escalations: 0, totalTimeMs: 10 });
    assert.equal(res.errorCode, 'GMAIL_FETCH_FAILED');
    assert.equal(res.processed, 0);
  });
});

describe('AI_UNAVAILABLE', () => {
  test('returns AI_UNAVAILABLE when gmailCount > 0 but processed === 0', () => {
    const res = buildSyncResponse({ gmailCount: 5, processed: 0, skipped: 5, escalations: 0, totalTimeMs: 200 });
    assert.equal(res.success, true);
    assert.equal(res.errorCode, 'AI_UNAVAILABLE');
    assert.match(res.error!, /AI classification failed for all emails/);
  });

  test('success:true even for AI_UNAVAILABLE', () => {
    const res = buildSyncResponse({ gmailCount: 1, processed: 0, skipped: 1, escalations: 0, totalTimeMs: 50 });
    assert.equal(res.success, true);
  });

  test('single email, single skip → AI_UNAVAILABLE not PARTIAL_FAILURE', () => {
    const res = buildSyncResponse({ gmailCount: 1, processed: 0, skipped: 1, escalations: 0, totalTimeMs: 10 });
    assert.equal(res.errorCode, 'AI_UNAVAILABLE');
  });
});

describe('PARTIAL_FAILURE', () => {
  test('returns PARTIAL_FAILURE when some processed and some skipped', () => {
    const res = buildSyncResponse({ gmailCount: 10, processed: 7, skipped: 3, escalations: 1, totalTimeMs: 300 });
    assert.equal(res.errorCode, 'PARTIAL_FAILURE');
    assert.equal(res.error, '3 emails could not be classified.');
    assert.equal(res.processed, 7);
    assert.equal(res.skipped, 3);
  });

  test('error message reflects exact skipped count', () => {
    const res = buildSyncResponse({ gmailCount: 20, processed: 15, skipped: 5, escalations: 0, totalTimeMs: 400 });
    assert.equal(res.error, '5 emails could not be classified.');
  });

  test('success remains true for PARTIAL_FAILURE', () => {
    const res = buildSyncResponse({ gmailCount: 4, processed: 2, skipped: 2, escalations: 0, totalTimeMs: 150 });
    assert.equal(res.success, true);
  });
});

describe('Clean success — no error fields', () => {
  test('omits error and errorCode when all emails processed', () => {
    const res = buildSyncResponse({ gmailCount: 5, processed: 5, skipped: 0, escalations: 2, totalTimeMs: 500 });
    assert.equal(res.success, true);
    assert.equal(res.errorCode, undefined);
    assert.equal(res.error, undefined);
    assert.equal(res.processed, 5);
    assert.equal(res.escalations, 2);
  });

  test('omits error and errorCode when skipped === 0', () => {
    const res = buildSyncResponse({ gmailCount: 1, processed: 1, skipped: 0, escalations: 0, totalTimeMs: 10 });
    assert.equal(res.errorCode, undefined);
    assert.equal(res.error, undefined);
  });
});
