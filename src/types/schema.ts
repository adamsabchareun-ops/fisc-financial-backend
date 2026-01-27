export interface Account {
    id: string;
    name: string;
    type: string;
    balance_current: number;
}

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    payee: string;
    category_id?: string;
}

export interface Budget {
    id: string;
    category: string;
    limit: number;
    spent: number;
}

export interface SyncPayload {
    timestamp: number;
    accounts: Account[];
    transactions: Transaction[];
    budgets: Budget[];
}

export interface PayPeriod {
    id: string;
    user_id: string;
    start_date: string; // ISO Date "YYYY-MM-DD"
    end_date: string;   // ISO Date "YYYY-MM-DD"
    income_total: number;
    is_closed: boolean;
}

export interface AllocationBucket {
    id: string;
    user_id: string;
    name: string;
    percentage?: number;
    fixed_amount?: number;
    allocation_type: 'percentage' | 'fixed' | 'remainder';
}

export interface SentimentLog {
    id: string;
    user_id: string;
    sentiment_score: number; // 1-10
    sentiment_label?: string;
    context_note?: string;
    linked_transaction_id?: string;
    log_date: string; // ISO Date "YYYY-MM-DD"
}
