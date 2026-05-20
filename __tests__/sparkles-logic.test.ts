/**
 * Unit tests for SparklesCore particle logic.
 *
 * Tests the pure particle math/logic extracted from sparkles.tsx.
 * Run with: node --experimental-vm-modules --import tsx __tests__/sparkles-logic.test.ts
 * (or via vitest once added to devDependencies)
 *
 * No DOM / React / canvas required — all logic is pure math.
 */

import assert from 'node:assert/strict';

// ---------------------------------------------------------------------------
// Types mirrored from sparkles.tsx
// ---------------------------------------------------------------------------
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  fade: number;
}

// ---------------------------------------------------------------------------
// Pure helpers extracted from sparkles.tsx (testable in isolation)
// ---------------------------------------------------------------------------

function createParticle(
  width: number,
  height: number,
  minSize: number,
  maxSize: number,
  speed: number
): Particle {
  const rand = Math.random;
  return {
    x: rand() * width,
    y: rand() * height,
    vx: (rand() - 0.5) * 0.3 * speed,
    vy: (rand() - 0.5) * 0.3 * speed,
    size: minSize + rand() * (maxSize - minSize),
    opacity: rand(),
    fade: (rand() * 0.01 + 0.002) * (rand() < 0.5 ? 1 : -1),
  };
}

function particleCount(width: number, height: number, density: number): number {
  return Math.floor((width * height) / 10000 * (density / 80));
}

function clampOpacity(opacity: number): number {
  return Math.max(0, Math.min(1, opacity));
}

function wrapCoord(val: number, max: number): number {
  if (val < 0) return max;
  if (val > max) return 0;
  return val;
}

function stepParticle(p: Particle, width: number, height: number): Particle {
  const next: Particle = { ...p };
  next.x += next.vx;
  next.y += next.vy;
  next.opacity += next.fade;

  if (next.opacity <= 0 || next.opacity >= 1) next.fade *= -1;
  next.x = wrapCoord(next.x, width);
  next.y = wrapCoord(next.y, height);
  return next;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
    failed++;
  }
}

console.log('\nSparklesCore particle logic\n');

// --- createParticle ---
test('particle x within canvas bounds', () => {
  for (let i = 0; i < 100; i++) {
    const p = createParticle(800, 600, 0.4, 1, 1);
    assert.ok(p.x >= 0 && p.x <= 800, `x=${p.x} out of range`);
  }
});

test('particle y within canvas bounds', () => {
  for (let i = 0; i < 100; i++) {
    const p = createParticle(800, 600, 0.4, 1, 1);
    assert.ok(p.y >= 0 && p.y <= 600, `y=${p.y} out of range`);
  }
});

test('particle size within [minSize, maxSize]', () => {
  for (let i = 0; i < 100; i++) {
    const p = createParticle(800, 600, 0.4, 1, 1);
    assert.ok(p.size >= 0.4 && p.size <= 1, `size=${p.size} out of range`);
  }
});

test('particle opacity in [0, 1)', () => {
  for (let i = 0; i < 100; i++) {
    const p = createParticle(800, 600, 0.4, 1, 1);
    assert.ok(p.opacity >= 0 && p.opacity < 1, `opacity=${p.opacity} out of range`);
  }
});

test('particle fade magnitude in [0.002, 0.012]', () => {
  for (let i = 0; i < 200; i++) {
    const p = createParticle(800, 600, 0.4, 1, 1);
    const absFade = Math.abs(p.fade);
    assert.ok(absFade >= 0.002 && absFade <= 0.012, `fade=${p.fade} out of range`);
  }
});

test('speed scales velocity (higher speed → higher vx/vy range)', () => {
  // At speed=2, max |vx| = 0.5 * 0.3 * 2 = 0.3
  for (let i = 0; i < 100; i++) {
    const p = createParticle(800, 600, 0.4, 1, 2);
    assert.ok(Math.abs(p.vx) <= 0.3 + 1e-10, `vx=${p.vx} exceeds max`);
    assert.ok(Math.abs(p.vy) <= 0.3 + 1e-10, `vy=${p.vy} exceeds max`);
  }
});

