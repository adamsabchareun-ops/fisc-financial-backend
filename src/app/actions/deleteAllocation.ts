'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteAllocation(id: string) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('Unauthorized');
        }

        const { error } = await supabase
            .from('allocation_buckets')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error("Delete Error:", error);
            throw new Error('Failed to delete allocation');
        }

        revalidatePath('/buckets');
        revalidatePath('/horizon');

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
