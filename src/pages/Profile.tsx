/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { AVATARS_50 } from '../constants/avatars';
import { formatCurrency, cn } from '../lib/utils';
import {
  User, Settings, Bell, Globe,
  Download, LogOut, Flame, Trophy,
  CheckCircle2, Star, Shield, Zap,
  Camera, Clock, Calendar, X, Check, Lock,
  Sun, Moon
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const {
    currentUser, streakData, soloGoals,
    transactions, updateUser, signOut,
    theme, setTheme, session
  } = useStore();

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: currentUser?.fullName || '',
    username: currentUser?.username || '',
    location: currentUser?.location || '',
  });

  React.useEffect(() => {
    if (currentUser) {
      setEditData({
        fullName: currentUser.fullName || '',
        username: currentUser.username || '',
        location: currentUser.location || '',
      });
    }
  }, [currentUser]);

  const displayFullName = currentUser?.fullName?.trim() || 'Demo User';
  const displayUsername = currentUser?.username?.trim() || 'demouser';

  const handleSaveProfile = async () => {
    if (!editData.fullName || !editData.username) {
      toast.error('Please fill all fields');
      return;
    }

    updateUser({
      fullName: editData.fullName,
      username: editData.username,
      location: editData.location,
    });

    toast.success('Profile updated! (Demo mode - changes stored locally)');
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/');
  };

  const totalSaved = soloGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const goalsCompleted = soloGoals.filter(g => g.currentAmount >= g.targetAmount).length;

  const stats = [
    { label: 'Total Saved', value: formatCurrency(totalSaved, 'INR'), icon: Trophy, color: 'coral' },
    { label: 'Goals Completed', value: goalsCompleted.toString(), icon: CheckCircle2, color: 'teal' },
    { label: 'Current Streak', value: `${streakData.currentStreak} days`, icon: Flame, color: 'amber' },
    { label: 'Level', value: `Level ${currentUser?.level || 1}`, icon: Zap, color: 'purple' },
  ];

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {/* Avatar */}
        <div
          onClick={() => setIsAvatarModalOpen(true)}
          className="relative w-24 h-24 mx-auto mb-4 cursor-pointer group"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-coral to-teal flex items-center justify-center text-4xl font-black text-white">
            {displayFullName.charAt(0).toUpperCase()}
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-coral flex items-center justify-center border-2 border-background">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-black">{displayFullName}</h1>
        <p className="text-sm opacity-60">@{displayUsername}</p>

        {/* Level Badge */}
        <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gradient-to-r from-coral/20 to-teal/20">
          <Zap className="w-4 h-4 text-coral" />
          <span className="text-sm font-bold">Level {currentUser?.level || 1}</span>
          <span className="text-xs opacity-60">• {currentUser?.xp || 0} XP</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="clay p-4 rounded-2xl"
          >
            <stat.icon className={cn(
              "w-5 h-5 mb-2",
              stat.color === 'coral' && 'text-coral',
              stat.color === 'teal' && 'text-teal',
              stat.color === 'amber' && 'text-amber-500',
              stat.color === 'purple' && 'text-purple-500'
            )} />
            <p className="text-xl font-black">{stat.value}</p>
            <p className="text-[10px] uppercase tracking-widest opacity-40">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Edit Profile */}
      <div className="clay p-4 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold flex items-center gap-2">
            <User className="w-4 h-4" /> Profile Details
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "text-xs font-bold px-3 py-1 rounded-full transition-colors",
              isEditing ? "bg-coral text-white" : "clay-inset"
            )}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest opacity-40">Full Name</label>
              <input
                className="w-full clay-inset rounded-xl px-4 py-3 text-sm outline-none"
                value={editData.fullName}
                onChange={e => setEditData({ ...editData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest opacity-40">Username</label>
              <input
                className="w-full clay-inset rounded-xl px-4 py-3 text-sm outline-none"
                value={editData.username}
                onChange={e => setEditData({ ...editData, username: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest opacity-40">Location</label>
              <input
                className="w-full clay-inset rounded-xl px-4 py-3 text-sm outline-none"
                value={editData.location}
                onChange={e => setEditData({ ...editData, location: e.target.value })}
              />
            </div>
            <button
              onClick={handleSaveProfile}
              className="w-full py-3 clay-coral text-white rounded-xl font-bold mt-4"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="opacity-60">Email</span>
              <span>{currentUser?.email || 'demo@zavr.app'}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Location</span>
              <span>{currentUser?.location || 'Mumbai, India'}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Member Since</span>
              <span>{currentUser?.createdAt ? format(parseISO(currentUser.createdAt), 'MMM yyyy') : 'Jan 2024'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="clay p-4 rounded-2xl space-y-4">
        <h2 className="font-bold flex items-center gap-2">
          <Settings className="w-4 h-4" /> Settings
        </h2>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span>Dark Mode</span>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              theme === 'dark' ? 'bg-coral' : 'bg-gray-300'
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform",
              theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
            )} />
          </button>
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full py-4 clay rounded-2xl font-bold flex items-center justify-center gap-2 text-red-500"
      >
        <LogOut className="w-4 h-4" /> Sign Out (Demo Mode)
      </button>

      {/* Avatar Modal */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAvatarModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md clay rounded-t-3xl p-6 pb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Choose Avatar</h2>
                <button onClick={() => setIsAvatarModalOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {AVATARS_50.slice(0, 20).map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => {
                      updateUser({ avatar: avatar.url, avatarId: avatar.id });
                      setIsAvatarModalOpen(false);
                      toast.success('Avatar updated!');
                    }}
                    className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-coral transition-colors"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-coral to-teal flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-xs text-center opacity-40 mt-4">
                Demo mode - Avatars are placeholder visuals
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
