/**
 * Types for Allocation Rules
 */
type AllocationRule = {
    categoryId: string;
    name: string;
    percentage?: number; // e.g., 20 for 20%
    fixedAmountCents?: number; // e.g., 5000 for $50.00
};

type AllocationResult = {
    categoryId: string;
    amountCents: number;
};

/**
 * Calculates how a paycheck should be split based on user rules.
 * Logic:
 * 1. Deduct all fixed amounts first.
 * 2. Calculate percentages on the REMAINING amount (or total, depending on preference - here we use Total for simplicity).
 * 3. Validate that we don't exceed the total income.
 * * @param totalIncomeCents The total paycheck amount
 * @param rules Array of allocation rules
 */
export const calculatePaycheckSplit = (totalIncomeCents: number, rules: AllocationRule[]): AllocationResult[] => {
    let remainingIncome = totalIncomeCents;
    const results: AllocationResult[] = [];
    let totalAllocated = 0;

    // 1. Process Fixed Amounts
    for (const rule of rules) {
        if (rule.fixedAmountCents) {
            const amount = rule.fixedAmountCents;
            results.push({ categoryId: rule.categoryId, amountCents: amount });
            totalAllocated += amount;
            remainingIncome -= amount;
        }
    }

    // 2. Process Percentages (applied to the ORIGINAL total, usually)
    for (const rule of rules) {
        if (rule.percentage && !rule.fixedAmountCents) {
            // Calculate share: (Total * Percentage) / 100
            const amount = Math.floor((totalIncomeCents * rule.percentage) / 100);
            results.push({ categoryId: rule.categoryId, amountCents: amount });
            totalAllocated += amount;
        }
    }

    // Safety Check: Don't allocate money you don't have
    if (totalAllocated > totalIncomeCents) {
        console.warn('Warning: Allocations exceed income!');
        // In a real app, you might throw an error or adjust the last allocation
    }

    return results;
};

/**
 * Formats cents into a readable USD string.
 * @param cents e.g. 1050
 * @returns "$10.50"
 */
export const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cents / 100);
};
