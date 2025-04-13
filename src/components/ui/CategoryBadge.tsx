import React from 'react';

interface CategoryBadgeProps {
    icon: React.ReactNode;
    label: string;
    className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ icon, label, className }) => {
    return (
        <div className={`text-sm py-1 px-4 text-gray-500 rounded-full flex gap-2 items-center font-normal ${className}`}>
            {icon}
            {label}
        </div>
    );
};

export default CategoryBadge; 