import { supabase } from '../utils/supabase'

/**
 * Adds a new transaction. 
 * NOTE: The Database Trigger 'trigger_update_balance' will automatically update the account balance.
 * * @param accountId The ID of the account
 * @param amountCents Positive for Income, Negative for Expense
 * @param description Description of the transaction
 * @param date ISO Date string (YYYY-MM-DD)
 */
export const addTransaction = async (accountId: string, amountCents: number, description: string, date: string) => {
    // 1. Validate input (Simple safety check)
    if (!accountId || !amountCents) {
        return { error: 'Missing account or amount' }
    }

    // 2. Insert Transaction
    const { data, error } = await supabase
        .from('transactions')
        .insert([{
            account_id: accountId,
            amount_cents: amountCents,
            description: description,
            transaction_date: date
        }])
        .select()

    return { data, error }
}

/**
 * Get recent transactions for the dashboard.
 * @param limit Number of transactions to return (default 5)
 */
export const getRecentTransactions = async (limit = 5) => {
    const { data, error } = await supabase
        .from('transactions')
        .select(`
      *,
      accounts (name)
    `)
        .order('transaction_date', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching transactions:', error)
        return []
    }
    return data
}
