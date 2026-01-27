'use client';
import React from 'react';
import { useSessionStore } from '../stores/sessionStore';

export const Dashboard = () => {
    const { financialData } = useSessionStore();

    if (!financialData) return null;

    const totalNetWorth = financialData.accounts.reduce((sum, acc) => sum + acc.balance_current, 0);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
            <header className="flex justify-between items-center pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800">Your Digital Briefcase</h1>
                <span className="text-xs text-gray-400">
                    Synced: {new Date(financialData.timestamp).toLocaleTimeString()}
                </span>
            </header>

            {/* Net Worth Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                <h2 className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-2">Total Net Worth</h2>
                <div className="text-5xl font-bold">
                    ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Accounts List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Accounts</h3>
                    <div className="space-y-3">
                        {financialData.accounts.map(acc => (
                            <div key={acc.id} className="flex justify-between items-center py-2 border-b border-dashed border-gray-100 last:border-0">
                                <div>
                                    <p className="font-medium text-gray-700">{acc.name}</p>
                                    <p className="text-xs text-gray-400 capitalize">{acc.type}</p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                    ${acc.balance_current.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
                    <div className="space-y-4">
                        {financialData.transactions.slice(0, 5).map(tx => (
                            <div key={tx.id} className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-gray-700">{tx.payee}</p>
                                    <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                                <p className={`font-semibold ${tx.amount < 0 ? 'text-gray-900' : 'text-green-600'}`}>
                                    {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
