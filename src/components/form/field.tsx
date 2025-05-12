"use client"

import React from 'react';
import { UseFormRegister, FieldValues, FieldErrors, Path } from 'react-hook-form';

interface FieldProps<T extends FieldValues> {
    id: string;
    label: string;
    type?: 'text' | 'number' | 'email' | 'password' | 'file' | 'textarea' | 'date';
    placeholder?: string;
    required?: boolean;
    accept?: string;
    register: UseFormRegister<T>;
    name: Path<T>;
    errors?: FieldErrors<T>;
    className?: string;
    step?: string;
    disabled?: boolean;
}

const Field = <T extends FieldValues>({ 
    id, 
    label, 
    type = 'text',
    placeholder = '',
    required = false,
    accept,
    register,
    name,
    errors,
    className = '',
    step = type === 'number' ? '0.01' : undefined,
    disabled = false
}: FieldProps<T>) => {
    const error = errors?.[name];
    const isTextarea = type === 'textarea';

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            {isTextarea ? (
                <textarea
                    id={id}
                    {...register(name)}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    step={step}
                    {...register(name)}
                    placeholder={placeholder}
                    required={required}
                    accept={accept}
                    disabled={disabled}
                    className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
                />
            )}
            {error && (
                <p className="text-sm text-red-600 mt-1">
                    {error.message as string}
                </p>
            )}
        </div>
    );
};

export default Field;
