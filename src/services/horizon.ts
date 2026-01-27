import { supabase } from '../utils/supabase';
import { Transaction, SentimentLog, PayPeriod, AllocationBucket } from '../types/schema';

// --- Types for View Models ---

export interface CalendarDay {
    date: string; // YYYY-MM-DD
    transactions: Transaction[];
    sentiment?: SentimentLog;
    dailyTotal: number;
}

export interface PayPeriodSummary {
    period: PayPeriod;
    totalIncome: number;
    totalBills: number;
    disposable: number;
}

export interface AllocationBreakdown {
    periodId: string;
    totalIncome: number;
    allocations: {
        bucketName: string;
        amount: number;
        type: 'fixed' | 'percentage' | 'remainder';
    }[];
}

// --- Service Logic ---

/**
 * Aggregates transactions and sentiment logs for a given month/year into a daily calendar view.
 */
export const getCalendarView = async (month: number, year: number): Promise<Record<string, CalendarDay>> => {
    // 1. Calculate Date Range
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    // 2. Fetch Transactions
    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

    // 3. Fetch Sentiment Logs
    const { data: sentiments } = await supabase
        .from('sentiment_logs')
        .select('*')
        .gte('log_date', startDate)
        .lte('log_date', endDate);

    // 4. Aggregate by Date
    const calendar: Record<string, CalendarDay> = {};

    // Initialize with transactions
    (transactions || []).forEach((txn: any) => {
        const date = txn.date.split('T')[0];
        if (!calendar[date]) {
            calendar[date] = { date, transactions: [], dailyTotal: 0 };
        }
        calendar[date].transactions.push(txn);
        calendar[date].dailyTotal += txn.amount;
    });

    // Merge Sentiment
    (sentiments || []).forEach((log: any) => {
        const date = log.log_date;
        if (!calendar[date]) {
            calendar[date] = { date, transactions: [], dailyTotal: 0 };
        }
        calendar[date].sentiment = log;
    });

    return calendar;
};

/**
 * Calculates summaries (Income vs Bills) for a specific pay period.
 */
export const getPayPeriodSummary = async (startDate: string, endDate: string): Promise<PayPeriodSummary | null> => {
    // 1. Fetch Transactions in Range
    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

    if (!transactions) return null;

    let totalIncome = 0;
    let totalBills = 0;

    transactions.forEach((txn: any) => {
        if (txn.amount > 0) {
            totalIncome += txn.amount;
        } else {
            totalBills += Math.abs(txn.amount);
        }
    });

    return {
        period: { start_date: startDate, end_date: endDate } as PayPeriod,
        totalIncome,
        totalBills,
        disposable: totalIncome - totalBills
    };
};

/**
 * Distributes total income into user-defined allocation buckets.
 */
export const getAllocationBreakdown = async (totalIncome: number): Promise<AllocationBreakdown> => {
    // 1. Fetch Buckets
    const { data: buckets } = await supabase
        .from('allocation_buckets')
        .select('*');

    const allocations: AllocationBreakdown['allocations'] = [];
    let remainingIncome = totalIncome;

    if (!buckets) return { periodId: 'stub', totalIncome, allocations };

    // 2. Process Fixed Amounts First
    buckets.filter((b: any) => b.allocation_type === 'fixed').forEach((b: any) => {
        const amount = b.fixed_amount || 0;
        allocations.push({ bucketName: b.name, amount, type: 'fixed' });
        remainingIncome -= amount;
    });

    // 3. Process Percentages
    buckets.filter((b: any) => b.allocation_type === 'percentage').forEach((b: any) => {
        const amount = (totalIncome * (b.percentage || 0)) / 100;
        allocations.push({ bucketName: b.name, amount, type: 'percentage' });
        remainingIncome -= amount;
    });

    // 4. Remainder
    buckets.filter((b: any) => b.allocation_type === 'remainder').forEach((b: any) => {
        allocations.push({ bucketName: b.name, amount: remainingIncome, type: 'remainder' });
    });

    return {
        periodId: 'calc',
        totalIncome,
        allocations
    };
};

/**
 * Basic correlation specific spending habits to sentiment.
 */
export const analyzeSpendingMood = async (userId: string) => {
    // 1. Fetch all positive/negative sentiment logs
    const { data: logs } = await supabase
        .from('sentiment_logs')
        .select('*, transactions(*)')
        .eq('user_id', userId);

    // This is a stub for more complex analysis (e.g., avg spend on "Anxious" days)
    return logs;
};
