/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ZAVR Landing Page - Premium Fintech Experience
 * Matches mobile app design system exactly
 */

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  useReducedMotion,
  useMouseTilt,
  AnimatedCounter,
  WordReveal,
  NeonBorderGlow,
  GlassReflectionSweep,
} from '../components/PremiumAnimations';
import {
  Target, Users, Trophy, BarChart3, Bell, Shield,
  Sparkles, Zap, Heart, ArrowRight, ChevronDown,
  Smartphone, Lock, Bot, TrendingUp, Award, Wallet,
  CheckCircle2, Clock, Flame, ChevronRight, Instagram, Linkedin, Mail,
  Play, Pause, ArrowUpRight, Globe, Coins, Handshake, MessageCircle,
  Quote, PiggyBank
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const LOGO_URL = 'https://raw.githubusercontent.com/zavrinfo-arch/zavr-privacy-policy/main/zavr_logo.png';

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/zavr.info?igsh=cWk4M2JqNTFicW9q',
  linkedin: 'https://www.linkedin.com/company/zavr/',
  email: 'mailto:contact@zavr.info'
};

const FEATURES = [
  { icon: Target, title: 'Solo Goals', desc: 'Set personal savings targets with deadlines, categories, and live progress tracking.', color: 'coral' },
  { icon: Users, title: 'Group Goals', desc: 'Save with friends or family. Auto-generated group IDs, equal share distribution.', color: 'teal' },
  { icon: Trophy, title: 'Saving Streaks', desc: 'Build daily habits with streak tracking. Unlock badges at milestone days.', color: 'gold' },
  { icon: BarChart3, title: 'Visual Analytics', desc: 'Recharts-powered visualizations. See exactly where your money is going.', color: 'coral' },
  { icon: Bell, title: 'Smart Notifications', desc: 'Real-time alerts for streaks, goal completions, and group activity.', color: 'teal' },
  { icon: Bot, title: 'AI Assistant', desc: 'Zettl AI helps you budget, suggest goals, and stay motivated.', color: 'gold' },
];

const GOAL_IDEAS = [
  { title: 'Emergency Fund', desc: 'Build a 6-month safety net with automatic reminders.', icon: Shield, gradient: 'from-rose-500 to-orange-500' },
  { title: 'Dream Vacation', desc: 'Plan your perfect getaway with travel-themed milestones.', icon: Sparkles, gradient: 'from-teal-400 to-cyan-400' },
  { title: 'Family Fund', desc: 'Save together for holidays, home improvements, or education.', icon: Users, gradient: 'from-amber-400 to-yellow-400' },
  { title: 'Tech Upgrade', desc: 'Save for that new phone or laptop with real-time tracking.', icon: Smartphone, gradient: 'from-violet-500 to-purple-500' },
];

