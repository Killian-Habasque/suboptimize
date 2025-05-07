import React, { MouseEvent } from 'react';

interface ButtonProps {
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'dark' | 'light' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const variantClasses: Record<string, string> = {
    primary: 'bg-primary text-white hover:opacity-75',
    secondary: 'bg-secondary text-white hover:opacity-75',
    dark: 'bg-dark text-white hover:opacity-50',
    light: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizeClasses: Record<string, string> = {
    sm: 'py-1 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base',
};

const Button: React.FC<ButtonProps> = ({ 
    onClick, 
    className = '', 
    children, 
    type = 'button',
    variant = 'light',
    size = 'md',
    fullWidth = false
}) => {
    const baseClasses = 'rounded-md flex gap-2 justify-center items-center font-medium shadow-xs cursor-pointer transition duration-200';
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;