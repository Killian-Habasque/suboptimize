import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, className, children }) => {
    return (
        <button
            onClick={onClick}
            className={`border border-gray-300 rounded-md py-2 px-4 text-sm flex gap-2 items-center font-medium shadow-xs cursor-pointer text-gray-700 hover:bg-gray-100 transition duration-200 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button; 