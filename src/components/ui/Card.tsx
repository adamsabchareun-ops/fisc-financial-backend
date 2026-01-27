import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card = ({ children, className = '', title }: CardProps) => {
    return (
        <div className={`bg-white rounded-organic shadow-sm border border-[#F2F1ED] p-6 ${className}`}>
            {title && (
                <h3 className="text-text-charcoal font-bold tracking-tight text-xl mb-4">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};
