'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createAllocation } from '@/app/actions/createAllocation';

export const CreateBucketForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [percentage, setPercentage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const targetVal = parseFloat(target);
        const percentVal = parseFloat(percentage);

        // Client-side validation (basic)
        if (!name) {
            setError("Name is required");
            setIsLoading(false);
            return;
        }
        if (isNaN(targetVal) || targetVal < 0) {
            setError("Invalid goal amount");
            setIsLoading(false);
            return;
        }
        if (isNaN(percentVal) || percentVal < 0 || percentVal > 100) {
            setError("Percentage must be 0-100");
            setIsLoading(false);
            return;
        }

        const result = await createAllocation(name, targetVal, percentVal);

        if (result.success) {
            setIsOpen(false);
            setName('');
            setTarget('');
            setPercentage('');
        } else {
            setError(result.error || "Failed to create allocation");
        }
        setIsLoading(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#4A5D4E] text-white px-4 py-2 rounded-md hover:bg-[#3A4A3E] font-medium transition-colors"
            >
                + New Allocation
            </button>
        );
    }

    return (
        <Card className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-text-charcoal">Create New Bucket</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-charcoal mb-1">Bucket Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Emergency Fund"
                        className="w-full px-4 py-2 bg-[#F9F9F7] rounded-xl border-none focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-charcoal mb-1">Goal Amount ($)</label>
                        <input
                            type="number"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="10000"
                            className="w-full px-4 py-2 bg-[#F9F9F7] rounded-xl border-none focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-charcoal mb-1">Allocation %</label>
                        <input
                            type="number"
                            value={percentage}
                            onChange={(e) => setPercentage(e.target.value)}
                            placeholder="50"
                            className="w-full px-4 py-2 bg-[#F9F9F7] rounded-xl border-none focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-gray-500 hover:text-text-charcoal font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#4A5D4E] text-white px-4 py-2 rounded-md hover:bg-[#3A4A3E] font-medium transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Creating...' : 'Create Allocation'}
                    </button>
                </div>
            </form>
        </Card>
    );
};