test('zero speed → vx and vy are 0', () => {
  for (let i = 0; i < 20; i++) {
    const p = createParticle(800, 600, 0.4, 1, 0);
    assert.equal(p.vx, 0);
    assert.equal(p.vy, 0);
  }
});

// --- particleCount ---
test('particleCount scales with density', () => {
  const low = particleCount(800, 600, 40);
  const high = particleCount(800, 600, 160);
  assert.ok(high > low, 'higher density should yield more particles');
});

test('particleCount at density=80 matches baseline formula', () => {
  const count = particleCount(800, 600, 80);
  // (800*600)/10000 * 1 = 48
  assert.equal(count, 48);
});

test('particleCount is 0 for zero-size canvas', () => {
  assert.equal(particleCount(0, 0, 80), 0);
});

// --- clampOpacity ---
test('clampOpacity returns value for valid range', () => {
  assert.equal(clampOpacity(0.5), 0.5);
  assert.equal(clampOpacity(0), 0);
  assert.equal(clampOpacity(1), 1);
});

test('clampOpacity clamps negative to 0', () => {
  assert.equal(clampOpacity(-0.1), 0);
});

test('clampOpacity clamps >1 to 1', () => {
  assert.equal(clampOpacity(1.5), 1);
});

// --- wrapCoord ---
test('wrapCoord: x < 0 wraps to max (width)', () => {
  assert.equal(wrapCoord(-1, 800), 800);
});

test('wrapCoord: x > max wraps to 0', () => {
  assert.equal(wrapCoord(801, 800), 0);
});

test('wrapCoord: x within bounds unchanged', () => {
  assert.equal(wrapCoord(400, 800), 400);
});

// --- stepParticle ---
test('stepParticle advances position by velocity', () => {
  const p: Particle = { x: 100, y: 200, vx: 1, vy: -1, size: 1, opacity: 0.5, fade: 0.01 };
  const next = stepParticle(p, 800, 600);
  assert.equal(next.x, 101);
  assert.equal(next.y, 199);
});

test('stepParticle advances opacity by fade', () => {
  const p: Particle = { x: 100, y: 200, vx: 0, vy: 0, size: 1, opacity: 0.5, fade: 0.01 };
  const next = stepParticle(p, 800, 600);
  assert.ok(Math.abs(next.opacity - 0.51) < 1e-10);
});

test('stepParticle reverses fade direction when opacity >= 1', () => {
  const p: Particle = { x: 100, y: 200, vx: 0, vy: 0, size: 1, opacity: 0.999, fade: 0.01 };
  const next = stepParticle(p, 800, 600);
  // opacity becomes ~1.009, triggers reversal
  assert.ok(next.fade < 0, `fade should reverse, got ${next.fade}`);
});

test('stepParticle reverses fade direction when opacity <= 0', () => {
  const p: Particle = { x: 100, y: 200, vx: 0, vy: 0, size: 1, opacity: 0.001, fade: -0.01 };
  const next = stepParticle(p, 800, 600);
  assert.ok(next.fade > 0, `fade should reverse, got ${next.fade}`);
});

test('stepParticle wraps particle past right edge to x=0', () => {
  const p: Particle = { x: 799, y: 100, vx: 5, vy: 0, size: 1, opacity: 0.5, fade: 0.001 };
  const next = stepParticle(p, 800, 600);
  assert.equal(next.x, 0);
});

test('stepParticle wraps particle past left edge to x=width', () => {
  const p: Particle = { x: 1, y: 100, vx: -5, vy: 0, size: 1, opacity: 0.5, fade: 0.001 };
  const next = stepParticle(p, 800, 600);
  assert.equal(next.x, 800);
});

test('stepParticle does not mutate original particle', () => {
  const p: Particle = { x: 100, y: 200, vx: 1, vy: 1, size: 1, opacity: 0.5, fade: 0.01 };
  const origX = p.x;
  stepParticle(p, 800, 600);
  assert.equal(p.x, origX);
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
