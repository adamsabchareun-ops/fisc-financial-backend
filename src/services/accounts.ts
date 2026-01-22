import { supabase } from './auth'

/**
 * Fetches all accounts for the logged-in user.
 * RLS automatically filters this to only show the user's own accounts.
 */
export const getAccounts = async () => {
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching accounts:', error)
        return []
    }
    return data
}

/**
 * Creates a new financial account.
 * @param name Account name (e.g. "Chase Checking")
 * @param type 'checking' | 'savings' | 'credit_card' | 'cash'
 * @param initialBalanceCents Starting balance in CENTS
 */
export const createAccount = async (name: string, type: string, initialBalanceCents: number) => {
    const { data, error } = await supabase
        .from('accounts')
        .insert([{ name, type, current_balance_cents: initialBalanceCents }])
        .select()

    return { data, error }
}
