/**
 * Premium animation primitives for the Landing hero.
 * - GPU-friendly transforms only
 * - prefers-reduced-motion aware
 * - Lazy / intersection-observer driven
 */

import * as React from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Reduced-motion hook
// ─────────────────────────────────────────────────────────────────────────────

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D tilt on mouse move
// ─────────────────────────────────────────────────────────────────────────────

interface TiltOptions {
  max?: number; // max rotation degrees
  scale?: number; // hover scale
}

export function useMouseTilt(max = 8, scale = 1.02) {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rx = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), {
    stiffness: 150,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), {
    stiffness: 150,
    damping: 18,
  });

  const onMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mx, my, reduced]
  );

  const onLeave = React.useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return { rx, ry, scale, onMove, onLeave, reduced };
}

// ─────────────────────────────────────────────────────────────────────────────
// Counter that animates from 0 -> target when in view
// ─────────────────────────────────────────────────────────────────────────────

interface CounterProps {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  to,
  duration = 1.8,
  prefix = '',
  suffix = '',
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();
  const [val, setVal] = React.useState(0);

  React.useEffect(() => {
    if (!inView || reduced) {
      if (inView) setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, duration]);

  const formatted = Math.round(val).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Word-by-word reveal headline
// ─────────────────────────────────────────────────────────────────────────────

interface WordRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  highlightClassName?: string;
  highlightWord?: string;
  delay?: number;
  stagger?: number;
}

export function WordReveal({
  text,
  className,
  wordClassName,
  highlightClassName,
  highlightWord,
  delay = 0,
  stagger = 0.08,
}: WordRevealProps) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => {
        const isHighlight = highlightWord && word.toLowerCase() === highlightWord.toLowerCase();
        return (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              initial={reduced ? false : { y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: delay + i * stagger,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`inline-block ${isHighlight ? highlightClassName : wordClassName}`}
            >
              {word}&nbsp;
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Glow ring / border that uses a MotionValue-driven gradient
// ─────────────────────────────────────────────────────────────────────────────

export function NeonBorderGlow({ opacity = 0.6 }: { opacity?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      animate={
        reduced
          ? undefined
          : { opacity: [opacity * 0.5, opacity, opacity * 0.5] }
      }
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute inset-0 rounded-[inherit] pointer-events-none"
      style={{
        padding: '1px',
        background:
          'linear-gradient(130deg, rgba(45,212,191,0.7), rgba(34,211,238,0.2), rgba(45,212,191,0.7))',
        WebkitMask:
          'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Glass reflection sweep (recurring)
// ─────────────────────────────────────────────────────────────────────────────

export function GlassReflectionSweep({ period = 9 }: { period?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
      <div
        className="absolute inset-y-0 -left-1/3 w-1/3"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          animation: `glass-reflection-sweep ${period}s ease-in-out infinite`,
          animationDelay: `${period * 0.4}s`,
        }}
      />
    </div>
  );
}

// re-export for convenience
export type { MotionValue };
