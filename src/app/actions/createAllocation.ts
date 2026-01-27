'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createAllocation(name: string, target_amount: number, percentage: number) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('Unauthorized');
        }

        if (!name || name.trim().length === 0) throw new Error('Allocation name is required');
        if (target_amount < 0) throw new Error('Goal amount cannot be negative');
        if (percentage < 0 || percentage > 100) throw new Error('Percentage must be between 0 and 100');

        const pastelColors = ['#FFD1DC', '#FFDFD3', '#E0F9B5', '#A0E7E5', '#B4F8C8', '#FBE7C6'];
        const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];

        const { error } = await supabase
            .from('allocation_buckets')
            .insert({
                user_id: user.id,
                name: name.trim(),
                target_amount,
                percentage,
                current_balance: 0,
                color_hex: randomColor
            });

        if (error) {
            console.error("Supabase Create Error:", JSON.stringify(error, null, 2));
            throw new Error(`Failed to create allocation: ${error.message}`);
        }

        revalidatePath('/buckets');
        revalidatePath('/horizon');

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
