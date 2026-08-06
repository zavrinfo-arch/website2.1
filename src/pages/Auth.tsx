import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import {
  Mail, Lock, User, Phone, Calendar, MapPin,
  CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight, AtSign,
  ShieldCheck, KeyRound, Sparkles, Loader2, Sun, Moon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { differenceInYears, parseISO, format } from 'date-fns';
import { AVATARS } from '../constants';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const navigate = useNavigate();
  const { currentUser, session, theme, setTheme, loginAsDemo } = useStore();

  useEffect(() => {
    if (session && currentUser) {
      if (currentUser.onboardingCompleted) {
        navigate('/home', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [session, currentUser, navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    phone: '',
    dob: '',
    location: '',
    password: '',
    confirmPassword: '',
  });

  const handleDemoLogin = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    loginAsDemo();
    toast.success('Welcome to Zavr! (Demo Mode)');
    setLoading(false);
    navigate('/home', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await handleDemoLogin();
    } else {
      // Signup - also just logs in as demo
      if (!formData.email || !formData.password) {
        toast.error('Please fill all fields');
        return;
      }
      await handleDemoLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-coral/5 via-transparent to-teal/5 pointer-events-none" />

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="absolute top-4 right-4 p-3 rounded-xl clay"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-coral to-coral/70 mb-4"
          >
            <span className="text-3xl font-black text-white">Z</span>
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm opacity-60 mt-1">
            {isLogin ? 'Sign in to continue your journey' : 'Start your savings journey today'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="clay p-8 rounded-3xl">
          {/* Demo Mode Banner */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-coral/10 to-teal/10 border border-coral/20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-coral" />
              <div>
                <p className="text-sm font-bold">Demo Mode</p>
                <p className="text-xs opacity-60">Click any button to explore with sample data</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-4">Full Name</label>
                  <div className="flex items-center clay-inset rounded-xl px-4 py-3">
                    <User className="w-4 h-4 opacity-40 mr-3" />
                    <input
                      type="text"
                      placeholder="Your name"
                      className="bg-transparent outline-none flex-1 text-sm"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-4">Email</label>
              <div className="flex items-center clay-inset rounded-xl px-4 py-3">
                <Mail className="w-4 h-4 opacity-40 mr-3" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="bg-transparent outline-none flex-1 text-sm"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-4">Password</label>
              <div className="flex items-center clay-inset rounded-xl px-4 py-3">
                <Lock className="w-4 h-4 opacity-40 mr-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="bg-transparent outline-none flex-1 text-sm"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="opacity-40 hover:opacity-100"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 mt-6 clay-coral text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="text-coral font-bold">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-6 text-center">
          <p className="text-xs opacity-40">
            No setup required - Just click to explore!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
