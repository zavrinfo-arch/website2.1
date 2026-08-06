import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Sparkles } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Introduction',
    body: [
      'ZAVR ("we", "us", or "our") is a fintech savings platform designed to help individuals and groups set, track, and achieve their financial goals. We are committed to protecting your privacy and safeguarding the personal information you share with us.',
      'This Privacy Policy explains how we collect, use, store, and protect your data when you use the ZAVR application and related services. By using ZAVR, you agree to the practices described in this policy.',
    ],
  },
  {
    title: 'Information We Collect',
    body: [
      'We collect information that you provide directly to us when you create an account, set up savings goals, or contact our support team. This may include your name, email address, phone number, and profile preferences.',
      'We also automatically collect certain technical data such as your device identifier, operating system, app usage statistics, and log information when you interact with ZAVR. This helps us improve performance, diagnose issues, and enhance security.',
    ],
  },
  {
    title: 'How We Use Information',
    body: [
      'We use your personal information to create and manage your account, display your savings progress, send goal reminders and motivational notifications, and provide AI-powered insights to help you save smarter.',
      'Additionally, we may use aggregated and anonymized data to analyze usage trends, improve our features, develop new capabilities, and ensure the overall security and integrity of the platform.',
    ],
  },
  {
    title: 'Data Protection',
    body: [
      'We employ industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes encryption in transit and at rest, secure authentication protocols, and regular security assessments.',
      'Access to your personal data is restricted to authorized personnel who require it to perform their job functions. Despite our best efforts, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    title: 'Cookies',
    body: [
      'ZAVR may use cookies and similar tracking technologies to enhance your experience, remember preferences, and analyze how you use our application. Cookies are small data files stored on your device that help us provide a more personalized and efficient service.',
      'You can choose to disable cookies through your browser or device settings. However, some features of ZAVR may not function properly if cookies are disabled.',
    ],
  },
  {
    title: 'Third-Party Services',
    body: [
      'We may engage trusted third-party service providers to support our operations, such as cloud hosting, analytics, authentication, and customer communications. These providers have access to your information only to perform specific tasks on our behalf and are obligated to protect your data.',
      'We do not sell, rent, or trade your personal information to third parties for marketing purposes. Any data shared with service providers is governed by strict confidentiality and data protection agreements.',
    ],
  },
  {
    title: 'User Rights',
    body: [
      'You have the right to access, update, or delete your personal information at any time through your account settings or by contacting our support team. You may also request a copy of the data we hold about you.',
      'If you wish to restrict or object to certain processing of your data, or if you believe your information is being used in a way that violates applicable privacy laws, you have the right to lodge a complaint with the relevant data protection authority.',
    ],
  },
  {
    title: 'Contact Information',
    body: [
      'If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out to our team at support@zavr.app. We are committed to responding to your inquiries in a timely and transparent manner.',
    ],
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-white overflow-hidden relative">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] bg-[#2DD4BF]/[0.07] rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] sm:w-[375px] sm:h-[375px] md:w-[500px] md:h-[500px] bg-[#F43F5E]/[0.07] rounded-full blur-[80px] sm:blur-[120px]" />
      </div>

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-br from-[#F43F5E] to-[#2DD4BF]">
              <div className="w-full h-full rounded-xl bg-[#09090B] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
              </div>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Zavr</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/[0.04] border border-white/[0.08]"
          >
            <Shield className="w-4 h-4 text-[#2DD4BF]" />
            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1]"
          >
            Privacy{' '}
            <span className="bg-gradient-to-r from-[#F43F5E] via-[#2DD4BF] to-[#F59E0B] bg-clip-text text-transparent">
              Policy
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto"
          >
            Your privacy matters to us. Learn how we collect, protect, and respect your personal data.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-white/30 mt-6 uppercase tracking-widest font-bold"
          >
            Last Updated: August 3, 2026
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="relative pb-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {SECTIONS.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="relative overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F43F5E]/20 to-[#2DD4BF]/20 border border-white/[0.08] flex items-center justify-center text-sm font-black text-white/60">
                    {i + 1}
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{section.title}</h2>
                </div>
                <div className="space-y-4 pl-11">
                  {section.body.map((para, j) => (
                    <p key={j} className="text-xs sm:text-sm md:text-base text-white/60 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-8 relative overflow-hidden bg-gradient-to-br from-[#F43F5E]/10 to-[#2DD4BF]/10 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 md:p-10 text-center"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Questions about your privacy?</h3>
            <p className="text-xs sm:text-sm text-white/50 mb-6">Reach out to us at support@zavr.app</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-teal-200 bg-teal-500/10 border border-teal-500/25 rounded-xl hover:bg-teal-500/15 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
