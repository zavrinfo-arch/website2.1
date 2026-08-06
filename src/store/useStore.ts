/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User, SoloGoal, GroupGoal, Transaction, Notification,
  WeeklyChallenge, StreakData, Badge, EmergencyGoal,
  Quest, FocusSession, Friend, ZettlGroup, PersonalZettl
} from '../types';
import { isSameDay, differenceInHours } from 'date-fns';

function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Mock user for demo
const mockUser: User = {
  id: 'demo-user-001',
  fullName: 'Demo User',
  username: 'demouser',
  email: 'demo@zavr.app',
  phone: '+91 9876543210',
  dob: '1995-06-15',
  gender: 'prefer-not-to-say',
  location: 'Mumbai, India',
  avatar: '',
  avatarId: 'avatar-1',
  onboardingCompleted: true,
  personalDetailsFilled: true,
  savingCategories: ['emergency', 'travel', 'gadgets'],
  interests: ['travel', 'technology'],
  xp: 2450,
  level: 12,
  badges: ['early-bird', 'streak-master', 'first-goal'],
  streak: 15,
  createdAt: new Date().toISOString(),
  lastLoginDate: new Date().toISOString(),
  streakFreezeCount: 2,
  preferences: {
    currency: 'INR',
    notificationsEnabled: true,
    reminders: { enabled: true, time: '20:00', frequency: 'daily' }
  }
};

// Mock goals
const mockSoloGoals: SoloGoal[] = [
  {
    id: 'goal-1',
    userId: 'demo-user-001',
    name: 'Emergency Fund',
    targetAmount: 50000,
    currentAmount: 23500,
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'emergency',
    createdAt: new Date().toISOString(),
    status: 'in-progress',
    icon: '🛡️'
  },
  {
    id: 'goal-2',
    userId: 'demo-user-001',
    name: 'Goa Trip',
    targetAmount: 25000,
    currentAmount: 18200,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'travel',
    createdAt: new Date().toISOString(),
    status: 'in-progress',
    icon: '🏖️'
  },
  {
    id: 'goal-3',
    userId: 'demo-user-001',
    name: 'New Laptop',
    targetAmount: 80000,
    currentAmount: 45000,
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'gadgets',
    createdAt: new Date().toISOString(),
    status: 'in-progress',
    icon: '💻'
  }
];

const mockGroupGoals: GroupGoal[] = [
  {
    id: 'group-1',
    name: 'Family Vacation Fund',
    targetAmount: 150000,
    currentAmount: 87500,
    deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'travel',
    createdAt: new Date().toISOString(),
    status: 'in-progress',
    adminId: 'demo-user-001',
    members: [
      { userId: 'demo-user-001', name: 'Demo User', contributed: 30000 },
      { userId: 'user-2', name: 'Priya S.', contributed: 27500 },
      { userId: 'user-3', name: 'Rahul M.', contributed: 30000 }
    ],
    password: undefined,
    icon: '✈️'
  }
];

const mockEmergencyGoals: EmergencyGoal[] = [
  {
    id: 'emergency-1',
    userId: 'demo-user-001',
    name: '6-Month Safety Net',
    targetAmount: 180000,
    currentAmount: 75000,
    deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    status: 'in-progress',
    monthlyIncome: 50000,
    expensesCovered: 1.5,
    icon: '🏦'
  }
];

const mockTransactions: Transaction[] = [
  { id: 'tx-1', goalId: 'goal-1', amount: 5000, type: 'contribution', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Weekly savings' },
  { id: 'tx-2', goalId: 'goal-2', amount: 3000, type: 'contribution', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), note: 'Travel fund' },
  { id: 'tx-3', goalId: 'goal-1', amount: 2500, type: 'contribution', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Emergency fund boost' },
  { id: 'tx-4', goalId: 'group-1', amount: 10000, type: 'contribution', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), note: 'Family trip contribution' },
  { id: 'tx-5', goalId: 'goal-3', amount: 8000, type: 'contribution', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), note: 'Laptop fund' },
];

