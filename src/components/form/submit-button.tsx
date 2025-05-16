"use client"

import React, { MouseEvent } from 'react';
import Button from '@/components/ui/button';

interface SubmitButtonProps {
    children: React.ReactNode;
    className?: string;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'dark' | 'light' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
    children, 
    className = '', 
    loading = false,
    type = 'submit',
    variant = 'primary',
    size = 'md'
}) => {
    return (
        <Button
            type={type}
            variant={variant}
            size={size}
            fullWidth
            className={className}
            onClick={(e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
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