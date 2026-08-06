/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import {
  ArrowRight, ArrowLeft, Loader2, Plane, Laptop, Home,
  GraduationCap, Heart, ShieldAlert, ShoppingBag, TrendingUp,
  Check, Calendar, Phone, User, CheckCircle2, Sparkles,
  Trophy, Users, Landmark, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { AVATARS_50 } from '../constants/avatars';
import { NeoLuxuryStyles } from '../components/Onboarding/styles';

const SAVING_CATEGORIES_LIST = [
  { id: 'Travel', label: 'Travel', icon: Plane, description: 'Flights, hotels, and adventures' },
  { id: 'Tech', label: 'Tech', icon: Laptop, description: 'Gadgets, setups, and future gear' },
  { id: 'Home', label: 'Home', icon: Home, description: 'Rent, furniture, and cozy design' },
  { id: 'Education', label: 'Education', icon: GraduationCap, description: 'Courses, books, and career leaps' },
  { id: 'Health', label: 'Health', icon: Heart, description: 'Medical, fitness, and wellness care' },
  { id: 'Emergency', label: 'Emergency', icon: ShieldAlert, description: 'Rainy day funds and safety nets' },
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag, description: 'Fashion, lifestyle, and gifts' },
  { id: 'Investment', label: 'Investment', icon: TrendingUp, description: 'Stocks, crypto, and compounding wealth' },
];

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male', description: 'Identify as male' },
  { id: 'female', label: 'Female', description: 'Identify as female' },
  { id: 'non_binary', label: 'Non-Binary', description: 'Identify as non-binary' },
  { id: 'prefer_not_to_say', label: 'Prefer Not To Say', description: 'Keep selection private' },
  { id: 'other', label: 'Other', description: 'Other gender identifier' },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, updateUser } = useStore();

  const getSanitizedGender = (rawGender: string | undefined): string => {
    if (!rawGender) return 'prefer_not_to_say';
    const clean = rawGender.toLowerCase().trim().replace(/[- ]/g, '_');
    const isValid = GENDER_OPTIONS.some(opt => opt.id === clean);
    return isValid ? clean : 'prefer_not_to_say';
  };

  // Step 1: Personal Details State
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Demo User');
  const [username, setUsername] = useState(currentUser?.username || 'demouser');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 9876543210');
  const [dob, setDob] = useState(currentUser?.dob || '1995-06-15');
  const [gender, setGender] = useState(() => getSanitizedGender(currentUser?.gender));

  // Step 2: Avatar Selection State
  const [selectedAvatar, setSelectedAvatar] = useState(
    AVATARS_50.find(a => a.url === currentUser?.avatar) || AVATARS_50[0]
  );

  // Step 3: Saving Categories State
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    (currentUser as any)?.savingCategories || ['Emergency', 'Travel']
  );

  // Sync initial user details if loaded late
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.fullName || 'Demo User');
      if (!username) setUsername(currentUser.username || 'demouser');
      if (!phone) setPhone(currentUser.phone || '+91 9876543210');
      if (!dob) setDob(currentUser.dob || '1995-06-15');
    }
  }, [currentUser]);

  const handleNext = () => {
    if (step === 1) {
      if (!fullName.trim()) {
        toast.error('Please enter your name');
        return;
      }
      if (!username.trim()) {
        toast.error('Please enter a username');
        return;
      }
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    // Update user with all onboarding data
    updateUser({
      fullName,
      username,
      phone,
      dob,
      gender,
      avatar: selectedAvatar?.url || '',
      avatarId: selectedAvatar?.id || '',
      savingCategories: selectedCategories,
      onboardingCompleted: true,
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    toast.success('Welcome to Zavr!');
    setLoading(false);
    navigate('/home', { replace: true });
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-surface">
        <motion.div
          className="h-full bg-gradient-to-r from-coral to-teal"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 p-6 flex flex-col"
            >
              <div className="mb-6">
                <h1 className="text-2xl font-black mb-2">Let's get to know you</h1>
                <p className="opacity-60 text-sm">Tell us a bit about yourself</p>
              </div>

              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Full Name</label>
                  <div className="flex items-center clay-inset rounded-xl px-4 py-3">
                    <User className="w-4 h-4 opacity-40 mr-3" />
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="bg-transparent outline-none flex-1 text-sm"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Username</label>
                  <div className="flex items-center clay-inset rounded-xl px-4 py-3">
                    <span className="opacity-40 mr-1">@</span>
                    <input
                      type="text"
                      placeholder="username"
                      className="bg-transparent outline-none flex-1 text-sm"
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Phone Number</label>
                  <div className="flex items-center clay-inset rounded-xl px-4 py-3">
                    <Phone className="w-4 h-4 opacity-40 mr-3" />
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      className="bg-transparent outline-none flex-1 text-sm"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Date of Birth</label>
                  <div className="flex items-center clay-inset rounded-xl px-4 py-3">
                    <Calendar className="w-4 h-4 opacity-40 mr-3" />
                    <input
                      type="date"
                      className="bg-transparent outline-none flex-1 text-sm"
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Gender</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GENDER_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setGender(opt.id)}
                        className={cn(
                          "p-3 rounded-xl text-left text-sm transition-all",
                          gender === opt.id
                            ? "clay-coral text-white"
                            : "clay-inset opacity-60"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 p-6 flex flex-col"
            >
              <div className="mb-6">
                <h1 className="text-2xl font-black mb-2">Choose your avatar</h1>
                <p className="opacity-60 text-sm">Pick an avatar that represents you</p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {AVATARS_50.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={cn(
                      "aspect-square rounded-2xl overflow-hidden transition-all",
                      selectedAvatar?.id === avatar.id
                        ? "ring-2 ring-coral scale-105"
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-coral/50 to-teal/50 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 p-6 flex flex-col"
            >
              <div className="mb-6">
                <h1 className="text-2xl font-black mb-2">What are you saving for?</h1>
                <p className="opacity-60 text-sm">Select categories that interest you</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {SAVING_CATEGORIES_LIST.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      "p-4 rounded-2xl text-left transition-all",
                      selectedCategories.includes(cat.id)
                        ? "clay-coral text-white"
                        : "clay opacity-60"
                    )}
                  >
                    <cat.icon className="w-6 h-6 mb-2" />
                    <p className="font-bold text-sm">{cat.label}</p>
                    <p className={cn(
                      "text-[10px] mt-1",
                      selectedCategories.includes(cat.id) ? "opacity-80" : "opacity-60"
                    )}>
                      {cat.description}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 p-6 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-coral to-teal flex items-center justify-center mb-6"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>

              <h1 className="text-2xl font-black mb-2">You're all set!</h1>
              <p className="opacity-60 text-sm mb-4">
                Welcome to Zavr, {fullName}! Your savings journey begins now.
              </p>

              <div className="clay p-4 rounded-2xl w-full max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-bold">Profile Created</span>
                </div>
                <div className="text-left text-xs opacity-60 space-y-1">
                  <p>Username: @{username}</p>
                  <p>Categories: {selectedCategories.length} selected</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="p-6 space-y-3">
          {step < 4 ? (
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 py-4 clay rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 py-4 clay-coral text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full py-4 clay-coral text-white rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Start Saving <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          <p className="text-center text-xs opacity-40">
            Step {step} of {totalSteps}
          </p>
        </div>
      </div>
    </div>
  );
}
