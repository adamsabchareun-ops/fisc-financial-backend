import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    label?: string;
    className?: string;
}

export const ProgressBar = ({ value, max, label, className = '' }: ProgressBarProps) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-text-charcoal">{label}</span>
                    <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
                </div>
            )}
            <div className="h-2 w-full bg-[#E9F0E9] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#4A5D4E] transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
