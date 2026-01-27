import { supabase } from '../utils/supabase'

export const getCurrentPayPeriod = async () => {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('pay_periods')
        .select('*')
        .lte('start_date', today)
        .gte('end_date', today)
        .single()

    return { data, error }
}

export const createPayPeriod = async (startDate: string, endDate: string) => {
    const { data, error } = await supabase
        .from('pay_periods')
        .insert([{
            start_date: startDate,
            end_date: endDate
        }])
        .select()

    return { data, error }
}

export const getPayPeriodSummary = async (payPeriodId: string) => {
    const { data, error } = await supabase
        .from('view_pay_period_summary')
        .select('*')
        .eq('pay_period_id', payPeriodId)
        .single()

    return { data, error }
}
