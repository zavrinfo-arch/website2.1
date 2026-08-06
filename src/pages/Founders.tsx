import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight,
  Lightbulb, ShieldCheck, Lock, Eye, Users, TrendingUp,
  CheckCircle2,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const FASEEH_IMG = '/images/founders/Gemini_Generated_Image_6nny3r6nny3r6nny-Photoroom.png';
const SALMAN_IMG = '/images/founders/Gemini_Generated_Image_t34yb5t34yb5t34y-Photoroom_(1).png';
const UFAID_IMG  = '/images/founders/Gemini_Generated_Image_fw324ifw324ifw32-Photoroom.png';

const VALUES = [
  { icon: Lightbulb,   title: 'Innovation',    color: '#F59E0B' },
  { icon: ShieldCheck, title: 'Trust',         color: '#2DD4BF' },
  { icon: Lock,        title: 'Security',      color: '#F43F5E' },
  { icon: Eye,         title: 'Transparency',  color: '#3B82F6' },
  { icon: Users,       title: 'Community',     color: '#8B5CF6' },
  { icon: TrendingUp,  title: 'Growth',        color: '#2DD4BF' },
];

const ROADMAP = [
  { label: 'Idea',        done: true  },
  { label: 'Research',    done: true  },
  { label: 'Design',      done: true  },
  { label: 'Development', done: true  },
  { label: 'Coming Soon', done: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] ${className}`}>
      {children}
    </div>
  );
}

function HighlightChip({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.09] rounded-xl backdrop-blur-sm">
      <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0" />
      <span className="text-sm font-semibold text-white/80">{label}</span>
    </div>
  );
}

interface FounderImageProps {
  src: string;
  alt: string;
  glowColor?: string;
}

function FounderImage({ src, alt, glowColor = '#2DD4BF' }: FounderImageProps) {
  return (
    <div className="relative flex items-start justify-center h-[400px] sm:h-[520px] md:h-[640px]">
      {/* Glass blur circle behind */}
      <div
        className="absolute top-12 sm:top-16 left-1/2 -translate-x-1/2 w-56 h-56 sm:w-72 sm:h-72 rounded-full blur-[60px] sm:blur-[80px] opacity-30"
        style={{ background: glowColor }}
      />
      {/* Soft ambient ring */}
      <div
        className="absolute top-16 sm:top-24 left-1/2 -translate-x-1/2 w-44 h-44 sm:w-56 sm:h-56 rounded-full blur-[30px] sm:blur-[40px] opacity-20"
        style={{ background: glowColor }}
      />
      {/* Image — upper body only, legs fade out */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="relative z-10 h-full max-h-[400px] sm:max-h-[520px] md:max-h-[640px] w-auto object-contain object-top drop-shadow-2xl select-none"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 92%)',
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 92%)',
        }}
      />
    </div>
  );
}

interface SectionDividerProps { flip?: boolean }
function SectionDivider({ flip }: SectionDividerProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
      <div className={`h-px w-full bg-gradient-to-r ${flip ? 'from-transparent via-[#F43F5E]/30 to-transparent' : 'from-transparent via-[#2DD4BF]/30 to-transparent'}`} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-br from-[#F43F5E] to-[#2DD4BF]">
            <div className="w-full h-full rounded-xl bg-[#09090B] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
            </div>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Zavr</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Home',     href: '/',          isRoute: true  },
            { label: 'Features', href: '/#features', isRoute: false },
            { label: 'About',    href: '/#about',    isRoute: false },
            { label: 'Contact',  href: '/#contact',  isRoute: false },
          ].map((item) =>
            item.isRoute ? (
              <Link key={item.label} to={item.href} className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#F43F5E] to-[#2DD4BF] group-hover:w-full transition-all duration-300" />
              </Link>
            ) : (
              <a key={item.label} href={item.href} className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#F43F5E] to-[#2DD4BF] group-hover:w-full transition-all duration-300" />
              </a>
            )
          )}
          <span className="text-sm font-bold text-white border-b border-[#2DD4BF] pb-0.5">Founders</span>
        </div>

        <span className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-300 bg-teal-500/10 border border-teal-500/25 rounded-xl">
          <Sparkles className="w-4 h-4" />
          Coming Soon
        </span>
      </nav>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative pt-32 sm:pt-44 pb-24 px-4 sm:px-6 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] bg-[#2DD4BF]/[0.06] blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] sm:w-[450px] sm:h-[225px] md:w-[600px] md:h-[300px] bg-[#F43F5E]/[0.05] blur-[70px] sm:blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <Users className="w-4 h-4 text-[#2DD4BF]" />
          <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Our Team</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6">
          Meet the{' '}
          <span className="bg-gradient-to-r from-[#F43F5E] via-[#2DD4BF] to-[#F59E0B] bg-clip-text text-transparent">
            Founders
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl font-semibold text-white/70 mb-5">
          Building the Future of Smart Saving
        </p>

        <p className="text-sm sm:text-base md:text-lg text-white/45 max-w-2xl mx-auto leading-relaxed mb-12">
          Behind ZAVR is a passionate team committed to transforming the way people save, plan, and achieve their financial goals. Combining innovation, technology, and trust, we are building a modern financial platform designed for the next generation.
        </p>

        <a
          href="#faseeh"
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-teal-200 bg-teal-500/10 border border-teal-500/30 rounded-2xl shadow-[0_8px_30px_rgba(45,212,191,0.2)] hover:bg-teal-500/15 hover:shadow-[0_8px_40px_rgba(45,212,191,0.3)] transition-all duration-300"
        >
          Explore Our Story <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOUNDER SECTION — FASEEH (Image left, text right)
// ─────────────────────────────────────────────────────────────────────────────

function FaseehSection() {
  const highlights = ['Product Vision', 'Business Strategy', 'Leadership', 'Innovation', 'Financial Planning'];

  return (
    <section id="faseeh" className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div>
            <FounderImage src={FASEEH_IMG} alt="Faseeh Musthafa" glowColor="#2DD4BF" />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F43F5E]/10 border border-[#F43F5E]/20 text-[#F43F5E] text-xs font-bold uppercase tracking-widest w-fit">
              Founder
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              Faseeh{' '}
              <span className="bg-gradient-to-r from-[#F43F5E] to-[#F59E0B] bg-clip-text text-transparent">
                Musthafa
              </span>
            </h2>

            <p className="text-base md:text-lg text-white/55 leading-relaxed">
              Founder of ZAVR, leading the vision, innovation, and long-term strategy behind the platform. Passionate about creating a smarter, more accessible future for financial savings through technology and simplicity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {highlights.map((h) => (
                <HighlightChip key={h} label={h} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOUNDER SECTION — SALMAN (Text left, image right)
// ─────────────────────────────────────────────────────────────────────────────

function SalmanSection() {
  const highlights = ['Operations', 'Project Planning', 'Product Execution', 'Team Collaboration', 'Business Growth'];

  return (
    <section id="salman" className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Content — left on desktop, second on mobile */}
          <div className="flex flex-col gap-6 order-2 md:order-1">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] text-xs font-bold uppercase tracking-widest w-fit">
              Co-Founder
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              Salman{' '}
              <span className="bg-gradient-to-r from-[#2DD4BF] to-[#3B82F6] bg-clip-text text-transparent">
                Fayis
              </span>
            </h2>

            <p className="text-base md:text-lg text-white/55 leading-relaxed">
              Co-Founder of ZAVR, responsible for operations, execution, planning, and transforming ideas into real-world experiences while ensuring the highest quality across the platform.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {highlights.map((h) => (
                <HighlightChip key={h} label={h} />
              ))}
            </div>
          </div>

          {/* Image — right on desktop, first on mobile */}
          <div className="order-1 md:order-2">
            <FounderImage src={SALMAN_IMG} alt="Salman Fayis" glowColor="#2DD4BF" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOUNDER SECTION — UFAID (Image left, text right)
// ─────────────────────────────────────────────────────────────────────────────

function UfaidSection() {
  const highlights = ['UI / UX', 'App Development', 'Backend', 'Cyber Security', 'Database Architecture'];

  return (
    <section id="ufaid" className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div>
            <FounderImage src={UFAID_IMG} alt="Ufaid" glowColor="#F43F5E" />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F43F5E]/10 border border-[#F43F5E]/20 text-[#F43F5E] text-xs font-bold uppercase tracking-widest w-fit">
              Co-Founder
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              <span className="bg-gradient-to-r from-[#F43F5E] to-[#2DD4BF] bg-clip-text text-transparent">
                Ufaid
              </span>
            </h2>

            <p className="text-base md:text-lg text-white/55 leading-relaxed">
              Co-Founder of ZAVR, leading application development, backend architecture, cybersecurity, infrastructure, database systems, and user experience. Focused on building a secure, scalable, and reliable platform for every future user.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {highlights.map((h) => (
                <HighlightChip key={h} label={h} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MISSION & VISION
// ─────────────────────────────────────────────────────────────────────────────

function MissionVisionSection() {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Mission */}
        <GlassCard className="p-6 sm:p-8 md:p-10 h-full">
          <div className="w-12 h-12 rounded-2xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center mb-6">
            <TrendingUp className="w-6 h-6 text-[#2DD4BF]" />
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4">Our Mission</h3>
          <p className="text-sm sm:text-base text-white/55 leading-relaxed">
            Our mission is to empower everyone with intelligent financial tools that make saving simple, enjoyable, and achievable. We believe technology should help people build stronger financial habits and reach their dreams with confidence.
          </p>
        </GlassCard>

        {/* Vision */}
        <GlassCard className="p-6 sm:p-8 md:p-10 h-full">
          <div className="w-12 h-12 rounded-2xl bg-[#F43F5E]/10 border border-[#F43F5E]/20 flex items-center justify-center mb-6">
            <Eye className="w-6 h-6 text-[#F43F5E]" />
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4">Our Vision</h3>
          <p className="text-sm sm:text-base text-white/55 leading-relaxed">
            To become one of the most trusted smart saving platforms by combining innovation, security, and simplicity into one seamless experience — empowering millions to take control of their financial future.
          </p>
        </GlassCard>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE VALUES
// ─────────────────────────────────────────────────────────────────────────────

function CoreValuesSection() {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4">Core Values</h2>
          <p className="text-white/45 max-w-xl mx-auto text-base">The principles guiding every decision we make.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="group">
              <GlassCard className="p-4 sm:p-6 md:p-8 text-center transition-shadow duration-500 group-hover:shadow-[0_0_40px_rgba(45,212,191,0.12)]">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 transition-all duration-300"
                  style={{ background: `${v.color}15`, border: `1px solid ${v.color}25` }}
                >
                  <v.icon className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110" style={{ color: v.color }} />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">{v.title}</h3>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE
// ─────────────────────────────────────────────────────────────────────────────

function TimelineSection() {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4">Our Roadmap</h2>
          <p className="text-white/45 text-base">The journey from idea to launch.</p>
        </div>

        <div className="relative flex flex-col items-center gap-0">
          {ROADMAP.map((step, i) => {
            const isLast = i === ROADMAP.length - 1;
            return (
              <div key={step.label} className="flex flex-col items-center w-full">
                {/* Node row */}
                <div className="flex items-center gap-4 w-full max-w-xs">
                  {/* Dot */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        isLast
                          ? 'border-[#2DD4BF] bg-[#2DD4BF]/30'
                          : 'border-[#F43F5E] bg-[#F43F5E]/20'
                      }`}
                    />
                    {/* Glow */}
                    <div
                      className={`absolute inset-0 rounded-full blur-[6px] ${
                        isLast ? 'bg-[#2DD4BF]/50' : 'bg-[#F43F5E]/40'
                      }`}
                    />
                  </div>

                  {/* Label card */}
                  <div className={`flex-1 px-6 py-3.5 rounded-xl backdrop-blur-xl border ${
                    isLast
                      ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/30'
                      : 'bg-white/[0.04] border-white/[0.08]'
                  }`}>
                    <span className={`font-bold text-sm ${isLast ? 'text-[#2DD4BF]' : 'text-white/70'}`}>
                      {step.label}
                    </span>
                  </div>
                </div>

                {/* Connecting line */}
                {!isLast && (
                  <div className="w-px h-10 bg-gradient-to-b from-[#F43F5E]/40 to-[#2DD4BF]/20 self-start ml-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#F43F5E]/[0.08] via-transparent to-[#2DD4BF]/[0.08] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 sm:p-12 md:p-20">
          {/* Glow orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 sm:w-64 sm:h-24 bg-[#2DD4BF]/15 blur-[60px] sm:blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 sm:w-64 sm:h-24 bg-[#F43F5E]/10 blur-[60px] sm:blur-[80px] rounded-full pointer-events-none" />

          <h2 className="relative text-xl sm:text-2xl md:text-4xl font-black text-white mb-6 leading-tight">
            Join us as we build the future of smart saving.
          </h2>
          <p className="relative text-sm sm:text-base text-white/45 max-w-xl mx-auto mb-10 leading-relaxed">
            ZAVR is currently under development. We are working hard to deliver a beautiful, secure, and intelligent financial experience.
          </p>
          <span className="relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-teal-200 bg-teal-500/10 border border-teal-500/30 rounded-2xl shadow-[0_8px_30px_rgba(45,212,191,0.2)]">
            <Sparkles className="w-5 h-5" />
            Coming Soon
          </span>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function Founders() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-white overflow-x-hidden">
      {/* Global ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] bg-[#2DD4BF]/[0.05] rounded-full blur-[100px] sm:blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-[#F43F5E]/[0.05] rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[200px] sm:w-[450px] sm:h-[300px] md:w-[600px] md:h-[400px] bg-[#F59E0B]/[0.04] rounded-full blur-[80px] sm:blur-[120px]" />
      </div>

      <Navigation />
      <HeroSection />

      <div className="relative z-10">
        <FaseehSection />
        <SectionDivider />
        <SalmanSection />
        <SectionDivider flip />
        <UfaidSection />
        <SectionDivider />
        <MissionVisionSection />
        <CoreValuesSection />
        <TimelineSection />
        <CTASection />
      </div>
    </div>
  );
}
