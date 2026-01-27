'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { Bucket } from '@/hooks/useHorizon';
import { calculateProjections } from '@/utils/finance';

// Initialize Supabase Admin Client (Service Role)
// This bypasses RLS to ensure we can update any user's data securely from the server
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Allocates income to buckets and updates the database.
 * 
 * @param userId The ID of the user (not strictly used if buckets have IDs, but good for validation if needed)
 * @param income The amount of income to allocate
 * @param buckets The current state of buckets (mostly for IDs and targets)
 */
export async function allocateIncome(userId: string, income: number, buckets: Bucket[]) {
    try {
        if (!income || income <= 0) {
            throw new Error("Invalid income amount.");
        }

        if (!buckets || buckets.length === 0) {
            throw new Error("No buckets to allocate to.");
        }

        // Get authenticated user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            throw new Error("Unauthorized");
        }

        const realUserId = user.id;

        // 1. Recalculate projections server-side for safety
        // We trust the bucket IDs and Targets from the client (for now), but we recalculate the split.
        // In a real app, we might re-fetch buckets from DB to ensure targets haven't changed.
        // For this MVP, we'll use the passed buckets but recalculate the math.
        const projectedBuckets = calculateProjections(income, buckets);

        // 2. Perform updates sequentially
        // Supabase doesn't support multi-table transactions via JS client easily without RPC.
        // Sequential updates are fine for this scale.

        const updates = projectedBuckets.map(async (bucket) => {
            // Only update if there's a change or strictly if projected > current?
            // Actually, we want to commit the projected_balance as the new current_balance.

            const { error } = await supabase
                .from('allocation_buckets')
                .update({ current_balance: bucket.projected_balance })
                .eq('id', bucket.id)
                .eq('user_id', realUserId); // Ensure we only touch rows for this user

            if (error) {
                console.error(`Failed to update bucket ${bucket.name}:`, error);
                throw new Error(`Failed to update bucket ${bucket.name}`);
            }
        });

        await Promise.all(updates);

        // 3. Revalidate the dashboard
        revalidatePath('/horizon');

        return { success: true };
    } catch (error: any) {
        console.error("Allocation Error:", error);
        return { success: false, error: error.message };
    }
}
