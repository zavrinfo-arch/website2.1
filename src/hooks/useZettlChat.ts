import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { useZettlContext } from '../context/ZettlContext';
import toast from 'react-hot-toast';

export interface ChatListItem {
  friendId: string;
  friendName: string;
  friendUsername: string;
  friendAvatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread_count: number;
  balance: number;
}

export interface ChatMessage {
  id: string;
  type: 'text' | 'request' | 'payment';
  senderId: string;
  text?: string;
  amount?: number;
  note?: string;
  timestamp: string;
  direction: 'incoming' | 'outgoing';
  read: boolean;
}

// Mock chat list data
const mockChatList: ChatListItem[] = [
  { friendId: 'user-2', friendName: 'Priya Sharma', friendUsername: 'priya.s', friendAvatar: '', lastMessage: 'Sure! Will pay by tonight', lastMessageTime: new Date(Date.now() - 1800000).toISOString(), unread_count: 0, balance: 1500 },
  { friendId: 'user-3', friendName: 'Rahul Mehta', friendUsername: 'rahul.m', friendAvatar: '', lastMessage: 'Thanks for the tickets!', lastMessageTime: new Date(Date.now() - 86400000).toISOString(), unread_count: 1, balance: -800 },
  { friendId: 'user-4', friendName: 'Ananya Singh', friendUsername: 'ananya.s', friendAvatar: '', lastMessage: 'Movie was great!', lastMessageTime: new Date(Date.now() - 172800000).toISOString(), unread_count: 0, balance: 0 },
];

export function useChatList() {
  const { currentUser } = useStore();
  const { refreshChatList, setUnreadCount, friends } = useZettlContext();
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      // Use mock data, filtering from friends if available
      const chatData = friends.length > 0
        ? friends.filter(f => f.status === 'accepted').map(f => ({
            friendId: f.userId,
            friendName: f.name,
            friendUsername: f.username,
            friendAvatar: f.avatar || '',
            lastMessage: '',
            lastMessageTime: new Date().toISOString(),
            unread_count: 0,
            balance: f.balance || 0
          }))
        : mockChatList;

      setChats(chatData);

      const totalUnreads = chatData.reduce((sum, item) => sum + item.unread_count, 0);
      setUnreadCount(totalUnreads);
    } catch (e) {
      console.error('[USE-CHAT-LIST] Error pulling chat list:', e);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, setUnreadCount, friends]);

  useEffect(() => {
    fetchChats();
  }, [currentUser?.id, fetchChats]);

  return { chats, loading, refetch: fetchChats };
}

export function useChatMessages(friendId: string | undefined) {
  const { currentUser } = useStore();
  const { playSound, hapticFeedback } = useZettlContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!currentUser?.id || !friendId) return;
    try {
      // Mock messages
      const mockMessages: ChatMessage[] = [
        { id: '1', type: 'text', senderId: friendId, text: 'Hey! Can you send me that dinner money?', timestamp: new Date(Date.now() - 3600000).toISOString(), direction: 'incoming', read: true },
        { id: '2', type: 'text', senderId: currentUser.id, text: 'Sure! How much was it?', timestamp: new Date(Date.now() - 3500000).toISOString(), direction: 'outgoing', read: true },
        { id: '3', type: 'text', senderId: friendId, text: '₹750 for the restaurant', timestamp: new Date(Date.now() - 3400000).toISOString(), direction: 'incoming', read: true },
        { id: '4', type: 'request', senderId: friendId, amount: 750, note: 'Dinner at Italian Place', timestamp: new Date(Date.now() - 3000000).toISOString(), direction: 'incoming', read: true },
        { id: '5', type: 'text', senderId: currentUser.id, text: 'Got it! Will pay by tonight', timestamp: new Date(Date.now() - 1800000).toISOString(), direction: 'outgoing', read: true },
      ];

      setMessages(mockMessages);
    } catch (e) {
      console.error('[USE-CHAT-MESSAGES] Error pulling messages:', e);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, friendId]);

  useEffect(() => {
    setLoading(true);
    fetchMessages();
  }, [currentUser?.id, friendId, fetchMessages]);

  return { messages, loading, refetch: fetchMessages };
}

export function useSendRequest() {
  const { currentUser } = useStore();
  const { playSound, hapticFeedback, refreshChatList } = useZettlContext();
  const [sending, setSending] = useState(false);

  const requestMoney = async (data: { friendId: string; amount: number; note: string; dueDate?: string }) => {
    if (!currentUser?.id) {
      toast.error('Session expired');
      return;
    }
    setSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      playSound('kaching');
      hapticFeedback();
      toast.success(`Request for ₹${data.amount} sent! (Demo)`);
      refreshChatList();
    } catch (e: any) {
      toast.error(e.message || 'Request failed');
    } finally {
      setSending(false);
    }
  };

  return { requestMoney, sending };
}

export function useSendPayment() {
  const { currentUser } = useStore();
  const { playSound, hapticFeedback, refreshChatList } = useZettlContext();
  const [sending, setSending] = useState(false);

  const makePayment = async (data: { friendId: string; amount: number; note: string }) => {
    if (!currentUser?.id) {
      toast.error('Session expired');
      return;
    }
    setSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      playSound('kaching');
      hapticFeedback();
      toast.success(`Payment ₹${data.amount} submitted successfully! (Demo)`);
      refreshChatList();
    } catch (e: any) {
      toast.error(e.message || 'Payment failed');
    } finally {
      setSending(false);
    }
  };

  return { makePayment, sending };
}

export function useSendText() {
  const { currentUser } = useStore();
  const { playSound, hapticFeedback, refreshChatList } = useZettlContext();
  const [sending, setSending] = useState(false);

  const sendText = async (friendId: string, text: string) => {
    if (!currentUser?.id || !text.trim()) return;
    setSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      playSound('whoosh');
      hapticFeedback();
      refreshChatList();
    } catch (e: any) {
      toast.error('Failed to send text');
    } finally {
      setSending(false);
    }
  };

  return { sendText, sending };
}

export function useTypingIndicator(friendId: string | undefined) {
  const [isTyping, setIsTyping] = useState(false);

  // Mock typing simulation - disabled for cleaner demo
  useEffect(() => {
    setIsTyping(false);
  }, [friendId]);

  return { isTyping };
}

export function useUnreadCount() {
  const { unreadCount, refreshChatList } = useZettlContext();

  return { unreadCount, refresh: refreshChatList };
}
