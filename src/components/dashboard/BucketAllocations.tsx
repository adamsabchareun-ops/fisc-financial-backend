import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { ProjectedBucket } from '../../utils/finance';

interface BucketAllocationsProps {
    buckets: ProjectedBucket[];
}

export const BucketAllocations = ({ buckets }: BucketAllocationsProps) => {
    const totalTarget = buckets.reduce((acc, b) => acc + b.target_amount, 0);
    const totalCurrent = buckets.reduce((acc, b) => acc + (b.current_balance || 0), 0);
    const totalProjected = buckets.reduce((acc, b) => acc + (b.projected_balance || 0), 0);
    const hasProjection = totalProjected > totalCurrent;

    return (
        <Card title="Pay Allocations" className="h-full">
            <div className="space-y-6">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <p className="text-sm text-gray-500">Total Saved</p>
                        <p className="text-2xl font-bold text-text-charcoal">
                            ${totalCurrent.toLocaleString()}
                            {hasProjection && (
                                <span className="text-gray-400 text-lg font-normal ml-2">
                                    {`-> $${totalProjected.toLocaleString()}`}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Goal</p>
                        <p className="font-medium text-text-charcoal">${totalTarget.toLocaleString()}</p>
                    </div>
                </div>

                <div className="space-y-5">
                    {buckets.map((bucket) => {
                        const current = bucket.current_balance || 0;
                        const projected = bucket.projected_balance || current;
                        const isProjected = projected > current;

                        // Calculate percentages for bars
                        // Solid bar width (based on current)
                        const currentPercent = Math.min((current / bucket.target_amount) * 100, 100);

                        // Ghost bar width (the added part)
                        // If projected exceeds target, we cap visually at 100% total
                        const projectedTotalPercent = Math.min((projected / bucket.target_amount) * 100, 100);
                        const ghostPercent = Math.max(0, projectedTotalPercent - currentPercent);

                        return (
                            <div key={bucket.id}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">{bucket.name}</span>
                                    <span className="text-gray-500">
                                        ${current.toLocaleString()}
                                        {isProjected && ` -> $${projected.toLocaleString()}`}
                                        {' / '}${bucket.target_amount.toLocaleString()}
                                    </span>
                                </div>

                                {/* Custom Progress Bar with Ghost Segment */}
                                <div className="h-2 w-full bg-[#E9F0E9] rounded-full overflow-hidden flex">
                                    {/* Solid Bar */}
                                    <div
                                        className="h-full bg-[#4A5D4E] transition-all duration-300"
                                        style={{ width: `${currentPercent}%` }}
                                    />
                                    {/* Ghost Bar */}
                                    {ghostPercent > 0 && (
                                        <div
                                            className="h-full bg-[#8FA393] opacity-60 transition-all duration-300"
                                            style={{ width: `${ghostPercent}%` }}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="pt-4 border-t border-[#F2F1ED] mt-4">
                    <Link href="/buckets" className="text-[#4A5D4E] text-sm font-medium hover:underline">
                        Manage Allocations
                    </Link>
                </div>
            </div>
        </Card>
    );
};
