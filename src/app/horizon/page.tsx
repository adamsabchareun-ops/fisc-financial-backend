'use client';

import React, { useState, useMemo } from 'react';
import { useHorizon } from '@/hooks/useHorizon';
import { IncomeInput } from '@/components/dashboard/IncomeInput';
import { BucketAllocations } from '@/components/dashboard/BucketAllocations';
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar';
import { calculateProjections } from '@/utils/finance';
import { allocateIncome } from '@/app/actions/allocate';

export default function HorizonPage() {
    const { currentWeek, buckets, isLoading, error, refreshData } = useHorizon();
    const [incomeInput, setIncomeInput] = useState('');
    const [isAllocating, setIsAllocating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAllocate = async () => {
        const income = parseFloat(incomeInput);
        if (!income || income <= 0) return;

        try {
            setIsAllocating(true);
            const result = await allocateIncome('user-id-placeholder', income, buckets);

            if (result.success) {
                setIncomeInput('');
                setShowSuccess(true);
                // Refresh data instantly
                await refreshData();

                // Hide success message after 3 seconds
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                alert(`Allocation failed: ${result.error}`);
            }
        } catch (err) {
            console.error("Allocation failed:", err);
            alert("An unexpected error occurred.");
        } finally {
            setIsAllocating(false);
        }
    };

    // Calculate projected buckets based on input
    const projectedBuckets = useMemo(() => {
        // Parse input amount (default to 0 if invalid)
        const income = parseFloat(incomeInput) || 0;

        return calculateProjections(income, buckets);
    }, [buckets, incomeInput]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7] font-sans text-[#2D2D2D]">
                <div className="text-center animate-pulse">
                    <h2 className="text-xl font-medium text-text-charcoal mb-2">We're updating your balances...</h2>
                    <p className="text-gray-400 text-sm">Just a moment while we crunch the numbers.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7] font-sans text-[#2D2D2D]">
                <div className="text-center">
                    <h2 className="text-xl font-medium text-red-600 mb-2">That didn't quite work, let's try again.</h2>
                    <p className="text-gray-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F9F9F7] p-8 md:p-10 font-sans text-[#2D2D2D]">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-charcoal tracking-tight">
                        Financial Horizon
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Your weekly financial health at a glance.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1: Income Input */}
                    <div className="lg:col-span-1">
                        <IncomeInput
                            amount={incomeInput}
                            onAmountChange={setIncomeInput}
                            onAllocate={handleAllocate}
                            isAllocating={isAllocating}
                            showSuccess={showSuccess}
                        />
                    </div>

                    {/* Card 2: Weekly Calendar - Show current week + maybe placeholders if needed, but for now just pass current week in array if it exists */}
                    <div className="lg:col-span-1">
                        <WeeklyCalendar payPeriods={currentWeek ? [currentWeek] : []} />
                    </div>

                    {/* Card 3: Bucket Allocations - Pass PROJECTED buckets */}
                    <div className="lg:col-span-1">
                        <BucketAllocations buckets={projectedBuckets} />
                    </div>
                </div>
            </div>
        </main>
    );
}
