/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AVATARS_50 } from '../constants/avatars';
import { cn } from '../lib/utils';
import { Check, ArrowRight, ArrowLeft, Loader2, Sparkles, User, Palette, Camera, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const STYLE_LABELS = {
  'gen-z': { label: 'Gen-Z Modern', icon: Sparkles, color: 'text-purple-500' },
  'classic': { label: 'Classic Premium', icon: User, color: 'text-blue-500' },
  'bw': { label: 'B&W Artistic', icon: Camera, color: 'text-gray-500' },
  'minimal': { label: 'Minimalist', icon: Palette, color: 'text-teal-500' },
};

export default function AvatarSelection() {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(currentUser?.avatarId?.toString() || '1');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'gen-z' | 'classic' | 'bw' | 'minimal'>('gen-z');

  useEffect(() => {
    if (currentUser?.avatarId) {
      setSelectedId(currentUser.avatarId.toString());
    }
  }, [currentUser]);

  const saveAvatar = async () => {
    if (!selectedId) {
      toast.error('Please select an avatar');
      return;
    }

    setLoading(true);
    try {
      const selectedAvatar = AVATARS_50.find(a => a.id === selectedId);
      if (!selectedAvatar) throw new Error('Invalid avatar selection');

      updateUser({
        avatar: selectedAvatar.url,
        avatarId: selectedId as any,
        onboardingCompleted: true,
      });

      toast.success('Your character is ready!');

      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 800);
    } catch (err: any) {
      console.error('Save failed:', err);
      toast.error('Sync failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAvatars = AVATARS_50.filter(a => a.style === activeTab);

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-coral to-teal mb-4"
        >
          <Palette className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-2xl font-black">Choose Your Avatar</h1>
        <p className="text-sm opacity-60">Select a character that represents you</p>
      </div>

      {/* Style Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(STYLE_LABELS).map(([key, value]) => {
          const Icon = value.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeTab === key
                  ? "bg-coral text-white"
                  : "clay opacity-60 hover:opacity-100"
              )}
            >
              <Icon className="w-4 h-4" />
              {value.label}
            </button>
          );
        })}
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 flex-1">
        {filteredAvatars.map((avatar) => (
          <motion.button
            key={avatar.id}
            onClick={() => setSelectedId(avatar.id)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "aspect-square rounded-2xl overflow-hidden transition-all relative",
              selectedId === avatar.id
                ? "ring-2 ring-coral scale-105"
                : "opacity-60 hover:opacity-100"
            )}
          >
            <div className="w-full h-full bg-gradient-to-br from-coral/30 to-teal/30 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            {selectedId === avatar.id && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-coral flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={saveAvatar}
          disabled={loading || !selectedId}
          className="w-full py-4 clay-coral text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Continue <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full py-3 clay rounded-xl font-medium flex items-center justify-center gap-2 opacity-60"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    </div>
  );
}
