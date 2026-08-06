import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { Friend, PersonalZettl, Notification } from '../types';
import toast from 'react-hot-toast';

interface ZettlContextType {
  friends: Friend[];
  zettls: PersonalZettl[];
  pendingRequests: any[];
  activeDebts: any[];
  friendBalances: any[];
  notifications: Notification[];
  activities: any[];
  loading: boolean;
  netBalance: number;
  totalOwedToMe: number;
  totalIOwe: number;
  fetchData: () => Promise<void>;
  sendFriendRequest: (friendId: string) => Promise<void>;
  acceptFriend: (requestId: string) => Promise<void>;
  rejectFriend: (requestId: string) => Promise<void>;
  requestMoney: (friendId: string, amount: number, note: string, dueDate?: string) => Promise<void>;
  payDebt: (debtId: string) => Promise<void>;
  sendReminder: (debtId: string) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // WhatsApp Zettl Chat Additions
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  refreshChatList: () => Promise<void>;
  currentChatFriendId: string | null;
  setCurrentChatFriendId: (friendId: string | null) => void;
  playSound: (type: 'send' | 'receive' | 'whoosh' | 'kaching') => void;
  hapticFeedback: () => void;
}

const ZettlContext = createContext<ZettlContextType | undefined>(undefined);

// Mock data
const mockFriends: Friend[] = [
  { id: 'friend-1', userId: 'user-2', name: 'Priya Sharma', username: 'priya.s', email: 'priya@example.com', avatar: '', status: 'accepted', balance: 1500 },
  { id: 'friend-2', userId: 'user-3', name: 'Rahul Mehta', username: 'rahul.m', email: 'rahul@example.com', avatar: '', status: 'accepted', balance: -800 },
  { id: 'friend-3', userId: 'user-4', name: 'Ananya Singh', username: 'ananya.s', email: 'ananya@example.com', avatar: '', status: 'pending', balance: 0 },
];

const mockZettls: PersonalZettl[] = [
  {
    id: 'zettl-1',
    friendId: 'user-2',
    friendName: 'Priya Sharma',
    amount: 1500,
    direction: 'borrowed',
    note: 'Dinner split',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'zettl-2',
    friendId: 'user-3',
    friendName: 'Rahul Mehta',
    amount: 800,
    direction: 'lent',
    note: 'Movie tickets',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    createdAt: new Date().toISOString()
  },
];

const mockActivities = [
  { id: 'act-1', type: 'payment', description: 'Paid ₹500 to Priya', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  { id: 'act-2', type: 'request', description: 'Requested ₹300 from Rahul', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: 'act-3', type: 'friend', description: 'Connected with Ananya', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
];

export const ZettlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, zettlFriends, personalZettls, notifications } = useStore();
  const [friends, setFriends] = useState<Friend[]>(zettlFriends.length > 0 ? zettlFriends : mockFriends);
  const [zettls, setZettls] = useState<PersonalZettl[]>(personalZettls.length > 0 ? personalZettls : mockZettls);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activeDebts, setActiveDebts] = useState<any[]>([]);
  const [friendBalances, setFriendBalances] = useState<any[]>([]);
  const [contextNotifications, setContextNotifications] = useState<Notification[]>(notifications);
  const [activities, setActivities] = useState<any[]>(mockActivities);
  const [loading, setLoading] = useState(false);

  const [netBalance, setNetBalance] = useState(700);
  const [totalOwedToMe, setTotalOwedToMe] = useState(800);
  const [totalIOwe, setTotalIOwe] = useState(1500);

  const [unreadCount, setUnreadCount] = useState(2);
  const [currentChatFriendId, setCurrentChatFriendId] = useState<string | null>(null);

  const playSound = (type: 'send' | 'receive' | 'whoosh' | 'kaching') => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'send' || type === 'whoosh') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.setValueAtTime(1500, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      }
    } catch (e) {}
  };

  const hapticFeedback = () => {
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(15);
      }
    } catch (e) {}
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Use mock data from store or default mocks
      setFriends(zettlFriends.length > 0 ? zettlFriends : mockFriends);
      setZettls(personalZettls.length > 0 ? personalZettls : mockZettls);
      setContextNotifications(notifications);
      setActivities(mockActivities);

      // Calculate balances from zettls
      const owed = zettls.filter(z => z.direction === 'lent').reduce((sum, z) => sum + z.amount, 0);
      const owe = zettls.filter(z => z.direction === 'borrowed').reduce((sum, z) => sum + z.amount, 0);
      setTotalOwedToMe(owed || 800);
      setTotalIOwe(owe || 1500);
      setNetBalance((owed - owe) || 700);
    } catch (err: any) {
      console.error('[ZETTL-CONTEXT] Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [zettlFriends, personalZettls, notifications, zettls]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendFriendRequest = async (friendId: string) => {
    toast.success('Connection request dispatched! (demo)');
    fetchData();
  };

  const handleAcceptFriend = async (requestId: string) => {
    toast.success('Connection request accepted! (demo)');
    fetchData();
  };

  const handleRejectFriend = async (requestId: string) => {
    toast.success('Connection declined (demo)');
    fetchData();
  };

  const handleRequestMoney = async (friendId: string, amount: number, note: string, dueDate?: string) => {
    toast.success(`Request for ₹${amount} sent to friend (demo)`);
    fetchData();
  };

  const handlePayDebt = async (debtId: string) => {
    toast.success('Payment successfully completed! (demo)');
    fetchData();
  };

  const handleSendReminder = async (debtId: string) => {
    toast.success('Payment nudge sent! (demo)');
    fetchData();
  };

  const handleMarkNotificationRead = async (notificationId: string) => {
    fetchData();
  };

  const handleMarkAllNotificationsRead = async () => {
    toast.success('All marked as read');
    fetchData();
  };

  return (
    <ZettlContext.Provider
      value={{
        friends,
        zettls,
        pendingRequests,
        activeDebts,
        friendBalances,
        notifications: contextNotifications,
        activities,
        loading,
        netBalance,
        totalOwedToMe,
        totalIOwe,
        fetchData,
        sendFriendRequest: handleSendFriendRequest,
        acceptFriend: handleAcceptFriend,
        rejectFriend: handleRejectFriend,
        requestMoney: handleRequestMoney,
        payDebt: handlePayDebt,
        sendReminder: handleSendReminder,
        markNotificationRead: handleMarkNotificationRead,
        markAllNotificationsRead: handleMarkAllNotificationsRead,

        unreadCount,
        setUnreadCount,
        refreshChatList: fetchData,
        currentChatFriendId,
        setCurrentChatFriendId,
        playSound,
        hapticFeedback
      }}
    >
      {children}
    </ZettlContext.Provider>
  );
};

export const useZettlContext = () => {
  const context = useContext(ZettlContext);
  if (!context) {
    throw new Error('useZettlContext must be used within a ZettlProvider');
  }
  return context;
};
