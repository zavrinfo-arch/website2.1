import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { useZettlContext } from '../context/ZettlContext';
import ChatBubble from '../components/Zettl/ChatBubble';
import RequestModal from '../components/Zettl/RequestModal';
import PaymentModal from '../components/Zettl/PaymentModal';

import {
  ArrowLeft, Coins, HandCoins, Paperclip,
  Send, Smile, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock chat messages
const mockMessages = [
  { id: '1', type: 'text', senderId: 'user-2', text: 'Hey! Can you send me that dinner money?', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', type: 'text', senderId: 'demo-user-001', text: 'Sure! How much was it?', timestamp: new Date(Date.now() - 3500000).toISOString() },
  { id: '3', type: 'text', senderId: 'user-2', text: '₹750 for the restaurant', timestamp: new Date(Date.now() - 3400000).toISOString() },
  { id: '4', type: 'request', senderId: 'user-2', amount: 750, note: 'Dinner at Italian Place', timestamp: new Date(Date.now() - 3000000).toISOString() },
  { id: '5', type: 'text', senderId: 'demo-user-001', text: 'Got it! Will pay by tonight', timestamp: new Date(Date.now() - 1800000).toISOString() },
];

export default function ZettlChatRoom() {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useStore();

  const {
    currentChatFriendId, setCurrentChatFriendId,
    payDebt, sendReminder, requestMoney,
    zettls, friends
  } = useZettlContext();

  const bottomScrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState(mockMessages);
  const [friendProfile, setFriendProfile] = useState<any>(null);
  const [netBalance, setNetBalance] = useState(0);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Find friend info
  useEffect(() => {
    if (friendId) {
      const friend = friends.find(f => f.userId === friendId || f.id === friendId);
      if (friend) {
        setFriendProfile(friend);
      } else {
        // Default mock friend
        setFriendProfile({
          id: friendId,
          name: 'Priya Sharma',
          username: 'priya.s',
          avatar: ''
        });
      }

      // Calculate balance with this friend
      const friendZettls = zettls.filter(z => z.friendId === friendId);
      const owed = friendZettls.filter(z => z.direction === 'lent').reduce((sum, z) => sum + z.amount, 0);
      const owe = friendZettls.filter(z => z.direction === 'borrowed').reduce((sum, z) => sum + z.amount, 0);
      setNetBalance(owed - owe);
    }
  }, [friendId, friends, zettls]);

  useEffect(() => {
    if (currentChatFriendId !== friendId) {
      setCurrentChatFriendId(friendId || null);
    }
  }, [friendId, currentChatFriendId, setCurrentChatFriendId]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: 'text',
      senderId: 'demo-user-001',
      text: inputText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    toast.success('Message sent! (Demo)');
  };

  const handleSendRequest = async (amount: number, note: string, dueDate?: string) => {
    setIsRequestOpen(false);
    toast.success(`Requested ₹${amount} from ${friendProfile?.name}! (Demo)`);

    const newMessage = {
      id: Date.now().toString(),
      type: 'request',
      senderId: 'demo-user-001',
      amount,
      note,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendPayment = async (amount: number, note: string) => {
    setIsPaymentOpen(false);
    toast.success(`Sent ₹${amount} to ${friendProfile?.name}! (Demo)`);

    const newMessage = {
      id: Date.now().toString(),
      type: 'payment',
      senderId: 'demo-user-001',
      amount,
      note,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
  };

  if (!friendProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="opacity-60">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => navigate('/zettl')} className="p-2 rounded-full hover:bg-foreground/5">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h1 className="font-bold">{friendProfile.name}</h1>
            <p className="text-xs opacity-60">@{friendProfile.username}</p>
          </div>

          <div className={`text-sm font-bold ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {netBalance >= 0 ? `They owe ₹${netBalance}` : `You owe ₹${Math.abs(netBalance)}`}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isMine={msg.senderId === 'demo-user-001'}
            friendName={friendProfile.name}
          />
        ))}
        <div ref={bottomScrollRef} />
      </div>

      {/* Quick Actions */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 space-y-3">
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsRequestOpen(true)}
            className="flex-1 py-3 rounded-xl bg-teal/20 text-teal font-bold text-sm flex items-center justify-center gap-2"
          >
            <Coins className="w-4 h-4" /> Request
          </button>
          <button
            onClick={() => setIsPaymentOpen(true)}
            className="flex-1 py-3 rounded-xl bg-coral/20 text-coral font-bold text-sm flex items-center justify-center gap-2"
          >
            <HandCoins className="w-4 h-4" /> Pay
          </button>
        </div>

        {/* Text Input */}
        <div className="flex gap-2 items-center">
          <button className="p-3 rounded-full hover:bg-foreground/5 opacity-60">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder="Type a message..."
            className="flex-1 py-3 px-4 rounded-full clay-inset bg-surface text-sm outline-none"
          />
          <button
            onClick={handleSendText}
            disabled={!inputText.trim()}
            className="p-3 rounded-full bg-coral text-white disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <RequestModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        friendName={friendProfile.name}
        onSubmit={handleSendRequest}
      />

      <PaymentModal
        friendId={friendId || ''}
        friendName={friendProfile.name}
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSubmit={async (data) => {
          await handleSendPayment(data.amount, data.purpose);
        }}
      />
    </div>
  );
}
