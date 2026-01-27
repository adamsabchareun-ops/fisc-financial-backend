import { supabase } from '../utils/supabase'

export const getIncomeSources = async () => {
    const { data, error } = await supabase
        .from('income_sources')
        .select('*')

    return { data, error }
}

export const addIncomeTransaction = async (sourceId: string, amountCents: number, date: string) => {
    const { data, error } = await supabase
        .from('income_transactions')
        .insert([{
            source_id: sourceId,
            amount_cents: amountCents,
            received_date: date
        }])
        .select()

    return { data, error }
}

export const getTotalIncomeForPeriod = async (payPeriodId: string) => {
    // Using the view created in Phase 4
    const { data, error } = await supabase
        .from('view_pay_period_summary')
        .select('total_income')
        .eq('pay_period_id', payPeriodId)
        .single()

    return { data, error }
}
