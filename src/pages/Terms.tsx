import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Sparkles } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Acceptance',
    body: [
      'By accessing or using ZAVR, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you should not use the application or its services.',
      'We may update these terms from time to time. Continued use of ZAVR after changes are posted constitutes your acceptance of the revised terms.',
    ],
  },
  {
    title: 'Eligibility',
    body: [
      'You must be at least 18 years old to create an account and use ZAVR. By registering, you confirm that you meet this age requirement and are legally capable of entering into a binding agreement.',
      'Users must provide accurate and truthful information during the registration process. Providing false or misleading information may result in account suspension or termination.',
    ],
  },
  {
    title: 'User Accounts',
    body: [
      'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately if you suspect any unauthorized access.',
      'Each user may maintain only one account. Creating multiple accounts or sharing account credentials with others is prohibited and may result in loss of access to the platform.',
    ],
  },
  {
    title: 'Saving Goals',
    body: [
      'ZAVR allows you to create personal savings goals, participate in group savings, and build emergency funds. The platform provides tools for tracking progress, setting deadlines, and receiving motivational reminders.',
      'ZAVR is a planning and tracking tool. It does not hold, transfer, or manage actual funds on your behalf. You are solely responsible for executing your savings independently of the application.',
    ],
  },
  {
    title: 'User Responsibilities',
    body: [
      'You agree to use ZAVR lawfully and respectfully. You shall not misuse the platform, introduce harmful code, attempt to gain unauthorized access, or interfere with the proper functioning of the service.',
      'You are responsible for the accuracy of the financial information you input. ZAVR is not liable for decisions made based on the insights or reminders provided by the application.',
    ],
  },
  {
    title: 'Privacy',
    body: [
      'Your use of ZAVR is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. Please review our Privacy Policy to understand our data practices.',
    ],
  },
  {
    title: 'Intellectual Property',
    body: [
      'All content, features, and functionality of ZAVR, including but not limited to text, graphics, logos, designs, and software, are the exclusive property of ZAVR and are protected by intellectual property laws.',
      'You may not copy, reproduce, distribute, or create derivative works from any part of the application without prior written consent from us.',
    ],
  },
  {
    title: 'Limitation of Liability',
    body: [
      'ZAVR is provided on an "as is" and "as available" basis. We do not warrant that the application will be uninterrupted, error-free, or completely secure. To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages.',
      'We are not responsible for any financial losses or decisions made based on the information provided by the application. ZAVR is a supplementary tool and does not constitute professional financial advice.',
    ],
  },
  {
    title: 'Termination',
    body: [
      'We reserve the right to suspend or terminate your account if you violate these Terms & Conditions or engage in any conduct that we determine to be harmful to the platform or other users.',
      'You may choose to stop using ZAVR at any time. Upon account closure, your personal data will be handled in accordance with our Privacy Policy and applicable data protection regulations.',
    ],
  },
  {
    title: 'Contact',
    body: [
      'For any questions, concerns, or notices regarding these Terms & Conditions, please contact us at support@zavr.app. We are committed to addressing your inquiries promptly and professionally.',
    ],
  },
];

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-white overflow-hidden relative">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] bg-[#F43F5E]/[0.07] rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] sm:w-[375px] sm:h-[375px] md:w-[500px] md:h-[500px] bg-[#2DD4BF]/[0.07] rounded-full blur-[80px] sm:blur-[120px]" />
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
            <FileText className="w-4 h-4 text-[#F43F5E]" />
            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1]"
          >
            Terms &{' '}
            <span className="bg-gradient-to-r from-[#F43F5E] via-[#2DD4BF] to-[#F59E0B] bg-clip-text text-transparent">
              Conditions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto"
          >
            The rules and expectations for using ZAVR. Please read them carefully.
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

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-8 relative overflow-hidden bg-gradient-to-br from-[#F43F5E]/10 to-[#2DD4BF]/10 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 md:p-10 text-center"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Have questions about these terms?</h3>
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
