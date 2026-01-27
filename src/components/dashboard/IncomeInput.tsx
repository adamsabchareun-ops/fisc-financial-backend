import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface IncomeInputProps {
    amount: string;
    onAmountChange: (value: string) => void;
    onAllocate: () => void;
    isAllocating: boolean;
    showSuccess: boolean;
}

export const IncomeInput = ({ amount, onAmountChange, onAllocate, isAllocating, showSuccess }: IncomeInputProps) => {
    return (
        <Card title="Income Input" className="h-full">
            <div className="flex flex-col h-full justify-between gap-6">
                <div>
                    <label htmlFor="income" className="block text-sm font-medium text-text-charcoal mb-2">
                        Enter this week's income
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                        <input
                            type="number"
                            id="income"
                            value={amount}
                            onChange={(e) => onAmountChange(e.target.value)}
                            disabled={isAllocating}
                            className="w-full pl-8 pr-4 py-3 bg-[#F9F9F7] rounded-xl border-none focus:ring-2 focus:ring-primary-green/20 focus:outline-none transition-all text-lg font-medium text-text-charcoal placeholder:text-gray-400 disabled:opacity-50"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={onAllocate}
                        disabled={isAllocating || !amount || parseFloat(amount) <= 0}
                        className="w-full bg-[#4A5D4E] text-white rounded-xl hover:bg-[#3d4d40] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAllocating ? 'Saving...' : 'Allocate Funds'}
                    </Button>
                    {showSuccess && (
                        <p className="text-sm text-center text-green-600 font-medium animate-fade-in-up">
                            ✓ Allocated!
                        </p>
                    )}
                    {!showSuccess && (
                        <p className="text-xs text-center text-gray-500">
                            Funds will be distributed based on your bucket settings.
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
};
