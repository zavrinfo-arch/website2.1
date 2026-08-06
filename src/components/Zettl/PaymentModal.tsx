import React, { useState } from 'react';
import { X, HandCoins, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  friendId: string;
  friendName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { friend_id: string; amount: number; purpose: string }) => Promise<void>;
}

export default function PaymentModal({ friendId, friendName, isOpen, onClose, onSubmit }: PaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        friend_id: friendId,
        amount: parsedAmount,
        purpose
      });
      setAmount('');
      setPurpose('');
    } catch (err) {
      toast.error('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md clay rounded-t-3xl p-6 pb-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center">
              <HandCoins className="w-6 h-6 text-coral" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Pay {friendName}</h2>
              <p className="text-xs opacity-60">Send money to settle up</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-foreground/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="text-xs opacity-60 mb-2 block">Amount</label>
            <div className="flex items-center clay-inset rounded-xl px-4 py-4">
              <span className="text-xl opacity-40 mr-2">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent outline-none text-2xl font-bold"
                autoFocus
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="text-xs opacity-60 mb-2 block">Note (optional)</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Dinner split, Movie tickets"
              className="w-full clay-inset rounded-xl px-4 py-3 text-sm outline-none"
            />
          </div>

          {/* Quick Amounts */}
          <div className="flex gap-2">
            {[100, 500, 1000, 2000].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val.toString())}
                className="flex-1 py-2 rounded-xl clay-inset text-xs font-bold hover:bg-foreground/5"
              >
                ₹{val}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !amount}
            className="w-full py-4 bg-coral text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <HandCoins className="w-4 h-4" /> Send Payment
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs opacity-40 mt-4">
          Demo mode - No actual payment processed
        </p>
      </div>
    </div>
  );
}