const FAQS = [
  { q: 'Is Zavr free to use?', a: 'Yes! Zavr offers a generous free tier with solo goals, streaks, and basic analytics. Premium unlocks group goals, AI assistance, and advanced features.' },
  { q: 'How does Zavr keep my data secure?', a: 'We use Supabase with row-level security, end-to-end encryption for sensitive data, and never store bank credentials. Your financial data stays yours.' },
  { q: 'Can I save with friends who don\'t have Zavr?', a: 'Group goals require all members to have a Zavr account, but inviting friends is easy—they can join with just a group code!' },
  { q: 'Does Zavr connect to my bank account?', a: 'No. Zavr is a goal-tracking tool, not a payment processor. You manually log your savings, giving you full control and privacy.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedBackground() {
  const reduced = useReducedMotion();

  // Pre-compute particle / dot configs once
  const particles = React.useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 4 + (i % 4) * 2,
        delay: (i % 7) * 1.3,
        dur: 9 + (i % 5) * 2,
        anim: i % 2 === 0 ? 'particle-float-a' : 'particle-float-b',
      })),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-[#09090B]" />

      {/* Aurora gradients */}
      <motion.div
        animate={reduced ? undefined : {
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 left-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(244,63,94,0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <motion.div
        animate={reduced ? undefined : {
          x: [0, -80, -40, 0],
          y: [0, 80, 40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 right-0 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(45,212,191,0.4) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <motion.div
        animate={reduced ? undefined : {
          x: [0, 60, -30, 0],
          y: [0, -40, 60, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-0 left-1/3 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.4) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />

      {/* Cyan moving radial lights (premium fintech glow) */}
      <motion.div
        animate={reduced ? undefined : {
          x: ['-10%', '60%', '20%', '-10%'],
          y: ['10%', '50%', '80%', '10%'],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[260px] h-[260px] sm:w-[400px] sm:h-[400px] md:w-[520px] md:h-[520px] opacity-40"
        style={{
          background: 'radial-gradient(circle at center, rgba(45,212,191,0.55) 0%, rgba(34,211,238,0.2) 40%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
      <motion.div
        animate={reduced ? undefined : {
          x: ['80%', '30%', '70%', '80%'],
          y: ['60%', '20%', '50%', '60%'],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[210px] h-[210px] sm:w-[320px] sm:h-[320px] md:w-[420px] md:h-[420px] opacity-30"
        style={{
          background: 'radial-gradient(circle at center, rgba(34,211,238,0.5) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Animated grid */}
      {!reduced && (
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(45,212,191,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            animation: 'grid-drift 24s linear infinite',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          }}
        />
      )}

      {/* Grid dots (original) */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(250,250,250,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating blurred particles */}
      {!reduced &&
        particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: 'rgba(45,212,191,0.6)',
              filter: 'blur(2px)',
              animation: `${p.anim} ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

      {/* Small glowing dots moving slowly */}
      {!reduced &&
        Array.from({ length: 18 }).map((_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute rounded-full bg-teal-300"
            style={{
              left: `${(i * 61) % 100}%`,
              top: `${(i * 29 + 5) % 100}%`,
              width: 2,
              height: 2,
              boxShadow: '0 0 6px rgba(45,212,191,0.9)',
              animation: `dot-drift ${10 + (i % 4) * 3}s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLASSMORPHISM CARD
// ─────────────────────────────────────────────────────────────────────────────

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'coral' | 'teal' | 'gold' | 'none';
  onClick?: () => void;
}

function GlassCard({ children, className = '', hover = true, glow = 'none', onClick }: GlassCardProps) {
  const glowColors = {
    coral: 'hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]',
    teal: 'hover:shadow-[0_0_40px_rgba(45,212,191,0.15)]',
    gold: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]',
    none: ''
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`
        relative overflow-hidden
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.08]
        rounded-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
        transition-shadow duration-500
        ${glowColors[glow]}
        ${className}
      `}
    >
      {/* Inner glow */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
      </div>
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#09090B]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-br from-[#F43F5E] to-[#2DD4BF]">
            <div className="w-full h-full rounded-xl bg-[#09090B] flex items-center justify-center p-1.5">
              <img src={LOGO_URL} alt="Zavr" className="w-full h-full object-contain" />
            </div>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Zavr</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Features', href: '#features' },
            { label: 'About', href: '#about' },
            { label: 'Founders', href: '/founders', isRoute: true },
            { label: 'Contact', href: '#contact' },
          ].map((item) =>
            item.isRoute ? (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#F43F5E] to-[#2DD4BF] group-hover:w-full transition-all duration-300" />
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#F43F5E] to-[#2DD4BF] group-hover:w-full transition-all duration-300" />
              </a>
            )
          )}
        </div>

        {/* Coming Soon label */}
        <div className="hidden md:flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-300 bg-teal-500/10 border border-teal-500/25 rounded-xl">
            <Sparkles className="w-4 h-4" />
            Coming Soon
          </span>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
        >
          <motion.span
            animate={{ rotate: mobileOpen ? 45 : 0 }}
            className="text-white"
          >
            {mobileOpen ? '+' : '☰'}
          </motion.span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#09090B]/95 backdrop-blur-xl border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {[
                { label: 'Features', href: '#features' },
                { label: 'About', href: '#about' },
                { label: 'Founders', href: '/founders', isRoute: true },
                { label: 'Contact', href: '#contact' },
              ].map((item) =>
                item.isRoute ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-white/70 hover:text-white py-2"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-white/70 hover:text-white py-2"
                  >
                    {item.label}
                  </a>
                )
              )}
              <span className="w-full py-3 text-center text-sm font-bold text-teal-300 bg-teal-500/10 border border-teal-500/25 rounded-xl inline-flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Coming Soon
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden"
    >
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/[0.04] border border-white/[0.08]"
        >
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
            Introducing Zavr 2.1 — AI-Powered Savings
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight mb-6"
        >
          Save Smarter.
          <br />
          <span className="bg-gradient-to-r from-[#F43F5E] via-[#2DD4BF] to-[#F59E0B] bg-clip-text text-transparent">
            Together.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Zavr combines solo goals, group savings, daily streaks, and AI assistance
          into a beautifully crafted experience that makes saving feel rewarding.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <span className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-teal-200 bg-teal-500/10 border border-teal-500/30 rounded-2xl shadow-[0_8px_30px_rgba(45,212,191,0.2)]">
            <Sparkles className="w-5 h-5" />
            Coming Soon
          </span>
          <a
            href="#features"
            className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/20 rounded-2xl transition-all hover:bg-white/[0.03]"
          >
            <Play className="w-4 h-4" />
            Learn More
          </a>
        </motion.div>

        {/* App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 relative"
        >
          {/* Glow behind */}
          <div className="absolute inset-x-1/4 -top-10 h-20 sm:h-32 md:h-40 blur-[60px] sm:blur-[80px] opacity-40 bg-gradient-to-r from-[#F43F5E] via-[#2DD4BF] to-[#F59E0B]" />

          <GlassCard className="p-6 md:p-8 max-w-3xl mx-auto" hover={false}>
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
              {[
                { icon: Target, label: 'Goals Active', value: '12', color: '#F43F5E' },
                { icon: TrendingUp, label: 'Total Saved', value: '$8,240', color: '#2DD4BF' },
                { icon: Flame, label: 'Day Streak', value: '34', color: '#F59E0B' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${stat.color}15` }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <p className="text-lg sm:text-xl font-black text-white">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-white/40">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Progress Bars */}
            <div className="space-y-3">
              {[
                { name: 'Vacation Fund', progress: 72, color: '#F43F5E' },
                { name: 'Emergency Fund', progress: 45, color: '#2DD4BF' },
                { name: 'New Laptop', progress: 88, color: '#F59E0B' },
              ].map((goal, i) => (
                <div key={goal.name} className="flex items-center gap-2 sm:gap-4">
                  <span className="text-[10px] sm:text-xs text-white/50 w-20 sm:w-28 truncate">{goal.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ delay: 1 + i * 0.15, duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: goal.color }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs text-white/40 w-8 sm:w-10 text-right">{goal.progress}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEM SECTION
// ─────────────────────────────────────────────────────────────────────────────

function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const problems = [
    { icon: TrendingUp, title: 'No Clear Goals', desc: '72% of people don\'t have written savings goals, leading to aimless spending.' },
    { icon: Users, title: 'Fragmented Savings', desc: 'Saving with family is messy—spreadsheets, IOUs, and forgotten promises.' },
    { icon: Flame, title: 'Lost Motivation', desc: 'Most people abandon savings goals within 90 days due to lack of visible progress.' },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest">
            The Problem
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Saving Money Is
            <br />
            <span className="text-rose-400">Harder Than It Should Be</span>
          </h2>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto">
            Traditional banking apps treat savings as an afterthought. No motivation, no community, no joy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            >
              <GlassCard className="p-8 h-full" glow="coral">
                <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOLUTION SECTION
// ─────────────────────────────────────────────────────────────────────────────

function SolutionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const reduced = useReducedMotion();

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -3, reduced ? 0 : 3]);
  const bgGlowY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -80]);

  // 3D tilt for the feature card
  const cardTilt = useMouseTilt(6, 1.02);
  // 3D tilt for the phone
  const phoneTilt = useMouseTilt(10, 1.03);

  const features = [
    { icon: Trophy, title: 'Daily Streaks', desc: 'Build momentum with visible progress' },
    { icon: Users, title: 'Group Goals', desc: 'Save with friends and family' },
    { icon: Bot, title: 'AI Assistant', desc: 'Personalized saving recommendations' },
    { icon: BarChart3, title: 'Visual Analytics', desc: 'See where your money goes' },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Scroll-reactive background glow */}
      <motion.div
        aria-hidden
        style={{ y: bgGlowY }}
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[350px] h-[250px] sm:w-[500px] sm:h-[350px] md:w-[700px] md:h-[500px] rounded-full opacity-40 pointer-events-none"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(45,212,191,0.35) 0%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Headline + subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest">
            The Solution
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            <WordReveal
              text="Zavr Makes Saving"
              highlightWord=""
              className="block"
              wordClassName="text-white"
              delay={0.1}
              stagger={0.1}
            />
            <span className="relative inline-block">
              <WordReveal
                text="Addictive"
                highlightWord="Addictive"
                className="block"
                wordClassName="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent neon-cyan-text"
                highlightClassName="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent neon-cyan-text"
                delay={0.5}
                stagger={0.1}
              />
              {/* Light sweep over "Addictive" */}
              {!reduced && (
                <span
                  aria-hidden
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                >
                  <span
                    className="absolute inset-y-0 -left-1/2 w-1/3"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
                      animation: 'light-sweep 5s ease-in-out 1.5s infinite',
                    }}
                  />
                </span>
              )}
            </span>
          </h2>
          <motion.p
            initial={reduced ? false : { opacity: 0, letterSpacing: '0.08em' }}
            animate={isInView ? { opacity: 1, letterSpacing: '0em' } : {}}
            transition={{ delay: 1, duration: 0.9, ease: 'easeOut' }}
            className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto"
          >
            Gamification meets fintech. Build streaks, unlock achievements, and save with friends.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* LEFT FEATURE CARD */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1000 }}
          >
            <motion.div
              onMouseMove={cardTilt.onMove}
              onMouseLeave={cardTilt.onLeave}
              style={{
                rotateX: cardTilt.rx,
                rotateY: cardTilt.ry,
                transformStyle: 'preserve-3d',
              }}
              className="relative group"
            >
              {/* Floating wrapper */}
              <motion.div
                animate={
                  reduced
                    ? undefined
                    : { y: [0, -8, 0] }
                }
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  whileHover={
                    reduced
                      ? undefined
                      : { scale: 1.02, y: -6 }
                  }
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative"
                >
                  <GlassCard className="p-8 relative overflow-hidden">
                    {/* Cyan glow border on hover */}
                    <div className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        boxShadow:
                          '0 0 0 1px rgba(45,212,191,0.5), 0 0 30px rgba(45,212,191,0.35), 0 20px 60px rgba(0,0,0,0.5)',
                      }}
                    />
                    {/* Glass reflection sweep */}
                    <GlassReflectionSweep period={9} />
                    <div className="space-y-6 relative" style={{ transform: 'translateZ(40px)' }}>
                      {features.map((item, i) => (
                        <motion.div
                          key={item.title}
                          initial={reduced ? false : { opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{
                            delay: 0.6 + i * 0.15,
                            duration: 0.5,
                            ease: 'easeOut',
                          }}
                          className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors"
                        >
                          <motion.div
                            animate={
                              reduced
                                ? undefined
                                : { scale: [1, 1.12, 1], opacity: [1, 0.85, 1] }
                            }
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: i * 0.5,
                            }}
                            className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0"
                          >
                            <item.icon className="w-5 h-5 text-teal-400" />
                          </motion.div>
                          <div>
                            <h4 className="text-base font-bold text-white mb-1">{item.title}</h4>
                            <p className="text-sm text-white/50">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* PHONE MOCKUP */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1200 }}
            className="relative"
          >
            <motion.div
              onMouseMove={phoneTilt.onMove}
              onMouseLeave={phoneTilt.onLeave}
              style={{
                rotateX: phoneTilt.rx,
                rotateY: phoneTilt.ry,
                rotate: phoneRotate,
                transformStyle: 'preserve-3d',
              }}
              className="relative mx-auto w-64"
            >
              {/* Strong cyan radial glow behind phone */}
              <motion.div
                aria-hidden
                animate={
                  reduced
                    ? undefined
                    : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }
                }
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 blur-3xl rounded-full scale-150 pointer-events-none"
              />

              {/* Floating + breathing wrapper */}
              <motion.div
                animate={
                  reduced
                    ? undefined
                    : { y: [0, -14, 0], rotate: [-2, 2, -2], scale: [1, 1.03, 1] }
                }
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="relative">
                  <GlassCard className="relative p-2 rounded-[2.5rem] overflow-hidden">
                    {/* Animated neon border glow */}
                    <NeonBorderGlow opacity={0.7} />

                    <div className="bg-[#09090B] rounded-[2.25rem] p-6 min-h-[400px] sm:min-h-[480px] flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Screen reflection (diagonal) */}
                      {!reduced && (
                        <div
                          aria-hidden
                          className="absolute inset-0 pointer-events-none overflow-hidden"
                        >
                          <div
                            className="absolute -inset-1/2"
                            style={{
                              background:
                                'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)',
                              animation: 'screen-reflection-diag 7s ease-in-out infinite',
                            }}
                          />
                        </div>
                      )}

                      {/* Logo (rotates slightly) */}
                      <motion.div
                        animate={
                          reduced
                            ? undefined
                            : { rotate: [0, 6, -6, 0] }
                        }
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-br from-[#F43F5E] to-[#2DD4BF] mb-4 relative z-10"
                      >
                        <div className="w-full h-full rounded-2xl bg-[#09090B] flex items-center justify-center">
                          <img src={LOGO_URL} alt="Zavr" className="w-10 h-10" />
                        </div>
                      </motion.div>

                      <p className="text-white font-bold mb-2 relative z-10">Your Savings</p>
                      <p className="text-3xl font-black text-white mb-6 relative z-10">
                        <AnimatedCounter to={4280} prefix="$" />
                      </p>

                      <div className="space-y-2 w-full relative z-10">
                        <div className="h-2 rounded-full bg-white/5 w-full overflow-hidden relative">
                          {/* Progress fill */}
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={isInView ? { width: '68%' } : {}}
                            transition={{ delay: 1.4, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full bg-gradient-to-r from-[#F43F5E] to-[#EE5253] relative overflow-hidden"
                          >
                            {/* Shimmer pass */}
                            {!reduced && (
                              <div
                                aria-hidden
                                className="absolute inset-y-0 -left-full w-1/2"
                                style={{
                                  background:
                                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
                                  animation: 'shimmer-progress 2.4s ease-in-out 1.8s infinite',
                                }}
                              />
                            )}
                          </motion.div>
                        </div>
                        <motion.p
                          initial={reduced ? false : { opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : {}}
                          transition={{ delay: 2.2, duration: 0.6 }}
                          className="text-xs text-white/40 text-center"
                        >
                          68% of monthly goal
                        </motion.p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURES SECTION
// ─────────────────────────────────────────────────────────────────────────────

function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const colorMap: Record<string, { bg: string; text: string; glow: 'coral' | 'teal' | 'gold' }> = {
    coral: { bg: 'bg-rose-500/15', text: 'text-rose-400', glow: 'coral' },
    teal: { bg: 'bg-teal-500/15', text: 'text-teal-400', glow: 'teal' },
    gold: { bg: 'bg-amber-500/15', text: 'text-amber-400', glow: 'gold' },
  };

  return (
    <section id="features" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 text-xs font-bold uppercase tracking-widest">
            <Zap className="w-4 h-4 text-amber-400" />
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-[#F43F5E] to-[#EE5253] bg-clip-text text-transparent">Save Successfully</span>
          </h2>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto">
            Powerful tools wrapped in a beautiful, motivating design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
            >
              <GlassCard className="p-7 h-full" glow={colorMap[feature.color].glow}>
                <div className={`w-12 h-12 rounded-xl ${colorMap[feature.color].bg} flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-6 h-6 ${colorMap[feature.color].text}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS SECTION
// ─────────────────────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    { num: '01', title: 'Create a Goal', desc: 'Set your target amount, deadline, and category.' },
    { num: '02', title: 'Track Progress', desc: 'Log contributions and watch your progress grow.' },
    { num: '03', title: 'Build Streaks', desc: 'Save daily to maintain your streak and earn badges.' },
    { num: '04', title: 'Celebrate', desc: 'Achieve your goal and share your success!' },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 text-xs font-bold uppercase tracking-widest">
            How Zavr Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6">
            Simple Steps to
            <br />
            <span className="bg-gradient-to-r from-[#2DD4BF] to-[#14B8A6] bg-clip-text text-transparent">Financial Freedom</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              className="relative"
            >
              <GlassCard className="p-6 text-center h-full" glow="teal">
                <span className="text-4xl font-black bg-gradient-to-br from-[#F43F5E] to-[#2DD4BF] bg-clip-text text-transparent mb-4 block">
                  {step.num}
                </span>
                <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-white/50">{step.desc}</p>
              </GlassCard>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-white/20">
                  <ChevronRight className="w-6 h-6" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GOAL IDEAS SECTION
// ─────────────────────────────────────────────────────────────────────────────

function GoalIdeasSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Goal Ideas
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6">
            What Can You
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">Save For?</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GOAL_IDEAS.map((idea, i) => (
            <motion.div
              key={idea.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
            >
              <GlassCard className="p-6 h-full" glow="gold">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${idea.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <idea.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{idea.title}</h4>
                <p className="text-sm text-white/50">{idea.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI ASSISTANT SECTION
// ─────────────────────────────────────────────────────────────────────────────

function AISection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest">
              <Bot className="w-4 h-4" />
              Meet Zettl
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Your Personal
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">AI Savings Coach</span>
            </h2>
            <p className="text-base sm:text-lg text-white/50 mb-8 leading-relaxed">
              Zettl analyzes your spending patterns, suggests personalized goals,
              and keeps you motivated with timely insights and encouragement.
            </p>
            <div className="space-y-4">
              {[
                'Smart budget recommendations',
                'Personalized goal suggestions',
                'Motivational insights',
                '24/7 availability',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-violet-400" />
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <GlassCard className="p-6" glow="none">
              <div className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-violet-500/10">
                <Bot className="w-6 h-6 text-violet-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Based on your spending patterns, I suggest setting aside
                    <span className="text-violet-400 font-semibold"> $150/week </span>
                    for your vacation fund. You'll reach your goal by August!
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { q: 'How do I start investing?', a: 'Let\'s build your emergency fund first...' },
                  { q: 'Why is my streak broken?', a: 'You missed a contribution on Tuesday...' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <MessageCircle className="w-5 h-5 text-white/30 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-white/40 mb-1">{item.q}</p>
                      <p className="text-xs text-white/60">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY SECTION
// ─────────────────────────────────────────────────────────────────────────────

function SecuritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    { icon: Lock, title: 'End-to-End Encryption', desc: 'Your financial data is encrypted at rest and in transit.' },
    { icon: Shield, title: 'Row-Level Security', desc: 'Supabase RLS ensures your data is only accessible by you.' },
    { icon: Globe, title: 'No Bank Connections', desc: 'We never ask for bank credentials. Your privacy, protected.' },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            Security
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6">
            Your Data.
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Your Control.</span>
          </h2>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto">
            Bank-grade security without the bank. Your financial data stays private.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            >
              <GlassCard className="p-6 sm:p-8 text-center h-full" glow="teal">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/15 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-teal-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-white/50">{item.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ SECTION
// ─────────────────────────────────────────────────────────────────────────────

function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 text-xs font-bold uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Common Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3"
        >
          {FAQS.map((faq, i) => (
            <GlassCard
              key={i}
              className="overflow-hidden"
              hover={false}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="p-5 cursor-pointer flex items-center justify-between">
                <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  className="text-white/40 text-xl flex-shrink-0"
                >
                  +
                </motion.span>
              </div>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA SECTION
// ─────────────────────────────────────────────────────────────────────────────

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-6 sm:p-8 md:p-16 text-center relative overflow-visible">
            {/* Glow behind */}
            <div className="absolute inset-x-0 -top-20 h-20 sm:h-40 blur-[60px] sm:blur-[100px] opacity-30 bg-gradient-to-r from-[#F43F5E] via-[#2DD4BF] to-[#F59E0B]" />

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Start Saving
              <br />
              <span className="bg-gradient-to-r from-[#F43F5E] to-[#EE5253] bg-clip-text text-transparent">Today</span>
            </h2>
            <p className="text-base sm:text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Join 50,000+ savers achieving their financial goals with Zavr.
              No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <span className="inline-flex items-center gap-2 px-10 py-4 text-base font-bold text-teal-200 bg-teal-500/10 border border-teal-500/30 rounded-2xl shadow-[0_8px_30px_rgba(45,212,191,0.2)]">
                <Sparkles className="w-5 h-5" />
                Coming Soon
              </span>
              <a
                href="#features"
                className="px-10 py-4 text-base font-semibold text-white/70 border border-white/10 rounded-2xl hover:bg-white/[0.03] transition-all"
              >
                Learn More
              </a>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUOTES & THOUGHTS — small rotating savings wisdom
// ─────────────────────────────────────────────────────────────────────────────

const SAVINGS_THOUGHTS = [
  { quote: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { quote: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
  { quote: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { quote: "The art is not in making money, but in keeping it.", author: "Proverb" },
  { quote: "Small amounts saved daily add up to huge investments in the end.", author: "Margo Vader" },
  { quote: "Beware of little expenses; a small leak will sink a great ship.", author: "Benjamin Franklin" },
  { quote: "Saving is the best feeling in the world when you see it grow.", author: "Zavr" },
  { quote: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make.", author: "Dave Ramsey" },
];

function QuotesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % SAVINGS_THOUGHTS.length);
    }, 5000);
    return () => clearInterval(id);
  }, [reduced]);

  const current = SAVINGS_THOUGHTS[idx];

  return (
    <section ref={ref} className="relative py-20 md:py-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest">
            <Quote className="w-3.5 h-3.5" />
            Thoughts on Saving
          </span>

          <div className="relative min-h-[180px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={idx}
                initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduced ? undefined : { opacity: 0, y: -24, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 leading-snug max-w-3xl mb-4">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <cite className="text-sm not-italic text-teal-300/80 font-medium">
                  — {current.author}
                </cite>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {SAVINGS_THOUGHTS.map((_, i) => (
              <button
                key={i}
                aria-label={`Show quote ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === idx ? 'w-8 bg-teal-400' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-br from-[#F43F5E] to-[#2DD4BF]">
                <div className="w-full h-full rounded-xl bg-[#09090B] flex items-center justify-center p-1.5">
                  <img src={LOGO_URL} alt="Zavr" className="w-full h-full object-contain" />
                </div>
              </div>
              <span className="text-lg font-bold text-white">Zavr</span>
            </div>
            <p className="text-sm text-white/40 max-w-xs mb-6">
              Save smarter, together. Beautiful design meets powerful savings tools.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: SOCIAL_LINKS.instagram, color: 'hover:text-[#E4405F]' },
                { icon: Linkedin, href: SOCIAL_LINKS.linkedin, color: 'hover:text-[#0A66C2]' },
                { icon: Mail, href: SOCIAL_LINKS.email, color: 'hover:text-teal-400' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 ${social.color} hover:bg-white/[0.08] transition-all`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Changelog', 'Roadmap', 'Open Source'].map((item) => (
                <li key={item}>
                  <a href="#features" className="text-sm text-white/50 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-sm text-white/50 hover:text-white transition-colors">About</a></li>
              <li><Link to="/founders" className="text-sm text-white/50 hover:text-white transition-colors">Meet the Founders</Link></li>
              <li><Link to="/privacy-policy" className="text-sm text-white/50 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-white/50 hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
              <li><a href="#contact" className="text-sm text-white/50 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-white/25">© 2024 Zavr. All rights reserved.</p>
          <p className="text-xs text-white/25 flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> for savers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-x-hidden">
      <AnimatedBackground />
      <Navigation />
      <main className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <GoalIdeasSection />
        <AISection />
        <SecuritySection />
        <FAQSection />
        <CTASection />
        <QuotesSection />
      </main>
      <Footer />
    </div>
  );
}
