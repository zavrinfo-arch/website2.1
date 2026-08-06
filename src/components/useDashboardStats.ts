import { useEffect, useMemo, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { subMonths, format, startOfMonth, endOfMonth, parseISO, isWithinInterval, isAfter } from 'date-fns';
import { formatCurrency } from '../lib/utils';
import toast from 'react-hot-toast';

export interface FriendDebtDetail {
  friendId: string;
  username: string;
  fullName: string;
  avatar: string;
  amount: number;
}

export interface RecentDebtActivity {
  id: string;
  description: string;
  amount: number;
  note?: string;
  isLent: boolean;
  isSettled: boolean;
  createdAt: string;
  friendName: string;
  friendAvatar: string;
}

export interface MonthlyTrendData {
  month: string;
  Lent: number;
  Borrowed: number;
}

export interface StatusDistribution {
  pendingCount: number;
  pendingPercent: number;
  overdueCount: number;
  overduePercent: number;
  paidCount: number;
  paidPercent: number;
  total: number;
}

export interface DebtSummaryStats {
  totalLent: number;
  totalBorrowed: number;
  netBalance: number;
  totalActiveDebts: number;
  whoOwesMe: FriendDebtDetail[];
  iOweThem: FriendDebtDetail[];
  recentActivity: RecentDebtActivity[];
  monthlyTrend: MonthlyTrendData[];
  statusDistribution: StatusDistribution;
  loading: boolean;
  settleAll: () => Promise<void>;
  settleFriendDebts: (friendId: string) => Promise<void>;
}

export function useDashboardStats(): DebtSummaryStats {
  const {
    currentUser,
    personalZettls,
    zettlFriends,
    fetchZettlData,
    settleZettl
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);

  const userId = currentUser?.id || 'demo-user-001';
  const currency = currentUser?.preferences?.currency || 'INR';

  const stats = useMemo(() => {
    // Calculate from mock data
    const activeDebts = personalZettls.filter(z => z.status !== 'settled');

    // Total Lent (Money others owe current user)
    const totalLent = activeDebts
      .filter(z => z.direction === 'lent')
      .reduce((sum, z) => sum + z.amount, 0);

    // Total Borrowed (Money current user owes others)
    const totalBorrowed = activeDebts
      .filter(z => z.direction === 'borrowed')
      .reduce((sum, z) => sum + z.amount, 0);

    const netBalance = totalLent - totalBorrowed;
    const totalActiveDebts = activeDebts.length;

    // Breakdown by Friend
    const whoOwesMeMap = new Map<string, FriendDebtDetail>();
    const iOweThemMap = new Map<string, FriendDebtDetail>();

    activeDebts.forEach(z => {
      if (z.direction === 'lent') {
        const fId = z.friendId;
        const existing = whoOwesMeMap.get(fId) || {
          friendId: fId,
          username: z.friendName.toLowerCase().replace(' ', '.'),
          fullName: z.friendName,
          avatar: '',
          amount: 0
        };
        existing.amount += z.amount;
        whoOwesMeMap.set(fId, existing);
      } else {
        const fId = z.friendId;
        const existing = iOweThemMap.get(fId) || {
          friendId: fId,
          username: z.friendName.toLowerCase().replace(' ', '.'),
          fullName: z.friendName,
          avatar: '',
          amount: 0
        };
        existing.amount += z.amount;
        iOweThemMap.set(fId, existing);
      }
    });

    const whoOwesMeList = Array.from(whoOwesMeMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const iOweThemList = Array.from(iOweThemMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Activity Timeline
    const recentActivities: RecentDebtActivity[] = [...personalZettls]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(z => {
        const isLent = z.direction === 'lent';
        const friendName = z.friendName;
        const noteText = z.note ? ` for "${z.note}"` : '';
        const verb = isLent ? 'lent' : 'borrowed';
        const prep = isLent ? 'to' : 'from';
        const formattedAmt = formatCurrency(z.amount, currency);

        const description = isLent
          ? `You lent ${formattedAmt} to @${friendName}${noteText}`
          : `You borrowed ${formattedAmt} from @${friendName}${noteText}`;

        return {
          id: z.id,
          description,
          amount: z.amount,
          note: z.note,
          isLent,
          isSettled: z.status === 'settled',
          createdAt: z.createdAt,
          friendName,
          friendAvatar: ''
        };
      });

    // Monthly Trend Data
    const monthlyTrendList: MonthlyTrendData[] = Array.from({ length: 6 }).map((_, idx) => {
      const monthDate = subMonths(new Date(), 5 - idx);
      const monthName = format(monthDate, 'MMM');
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);

      let lentSum = 0;
      let borrowedSum = 0;

      personalZettls.forEach(z => {
        const createDate = parseISO(z.createdAt);
        if (isWithinInterval(createDate, { start, end })) {
          if (z.direction === 'lent') {
            lentSum += z.amount;
          } else {
            borrowedSum += z.amount;
          }
        }
      });

      return {
        month: monthName,
        Lent: lentSum,
        Borrowed: borrowedSum
      };
    });

    // Status Distribution
    const allDebts = personalZettls;
    const total = allDebts.length;

    let pendingCount = 0;
    let overdueCount = 0;
    let paidCount = 0;

    const now = new Date();

    allDebts.forEach(z => {
      if (z.status === 'settled') {
        paidCount++;
      } else {
        if (z.dueDate && isAfter(now, parseISO(z.dueDate))) {
          overdueCount++;
        } else {
          pendingCount++;
        }
      }
    });

    const pendingPercent = total > 0 ? Math.round((pendingCount / total) * 100) : 0;
    const overduePercent = total > 0 ? Math.round((overdueCount / total) * 100) : 0;
    const paidPercent = total > 0 ? Math.round((paidCount / total) * 100) : 0;

    return {
      totalLent,
      totalBorrowed,
      netBalance,
      totalActiveDebts,
      whoOwesMe: whoOwesMeList,
      iOweThem: iOweThemList,
      recentActivity: recentActivities,
      monthlyTrend: monthlyTrendList,
      statusDistribution: {
        pendingCount,
        pendingPercent,
        overdueCount,
        overduePercent,
        paidCount,
        paidPercent,
        total
      }
    };
  }, [personalZettls, zettlFriends, userId, currency]);

  const settleAll = async () => {
    const pending = personalZettls.filter(z => z.status !== 'settled');
    if (pending.length === 0) {
      toast.error('No pending debts to settle.');
      return;
    }

    toast.success(`Settled ${pending.length} debts! (Demo mode)`);
  };

  const settleFriendDebts = async (friendId: string) => {
    const pendingWithFriend = personalZettls.filter(
      z => z.status !== 'settled' && z.friendId === friendId
    );

    if (pendingWithFriend.length === 0) {
      toast.error('No pending debts with this friend.');
      return;
    }

    toast.success(`All debts with friend settled! (Demo mode)`);
  };

  return {
    ...stats,
    loading: isLoading,
    settleAll,
    settleFriendDebts
  };
}
