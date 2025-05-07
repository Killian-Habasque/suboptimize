import React from 'react';

interface CategoryBadgeProps {
    icon: React.ReactNode;
    label: string;
    className?: string;
    variant?: 'primary' | 'secondary' | 'dark' | 'light';
}

const variantClasses: Record<string, string> = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    dark: 'bg-gray-800 text-white',
    light: 'text-gray-700',
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ icon, label, className = '', variant = 'light' }) => {
    return (
        <div
            className={`text-sm py-1 px-3 rounded-full flex gap-2 items-center font-normal ${variantClasses[variant]} ${className}`}
        >
            {icon}
            {label}
        </div>
    );
};

export default CategoryBadge;