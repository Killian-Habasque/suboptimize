import React, { MouseEvent } from 'react';

interface ButtonProps {
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ onClick, className, children, type = 'button' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`border border-gray-300 rounded-md py-2 px-4 text-sm flex gap-2 justify-center items-center font-medium shadow-xs cursor-pointer text-gray-700 hover:bg-gray-100 transition duration-200 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;