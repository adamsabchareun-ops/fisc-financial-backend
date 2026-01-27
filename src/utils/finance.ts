import { Bucket } from '@/hooks/useHorizon';

export interface ProjectedBucket extends Bucket {
    projected_balance: number;
}

/**
 * Calculates projected bucket balances based on income input.
 * - Uses the user's explicit 'percentage' for distribution.
 * - Rounds to 2 decimal places to act like real money.
 * - Enforces the "Hard Cap" rule (stops at target_amount).
 */
export const calculateProjections = (income: number, buckets: Bucket[]): ProjectedBucket[] => {
    // If no income or negative, return buckets with projected = current
    if (!income || income <= 0) {
        return buckets.map(b => ({
            ...b,
            projected_balance: b.current_balance || 0
        }));
    }

    return buckets.map(bucket => {
        // 1. Calculate share based on the Database Percentage (e.g., 50)
        // We expect bucket.percentage to be a number like 50, 30, 20.
        const percentage = bucket.percentage || 0;
        let potentialAdd = income * (percentage / 100);

        // 2. Round down to 2 decimals immediately (Money Logic)
        // This prevents numbers like 322.581
        potentialAdd = Math.floor(potentialAdd * 100) / 100;

        const currentBalance = bucket.current_balance || 0;

        // 3. HARD CAP RULE:
        // Calculate how much space is strictly left in the bucket.
        const spaceRemaining = Math.max(0, bucket.target_amount - currentBalance);

        // 4. The actual amount to add is the smaller of:
        //    a) The calculated percentage share
        //    b) The remaining space (to prevent overflow)
        const actualAdd = Math.min(potentialAdd, spaceRemaining);

        return {
            ...bucket,
            projected_balance: currentBalance + actualAdd
        };
    });
};