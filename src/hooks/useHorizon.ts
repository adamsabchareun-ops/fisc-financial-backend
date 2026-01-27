import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface PayPeriod {
    id: string;
    start_date: string;
    end_date: string;
    total_income: number;
    is_current: boolean;
}

export interface Bucket {
    id: string;
    name: string;
    target_amount: number;
    current_balance: number;
    percentage: number;
    color_hex: string;
}

export interface HorizonData {
    currentWeek: PayPeriod | null;
    buckets: Bucket[];
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

export const useHorizon = (): HorizonData => {
    const supabase = createClient();
    const [currentWeek, setCurrentWeek] = useState<PayPeriod | null>(null);
    const [buckets, setBuckets] = useState<Bucket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshData = async () => {
        try {
            // Only set loading to true if we don't have data yet? 
            // Or maybe separate "isRefetching"? For now, just keep simple.
            // If we want "instant" update, maybe don't toggle loading fully if prefer background refresh?
            // "Goal: The Total Saved number should jump up instantly" -> If we set isLoading=true, UI might flash skeleton.
            // Let's keep isLoading managed, but maybe we can optimize UX later. 
            // For now, prompt implies standard refetch.
            setIsLoading(true);
            setError(null);

            // Fetch Current Pay Period
            const { data: weekData, error: weekError } = await supabase
                .from('pay_periods')
                .select('*')
                .eq('is_current', true)
                .limit(1)
                .maybeSingle();

            if (weekError) throw weekError;

            let effectiveWeek = weekData;

            // Fallback: If no active week found, use a "Mock Week" so UI renders
            if (!effectiveWeek) {
                const today = new Date();
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);

                effectiveWeek = {
                    id: 'mock-week',
                    start_date: today.toISOString(),
                    end_date: nextWeek.toISOString(),
                    total_income: 0,
                    is_current: true
                };
            }

            // Fetch Allocation Buckets
            const { data: bucketsData, error: bucketsError } = await supabase
                .from('allocation_buckets')
                .select('*');

            if (bucketsError) throw bucketsError;

            setCurrentWeek(effectiveWeek);
            setBuckets(bucketsData || []);
        } catch (err: any) {
            console.error("Supabase Error:", err.message);
            setError(err.message || 'Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return { currentWeek, buckets, isLoading, error, refreshData };
};