const mockNotifications: Notification[] = [
  { id: 'notif-1', userId: 'demo-user-001', title: 'Streak Bonus!', message: 'You reached a 15-day streak! +150 XP', type: 'achievement', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), read: false },
  { id: 'notif-2', userId: 'demo-user-001', title: 'Goal Progress', message: 'Your Emergency Fund is 47% complete!', type: 'progress', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: 'notif-3', userId: 'demo-user-001', title: 'Weekly Summary', message: 'You saved ₹18,500 this week!', type: 'summary', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), read: true },
];

const mockFriends: Friend[] = [
  { id: 'friend-1', userId: 'user-2', name: 'Priya Sharma', username: 'priya.s', email: 'priya@example.com', avatar: '', status: 'accepted', balance: 1500 },
  { id: 'friend-2', userId: 'user-3', name: 'Rahul Mehta', username: 'rahul.m', email: 'rahul@example.com', avatar: '', status: 'accepted', balance: -800 },
  { id: 'friend-3', userId: 'user-4', name: 'Ananya Singh', username: 'ananya.s', email: 'ananya@example.com', avatar: '', status: 'pending' },
];

const mockPersonalZettls: PersonalZettl[] = [
  { id: 'zettl-1', friendId: 'user-2', friendName: 'Priya Sharma', amount: 1500, direction: 'borrowed', note: 'Dinner split', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending', createdAt: new Date().toISOString() },
  { id: 'zettl-2', friendId: 'user-3', friendName: 'Rahul Mehta', amount: 800, direction: 'lent', note: 'Movie tickets', dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending', createdAt: new Date().toISOString() },
];

const mockZettlGroups: ZettlGroup[] = [
  { id: 'zgroup-1', name: 'Roommates', members: ['demo-user-001', 'user-2', 'user-3'], totalBalance: 3200, createdAt: new Date().toISOString() },
];

interface AppState {
  users: User[];
  currentUser: User | null;
  session: any;
  soloGoals: SoloGoal[];
  groupGoals: GroupGoal[];
  emergencyGoals: EmergencyGoal[];
  transactions: Transaction[];
  notifications: Notification[];
  streakData: StreakData;
  weeklyChallenge: WeeklyChallenge | null;
  theme: 'light' | 'dark';
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  focusSessions: FocusSession[];
  isAuthLoading: boolean;

  // Zettl State
  zettlFriends: Friend[];
  zettlGroups: ZettlGroup[];
  personalZettls: PersonalZettl[];

  // Zettl Actions
  fetchZettlData: () => Promise<void>;
  searchZettlUsers: (query: string) => Promise<User[]>;
  sendFriendRequest: (friendId: string) => Promise<void>;
  sendFriendRequestByUsername: (username: string) => Promise<void>;
  respondToFriendRequest: (requestId: string, status: 'accepted' | 'declined') => Promise<void>;
  createZettlGroup: (name: string, memberIds: string[]) => Promise<void>;
  createPersonalZettl: (data: { friendId: string, amount: number, note: string, dueDate?: string, direction: 'lent' | 'borrowed' }) => Promise<void>;
  settleZettl: (id: string) => Promise<void>;
  remindZettl: (id: string) => Promise<void>;
  addGroupExpense: (data: { groupId: string, amount: number, description: string, splits: { userId: string, amountOwed: number }[] }) => Promise<void>;

  // Auth Actions
  setCurrentUser: (user: User | null) => void;
  setSession: (session: any) => void;
  addUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  checkAuth: (isInitial?: boolean, prefetchedProfile?: any) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => void;
  loginAsDemo: () => void;

  // Goal Actions
  addSoloGoal: (goal: SoloGoal) => void;
  updateSoloGoal: (id: string, updates: Partial<SoloGoal>) => void;
  deleteSoloGoal: (id: string) => void;
  addEmergencyGoal: (goal: EmergencyGoal) => void;
  updateEmergencyGoal: (id: string, updates: Partial<EmergencyGoal>) => void;
  deleteEmergencyGoal: (id: string) => void;
  addGroupGoal: (goal: GroupGoal) => void;
  updateGroupGoal: (id: string, updates: Partial<GroupGoal>) => void;
  deleteGroupGoal: (id: string) => Promise<void>;
  joinGroupGoal: (groupId: string, password?: string) => { success: boolean; message: string };
  leaveGroupGoal: (id: string) => Promise<void>;
  transferAdminRole: (goalId: string, userId: string) => Promise<void>;
  removeGroupMember: (goalId: string, userId: string) => void;

  // Transaction & Contribution
  addContribution: (goalId: string, amount: number, type: 'solo' | 'group' | 'emergency') => void;
  withdrawMoney: (goalId: string, amount: number, type: 'solo' | 'group' | 'emergency') => void;
  deleteTransaction: (id: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;

  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Streak & Badges
  checkStreak: () => void;

  // Weekly Challenge
  resetWeeklyChallenge: () => void;
  updateChallengeProgress: (amount: number) => void;

  // Reminders & Motivation
  checkReminders: () => void;
  triggerMotivation: () => void;
  refreshData: () => Promise<void>;
  nudgeGroup: (goalId: string) => void;
  clearGoalHistory: (goalId: string, type: 'solo' | 'group' | 'emergency') => Promise<void>;

  // Gaming Actions
  addXP: (amount: number) => void;
  updateQuestProgress: (questId: string, amount: number) => void;
  buyStreakFreeze: () => { success: boolean; message: string };
  startFocusSession: (type: 'study' | 'break', duration: number) => void;
  completeFocusSession: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: [mockUser],
      currentUser: mockUser,
      session: { user: { id: mockUser.id, email: mockUser.email } },
      soloGoals: mockSoloGoals,
      groupGoals: mockGroupGoals,
      emergencyGoals: mockEmergencyGoals,
      transactions: mockTransactions,
      notifications: mockNotifications,
      streakData: {
        currentStreak: 15,
        lastContributionDate: new Date().toISOString(),
        streakHistory: [],
        tier: 'Gold',
        multiplier: 2.0,
      },
      weeklyChallenge: {
        id: 'wc-1',
        title: 'Save ₹5,000 this week',
        target: 5000,
        progress: 3200,
        reward: 500,
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
      },
      theme: 'dark',
      dailyQuests: [
        { id: 'd1', title: 'Daily Login', description: 'Log in today', target: 1, progress: 1, rewardXP: 25, type: 'daily', completed: true },
        { id: 'd2', title: 'Bell Ringer', description: 'Click notification bell 3 times', target: 3, progress: 0, rewardXP: 15, type: 'daily', completed: false },
        { id: 'd3', title: 'Streak Check', description: 'Check your streak', target: 1, progress: 0, rewardXP: 10, type: 'daily', completed: false },
      ],
      weeklyQuests: [
        { id: 'w1', title: 'Goal Setter', description: 'Create a new goal', target: 1, progress: 0, rewardXP: 100, type: 'weekly', completed: false },
        { id: 'w2', title: 'First Contribution', description: 'Make your first contribution', target: 1, progress: 1, rewardXP: 50, type: 'weekly', completed: true },
      ],
      focusSessions: [],
      isAuthLoading: false,
      zettlFriends: mockFriends,
      zettlGroups: mockZettlGroups,
      personalZettls: mockPersonalZettls,

      // Zettl Actions (mock implementations)
      fetchZettlData: async () => {},
      searchZettlUsers: async (query: string) => {
        return mockFriends.filter(f =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.username.toLowerCase().includes(query.toLowerCase())
        ).map(f => ({
          id: f.userId,
          fullName: f.name,
          username: f.username,
          email: f.email,
          avatar: f.avatar || '',
          avatarId: '',
          onboardingCompleted: true,
          personalDetailsFilled: true,
          savingCategories: [],
          interests: [],
          xp: 0,
          level: 1,
          badges: [],
          streak: 0,
          createdAt: new Date().toISOString(),
          preferences: { currency: 'INR', notificationsEnabled: true, reminders: { enabled: true, time: '20:00', frequency: 'daily' } }
        }));
      },
      sendFriendRequest: async (friendId: string) => {},
      sendFriendRequestByUsername: async (username: string) => {},
      respondToFriendRequest: async (requestId: string, status: 'accepted' | 'declined') => {},
      createZettlGroup: async (name: string, memberIds: string[]) => {},
      createPersonalZettl: async (data: { friendId: string, amount: number, note: string, dueDate?: string, direction: 'lent' | 'borrowed' }) => {
        const friend = mockFriends.find(f => f.userId === data.friendId);
        if (friend) {
          set(state => ({
            personalZettls: [...state.personalZettls, {
              id: generateUUID(),
              friendId: data.friendId,
              friendName: friend.name,
              amount: data.amount,
              direction: data.direction,
              note: data.note,
              dueDate: data.dueDate,
              status: 'pending',
              createdAt: new Date().toISOString()
            }]
          }));
        }
      },
      settleZettl: async (id: string) => {
        set(state => ({
          personalZettls: state.personalZettls.map(z =>
            z.id === id ? { ...z, status: 'settled' } : z
          )
        }));
      },
      remindZettl: async (id: string) => {},
      addGroupExpense: async (data: any) => {},

      // Auth Actions
      setCurrentUser: (user) => set({ currentUser: user }),
      setSession: (session) => set({ session }),
      addUser: (user) => set(state => ({ users: [...state.users, user] })),
      updateUser: (updates) => set(state => ({
        currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null
      })),
      setTheme: (theme) => set({ theme }),
      checkAuth: async (isInitial = true, prefetchedProfile = null) => {
        set({ isAuthLoading: false, currentUser: mockUser, session: { user: { id: mockUser.id, email: mockUser.email } } });
      },
      signOut: async () => {
        set({ currentUser: mockUser, session: { user: { id: mockUser.id, email: mockUser.email } } });
      },
      initializeAuth: () => {
        set({ isAuthLoading: false, currentUser: mockUser, session: { user: { id: mockUser.id, email: mockUser.email } } });
      },
      loginAsDemo: () => {
        set({ isAuthLoading: false, currentUser: mockUser, session: { user: { id: mockUser.id, email: mockUser.email } } });
      },

      // Goal Actions
      addSoloGoal: (goal) => set(state => ({ soloGoals: [...state.soloGoals, goal] })),
      updateSoloGoal: (id, updates) => set(state => ({
        soloGoals: state.soloGoals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteSoloGoal: (id) => set(state => ({
        soloGoals: state.soloGoals.filter(g => g.id !== id)
      })),
      addEmergencyGoal: (goal) => set(state => ({ emergencyGoals: [...state.emergencyGoals, goal] })),
      updateEmergencyGoal: (id, updates) => set(state => ({
        emergencyGoals: state.emergencyGoals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteEmergencyGoal: (id) => set(state => ({
        emergencyGoals: state.emergencyGoals.filter(g => g.id !== id)
      })),
      addGroupGoal: (goal) => set(state => ({ groupGoals: [...state.groupGoals, goal] })),
      updateGroupGoal: (id, updates) => set(state => ({
        groupGoals: state.groupGoals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteGroupGoal: async (id) => set(state => ({
        groupGoals: state.groupGoals.filter(g => g.id !== id)
      })),
      joinGroupGoal: (groupId, password) => ({ success: true, message: 'Joined successfully' }),
      leaveGroupGoal: async (id) => {},
      transferAdminRole: async (goalId, userId) => {},
      removeGroupMember: (goalId, userId) => {},

      // Transaction Actions
      addContribution: (goalId, amount, type) => {
        const tx: Transaction = {
          id: generateUUID(),
          goalId,
          amount,
          type: 'contribution',
          date: new Date().toISOString(),
          note: 'Manual contribution'
        };
        set(state => {
          let newSoloGoals = state.soloGoals;
          let newGroupGoals = state.groupGoals;
          let newEmergencyGoals = state.emergencyGoals;

          if (type === 'solo') {
            newSoloGoals = state.soloGoals.map(g =>
              g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
            );
          } else if (type === 'group') {
            newGroupGoals = state.groupGoals.map(g =>
              g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
            );
          } else if (type === 'emergency') {
            newEmergencyGoals = state.emergencyGoals.map(g =>
              g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
            );
          }

          return {
            transactions: [tx, ...state.transactions],
            soloGoals: newSoloGoals,
            groupGoals: newGroupGoals,
            emergencyGoals: newEmergencyGoals,
          };
        });
      },
      withdrawMoney: (goalId, amount, type) => {
        const tx: Transaction = {
          id: generateUUID(),
          goalId,
          amount: -amount,
          type: 'withdrawal',
          date: new Date().toISOString(),
          note: 'Withdrawal'
        };
        set(state => {
          let newSoloGoals = state.soloGoals;
          let newGroupGoals = state.groupGoals;
          let newEmergencyGoals = state.emergencyGoals;

          if (type === 'solo') {
            newSoloGoals = state.soloGoals.map(g =>
              g.id === goalId ? { ...g, currentAmount: Math.max(0, g.currentAmount - amount) } : g
            );
          } else if (type === 'group') {
            newGroupGoals = state.groupGoals.map(g =>
              g.id === goalId ? { ...g, currentAmount: Math.max(0, g.currentAmount - amount) } : g
            );
          } else if (type === 'emergency') {
            newEmergencyGoals = state.emergencyGoals.map(g =>
              g.id === goalId ? { ...g, currentAmount: Math.max(0, g.currentAmount - amount) } : g
            );
          }

          return {
            transactions: [tx, ...state.transactions],
            soloGoals: newSoloGoals,
            groupGoals: newGroupGoals,
            emergencyGoals: newEmergencyGoals,
          };
        });
      },
      deleteTransaction: async (id) => set(state => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      clearAllHistory: async () => set({ transactions: [] }),

      // Notification Actions
      addNotification: (notification) => set(state => ({
        notifications: [{
          ...notification,
          id: generateUUID(),
          timestamp: new Date().toISOString(),
          read: false
        }, ...state.notifications]
      })),
      markNotificationRead: (id) => set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      markAllNotificationsRead: () => set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      clearNotifications: () => set({ notifications: [] }),

      // Streak Actions
      checkStreak: () => {},

      // Weekly Challenge
      resetWeeklyChallenge: () => {},
      updateChallengeProgress: (amount) => set(state => {
        const challenge = state.weeklyChallenge;
        if (!challenge) return state;
        const newProgress = challenge.progress + amount;
        return {
          weeklyChallenge: {
            ...challenge,
            progress: newProgress,
            completed: newProgress >= challenge.target
          }
        };
      }),

      // Other Actions
      checkReminders: () => {},
      triggerMotivation: () => {},
      refreshData: async () => {},
      nudgeGroup: (goalId) => {},
      clearGoalHistory: async (goalId, type) => {},

      // Gaming Actions
      addXP: (amount) => set(state => {
        const newXP = (state.currentUser?.xp || 0) + amount;
        const newLevel = Math.floor(newXP / 200) + 1;
        return {
          currentUser: state.currentUser ? { ...state.currentUser, xp: newXP, level: newLevel } : null
        };
      }),
      updateQuestProgress: (questId, amount) => set(state => ({
        dailyQuests: state.dailyQuests.map(q =>
          q.id === questId ? { ...q, progress: q.progress + amount, completed: q.progress + amount >= q.target } : q
        ),
        weeklyQuests: state.weeklyQuests.map(q =>
          q.id === questId ? { ...q, progress: q.progress + amount, completed: q.progress + amount >= q.target } : q
        )
      })),
      buyStreakFreeze: () => {
        const state = get();
        if ((state.currentUser?.xp || 0) >= 100) {
          set(s => ({
            currentUser: s.currentUser ? {
              ...s.currentUser,
              xp: (s.currentUser.xp || 0) - 100,
              streakFreezeCount: (s.currentUser.streakFreezeCount || 0) + 1
            } : null
          }));
          return { success: true, message: 'Streak freeze purchased!' };
        }
        return { success: false, message: 'Not enough XP' };
      },
      startFocusSession: (type, duration) => set(state => ({
        focusSessions: [...state.focusSessions, {
          id: generateUUID(),
          type,
          duration,
          startTime: new Date().toISOString(),
          completed: false
        }]
      })),
      completeFocusSession: (id) => set(state => ({
        focusSessions: state.focusSessions.map(s =>
          s.id === id ? { ...s, completed: true } : s
        )
      })),
    }),
    {
      name: 'zavr-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        soloGoals: state.soloGoals,
        groupGoals: state.groupGoals,
        emergencyGoals: state.emergencyGoals,
        transactions: state.transactions,
        theme: state.theme,
        zettlFriends: state.zettlFriends,
        personalZettls: state.personalZettls,
        zettlGroups: state.zettlGroups,
      }),
    }
  )
);
