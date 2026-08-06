import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  XCircle, CheckCircle2, Loader2, Wallet, Users, Calendar, Sparkles,
  ArrowUpCircle, ArrowDownCircle, Check
} from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

interface CreateZettlModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: any[];
  onRequestMoney?: (friendId: string, amount: number, note: string, dueDate?: string) => Promise<void>;
  onSendMoney?: (friendId: string, amount: number, note: string) => Promise<void>;
  onCreateGroup?: (name: string, friendIds: string[]) => Promise<void>;
  userId?: string;
  onSuccess?: () => void;
}

export default function CreateZettlModal({
  isOpen,
  onClose,
  friends = [],
  userId,
  onSuccess
}: CreateZettlModalProps) {
  const [mode, setMode] = useState<'request' | 'send' | 'group'>('request');
  const [loading, setLoading] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [groupName, setGroupName] = useState('');
  const [selectedFriendsForGroup, setSelectedFriendsForGroup] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!selectedFriend && mode !== 'group') {
      toast.error('Please select a friend');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (mode !== 'group' && (!parsedAmount || parsedAmount <= 0)) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (mode === 'group') {
      toast.success('Group created! (Demo)');
    } else if (mode === 'request') {
      toast.success(`Requested ₹${amount} from ${selectedFriend?.name || 'friend'}! (Demo)`);
    } else {
      toast.success(`Sent ₹${amount} to ${selectedFriend?.name || 'friend'}! (Demo)`);
    }

    setLoading(false);
    onSuccess?.();
    onClose();

    // Reset
    setSelectedFriend(null);
    setAmount('');
    setNote('');
    setDueDate('');
    setGroupName('');
    setSelectedFriendsForGroup([]);
  };

  const toggleFriendForGroup = (friendId: string) => {
    setSelectedFriendsForGroup(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md clay rounded-t-3xl p-6 pb-12 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">New Zettl</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-foreground/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'request', label: 'Request', icon: ArrowDownCircle },
                { id: 'send', label: 'Send', icon: ArrowUpCircle },
                { id: 'group', label: 'Group', icon: Users },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setMode(id as any)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all',
                    mode === id
                      ? 'bg-coral text-white'
                      : 'clay-inset opacity-60 hover:opacity-100'
                  )}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>

            {mode !== 'group' ? (
              <div className="space-y-4">
                {/* Friend Selection */}
                <div>
                  <label className="text-xs opacity-60 mb-2 block">Select Friend</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {friends.length > 0 ? friends.map((friend) => (
                      <button
                        key={friend.id || friend.userId}
                        onClick={() => setSelectedFriend(friend)}
                        className={cn(
                          'w-full p-3 rounded-xl flex items-center gap-3 transition-all',
                          selectedFriend?.id === friend.id || selectedFriend?.userId === friend.userId
                            ? 'bg-coral/20 border-2 border-coral'
                            : 'clay-inset'
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral/30 to-teal/30 flex items-center justify-center">
                          <span className="text-sm font-bold">{(friend.name || friend.fullName || '?').charAt(0)}</span>
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-bold text-sm">{friend.name || friend.fullName || friend.username}</p>
                          <p className="text-xs opacity-60">@{friend.username}</p>
                        </div>
                        {selectedFriend?.id === friend.id && (
                          <Check className="w-5 h-5 text-coral" />
                        )}
                      </button>
                    )) : (
                      <p className="text-sm opacity-40 text-center py-4">No friends yet. Add some friends first!</p>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-xs opacity-60 mb-2 block">Amount</label>
                  <div className="flex items-center clay-inset rounded-xl px-4 py-3">
                    <span className="opacity-40 mr-2">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="flex-1 bg-transparent outline-none text-xl font-bold"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-xs opacity-60 mb-2 block">Note (optional)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g., Dinner split"
                    className="w-full clay-inset rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>

                {/* Due Date (only for request) */}
                {mode === 'request' && (
                  <div>
                    <label className="text-xs opacity-60 mb-2 block">Due Date (optional)</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full clay-inset rounded-xl px-4 py-3 text-sm outline-none"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Group Name */}
                <div>
                  <label className="text-xs opacity-60 mb-2 block">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., Roommates"
                    className="w-full clay-inset rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>

                {/* Friend Selection for Group */}
                <div>
                  <label className="text-xs opacity-60 mb-2 block">Select Friends</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {friends.map((friend) => (
                      <button
                        key={friend.id || friend.userId}
                        onClick={() => toggleFriendForGroup(friend.id || friend.userId)}
                        className={cn(
                          'w-full p-3 rounded-xl flex items-center gap-3 transition-all',
                          selectedFriendsForGroup.includes(friend.id || friend.userId)
                            ? 'bg-teal/20 border-2 border-teal'
                            : 'clay-inset'
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral/30 to-teal/30 flex items-center justify-center">
                          <span className="text-sm font-bold">{(friend.name || friend.fullName || '?').charAt(0)}</span>
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-bold text-sm">{friend.name || friend.fullName || friend.username}</p>
                          <p className="text-xs opacity-60">@{friend.username}</p>
                        </div>
                        {selectedFriendsForGroup.includes(friend.id || friend.userId) && (
                          <Check className="w-5 h-5 text-teal" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 py-4 bg-coral text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {mode === 'group' ? 'Create Group' : mode === 'request' ? 'Request Money' : 'Send Money'}
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
