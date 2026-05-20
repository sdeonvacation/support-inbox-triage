'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SparklesCoreProps {
  id?: string;
  background?: string;
  particleColor?: string;
  particleDensity?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  fade: number;
}

export function SparklesCore({
  id,
  background = 'transparent',
  particleColor = '#FFFFFF',
  particleDensity = 80,
  minSize = 0.4,
  maxSize = 1,
  speed = 1,
  className,
}: SparklesCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    };

    const init = () => {
      const count = Math.floor((canvas.width * canvas.height) / 10000 * (particleDensity / 80));
      particles = Array.from({ length: count }, () => createParticle());
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3 * speed,
      vy: (Math.random() - 0.5) * 0.3 * speed,
      size: minSize + Math.random() * (maxSize - minSize),
      opacity: Math.random(),
      fade: (Math.random() * 0.01 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (background !== 'transparent') {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.fade;

        if (p.opacity <= 0 || p.opacity >= 1) p.fade *= -1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [background, particleColor, particleDensity, minSize, maxSize, speed]);

  return (
    <canvas
      id={id}
      ref={canvasRef}
      className={cn('block', className)}
    />
  );
}
