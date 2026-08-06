import React, { useState, useEffect } from 'react';
import { useZettlContext } from '../context/ZettlContext';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { Search, UserPlus, Check, Hourglass, UserX, UserCheck, Users, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock searchable users
const mockSearchableUsers = [
  { id: 'user-5', name: 'Vikram Patel', username: 'vikram.p', email: 'vikram@example.com' },
  { id: 'user-6', name: 'Neha Gupta', username: 'neha.g', email: 'neha@example.com' },
  { id: 'user-7', name: 'Arjun Rao', username: 'arjun.r', email: 'arjun@example.com' },
  { id: 'user-8', name: 'Kavya Singh', username: 'kavya.s', email: 'kavya@example.com' },
];

export default function FriendSystem() {
  const { currentUser, zettlFriends } = useStore();
  const { friends, acceptFriend, rejectFriend, sendFriendRequest } = useZettlContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get friends by status
  const pendingIncoming = friends.filter(f => f.status === 'pending');
  const activeFriends = friends.filter(f => f.status === 'accepted');

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const results = mockSearchableUsers.filter(u =>
      u.username.toLowerCase().includes(val.toLowerCase()) ||
      u.name.toLowerCase().includes(val.toLowerCase())
    );
    setSearchResults(results);
    setLoading(false);
  };

  const handleSendRequest = async (friendId: string) => {
    try {
      await sendFriendRequest(friendId);
      toast.success('Friend request sent! (Demo)');
    } catch (err: any) {
      toast.error('Failed to send connection request');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input Container */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by username..."
          className="w-full pl-12 pr-4 py-3 rounded-xl clay-inset bg-transparent text-sm outline-none"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin opacity-40" />
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <p className="text-xs font-bold opacity-40 uppercase tracking-wider">Search Results</p>
            {searchResults.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="clay p-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral/30 to-teal/30 flex items-center justify-center">
                    <span className="text-sm font-bold">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{user.name}</p>
                    <p className="text-xs opacity-60">@{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSendRequest(user.id)}
                  className="px-4 py-2 rounded-full bg-coral text-white text-xs font-bold flex items-center gap-2"
                >
                  <UserPlus className="w-3 h-3" /> Connect
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending Requests */}
      {pendingIncoming.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold opacity-40 uppercase tracking-wider">Pending Requests</p>
          {pendingIncoming.map((friend) => (
            <motion.div
              key={friend.id}
              className="clay p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
                  <span className="text-sm font-bold">{(friend.name || '?').charAt(0)}</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{friend.name}</p>
                  <p className="text-xs opacity-60">@{friend.username}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => acceptFriend(friend.id)}
                  className="p-2 rounded-full bg-green-500/20 text-green-500"
                >
                  <UserCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => rejectFriend(friend.id)}
                  className="p-2 rounded-full bg-red-500/20 text-red-500"
                >
                  <UserX className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Active Friends */}
      <div className="space-y-2">
        <p className="text-xs font-bold opacity-40 uppercase tracking-wider">
          Your Connections ({activeFriends.length})
        </p>
        {activeFriends.length > 0 ? (
          activeFriends.map((friend) => (
            <motion.div
              key={friend.id}
              className="clay p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral/30 to-teal/30 flex items-center justify-center">
                  <span className="text-sm font-bold">{(friend.name || '?').charAt(0)}</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{friend.name}</p>
                  <p className="text-xs opacity-60">@{friend.username}</p>
                </div>
              </div>
              {(friend.balance !== undefined && friend.balance !== 0) && (
                <p className={`text-sm font-bold ${friend.balance > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {friend.balance > 0 ? `owes ₹${friend.balance}` : `you owe ₹${Math.abs(friend.balance)}`}
                </p>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm opacity-40">No connections yet</p>
            <p className="text-xs opacity-30 mt-1">Search above to find friends</p>
          </div>
        )}
      </div>
    </div>
  );
}
