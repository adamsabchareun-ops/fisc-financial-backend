import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
    const baseStyles = "px-6 py-3 rounded-xl font-medium transition-colors duration-200 cursor-pointer";
    const variants = {
        primary: "bg-primary-green text-white hover:bg-[#3d4d40]",
        secondary: "bg-soft-sage text-text-charcoal hover:bg-[#dce3dc]",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
