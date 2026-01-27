import { supabase } from '../utils/supabase'

export const getAllocations = async (payPeriodId: string) => {
    const { data, error } = await supabase
        .from('allocations')
        .select(`
      *,
      allocation_categories (name, is_fixed)
    `)
        .eq('pay_period_id', payPeriodId)

    return { data, error }
}

export const upsertAllocation = async (payPeriodId: string, categoryId: string, amountCents: number) => {
    const { data, error } = await supabase
        .from('allocations')
        .upsert({
            pay_period_id: payPeriodId,
            category_id: categoryId,
            allocated_amount_cents: amountCents
        }, { onConflict: 'pay_period_id, category_id' })
        .select()

    return { data, error }
}
