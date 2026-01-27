import React from 'react';
import { Card } from '../ui/Card';
import { PayPeriod } from '../../hooks/useHorizon';

interface WeeklyCalendarProps {
    payPeriods: PayPeriod[];
}

export const WeeklyCalendar = ({ payPeriods }: WeeklyCalendarProps) => {
    return (
        <Card title="Weekly View" className="h-full">
            <div className="space-y-4">
                {payPeriods.map((period) => {
                    const startDate = new Date(period.start_date);
                    const endDate = new Date(period.end_date);
                    const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
                    const dateRange = `${startDate.toLocaleDateString('en-US', dateOptions)} - ${endDate.toLocaleDateString('en-US', dateOptions)}`;

                    return (
                        <div
                            key={period.id}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${period.is_current
                                ? 'bg-soft-sage/30 border-primary-green/20'
                                : 'bg-white border-[#F2F1ED] hover:border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${period.is_current ? 'bg-primary-green' : 'bg-gray-300'}`} />
                                <div>
                                    <p className={`text-sm font-medium ${period.is_current ? 'text-text-charcoal' : 'text-gray-600'}`}>
                                        {dateRange}
                                    </p>
                                    {period.is_current && <span className="text-[10px] uppercase tracking-wider font-bold text-primary-green">Current Week</span>}
                                </div>
                            </div>
                            <div>
                                <span className="font-semibold text-text-charcoal">${period.total_income.toLocaleString()}</span>
                            </div>
                        </div>
                    );
                })}

                <div className="pt-2 text-center">
                    <button className="bg-[#4A5D4E] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#3d4d40] transition-colors">
                        View Past Weeks
                    </button>
                </div>
            </div>
        </Card>
    );
};
