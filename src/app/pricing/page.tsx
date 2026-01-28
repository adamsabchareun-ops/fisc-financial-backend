import { Check } from 'lucide-react';

const PLANS = [
    {
        id: 'standard',
        title: 'Standard',
        price: '9.99',
        trial: '14 Days Free',
        billingText: '$0.00 due today. Automatically renews at standard rate after 14 days.',
        features: [
            'Income Tracking',
            'Weekly Budgeting',
            'Expense Logging'
        ],
        highlight: true,
        buttonText: 'Start 14-Day Free Trial',
        buttonStyle: 'primary'
    },
    {
        id: 'pro',
        title: 'Pro',
        price: '19.99',
        trial: null,
        features: [
            'Income Tracking',
            'Weekly Budgeting',
            'Expense Logging',
            'Financial Forecasting',
            'Export to CSV',
            'Priority Support'
        ],
        highlight: false,
        buttonText: 'Subscribe to Pro',
        buttonStyle: 'secondary'
    }
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#F9F9F7] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-text-charcoal tracking-tight sm:text-5xl mb-4">
                        Invest in your financial health.
                        <br />
                        <span className="text-[#4A5D4E]">Start for free.</span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                        Simple, powerful tools to manage your money without the complexity. Choose the plan that fits your goals.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-3xl p-8 transition-all duration-200 flex flex-col ${plan.highlight
                                    ? 'bg-white shadow-xl ring-2 ring-[#4A5D4E] scale-100 md:scale-105'
                                    : 'bg-white shadow-lg border border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-[#4A5D4E] text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-text-charcoal">{plan.title}</h3>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-5xl font-extrabold text-text-charcoal">${plan.price}</span>
                                    <span className="ml-2 text-gray-500 font-medium">/month</span>
                                </div>
                                {plan.trial && (
                                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {plan.trial}
                                    </div>
                                )}
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <Check className="h-6 w-6 text-[#4A5D4E]" />
                                        </div>
                                        <p className="ml-3 text-base text-gray-600">{feature}</p>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-6 border-t border-gray-50 mt-auto">
                                <button
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${plan.buttonStyle === 'primary'
                                            ? 'bg-[#4A5D4E] text-white hover:bg-[#3d4d40] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                            : 'bg-white text-text-charcoal border-2 border-gray-200 hover:border-[#4A5D4E] hover:text-[#4A5D4E]'
                                        }`}
                                >
                                    {plan.buttonText}
                                </button>
                                {plan.billingText && (
                                    <p className="mt-4 text-xs text-center text-gray-400 max-w-xs mx-auto">
                                        {plan.billingText}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust / Additional Info */}
                <div className="mt-20 text-center">
                    <p className="text-gray-400 text-sm">
                        Secure payments processed by Stripe. Cancel anytime in your dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
}
