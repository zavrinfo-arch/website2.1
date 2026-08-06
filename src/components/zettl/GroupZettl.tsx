import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, DollarSign, Calendar, ArrowLeft, Plus,
  CheckCircle, Loader2, CreditCard, ChevronRight
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import toast from 'react-hot-toast';

interface GroupZettlProps {
  group: any;
  currentUser: any;
  onBack: () => void;
  onAddExpense: (amount: number, desc: string, splits: { userId: string; amountOwed: number }[]) => Promise<void>;
  onSettleSplit: (expenseId: string, splitId: string) => Promise<void>;
}

export default function GroupZettl({
  group,
  currentUser,
  onBack,
  onAddExpense,
  onSettleSplit
}: GroupZettlProps) {
  const [expenses, setExpenses] = useState<any[]>([
    { id: 'exp-1', description: 'Dinner at Restaurant', amount: 2000, paidBy: currentUser?.fullName || 'Demo User', date: new Date(Date.now() - 86400000).toISOString(), splits: [] },
    { id: 'exp-2', description: 'Movie Tickets', amount: 900, paidBy: 'Priya Sharma', date: new Date(Date.now() - 172800000).toISOString(), splits: [] },
  ]);
  const [loading, setLoading] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');

  const handleAddExpense = async () => {
    const amount = parseFloat(expenseAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!expenseDesc.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newExpense = {
      id: `exp-${Date.now()}`,
      description: expenseDesc,
      amount,
      paidBy: currentUser?.fullName || 'Demo User',
      date: new Date().toISOString(),
      splits: []
    };

    setExpenses(prev => [newExpense, ...prev]);
    toast.success('Expense added! (Demo)');
    setIsAddExpenseOpen(false);
    setExpenseAmount('');
    setExpenseDesc('');
    setLoading(false);
  };

  const handleSettle = async (expenseId: string) => {
    toast.success('Expense settled! (Demo)');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-foreground/5">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h1 className="font-bold">{group?.name || 'Group Expenses'}</h1>
            <p className="text-xs opacity-60">{group?.members?.length || 3} members</p>
          </div>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="p-2 rounded-full bg-coral text-white"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Total Balance */}
      <div className="p-4">
        <div className="clay p-4 rounded-2xl">
          <p className="text-xs opacity-60 mb-1">Group Total</p>
          <p className="text-3xl font-black">
            {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0), 'INR')}
          </p>
        </div>
      </div>

      {/* Expenses List */}
      <div className="p-4 space-y-3">
        <h2 className="text-sm font-bold opacity-60">Recent Expenses</h2>

        {expenses.map((expense) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleSettle(expense.id)}
            className="clay p-4 rounded-2xl cursor-pointer hover:bg-foreground/5 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold">{expense.description}</p>
                <p className="text-xs opacity-60">Paid by {expense.paidBy}</p>
                <p className="text-xs opacity-40 mt-1">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{formatCurrency(expense.amount, 'INR')}</p>
                <button className="text-xs text-teal flex items-center gap-1 mt-1">
                  Settle <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isAddExpenseOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddExpenseOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md clay rounded-t-3xl p-6 pb-12"
            >
              <h2 className="text-xl font-bold mb-6">Add Expense</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs opacity-60 mb-2 block">Description</label>
                  <input
                    type="text"
                    value={expenseDesc}
                    onChange={(e) => setExpenseDesc(e.target.value)}
                    placeholder="e.g., Dinner at Restaurant"
                    className="w-full clay-inset rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs opacity-60 mb-2 block">Amount</label>
                  <div className="flex items-center clay-inset rounded-xl px-4 py-3">
                    <span className="opacity-40 mr-2">₹</span>
                    <input
                      type="number"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="0"
                      className="flex-1 bg-transparent outline-none text-lg font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddExpense}
                  disabled={loading}
                  className="w-full py-4 bg-coral text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Expense'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
