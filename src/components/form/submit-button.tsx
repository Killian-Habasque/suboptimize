"use client"

import React, { MouseEvent } from 'react';
import Button from '@/components/ui/button';

interface SubmitButtonProps {
    children: React.ReactNode;
    className?: string;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
    children, 
    className = '', 
    loading = false,
    type = 'submit'
}) => {
    return (
        <Button
            type={type}
            className={`w-full bg-blue-600 text-white hover:bg-blue-700 ${className}`}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                if (loading) {
                    e.preventDefault();
                }
            }}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Chargement...</span>
                </div>
            ) : (
                children
            )}
        </Button>
    );
};

export default SubmitButton; 