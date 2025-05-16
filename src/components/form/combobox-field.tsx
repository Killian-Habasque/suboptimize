"use client"

import React from 'react';
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react';

interface ComboboxFieldProps<T> {
    id: string;
    label: string;
    value: T | null;
    onChange: (value: T) => void;
    options: T[];
    displayValue: (value: T | null) => string;
    onSearch: (query: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const ComboboxField = <T extends { id: string; name: string }>({
    id,
    label,
    value,
    onChange,
    options,
    displayValue,
    onSearch,
    placeholder = "Rechercher...",
    disabled = false,
    className = "",
}: ComboboxFieldProps<T>) => {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <Combobox value={value} onChange={onChange}>
                <ComboboxInput
                    id={id}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
                    displayValue={displayValue}
                    onChange={(event) => onSearch(event.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <ComboboxOptions className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {options.map((option) => (
                        <ComboboxOption
                            key={option.id}
                            value={option}
                            className={({ active }) =>
                                `px-4 py-2 cursor-pointer ${
                                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                }`
                            }
                        >
                            {option.name}
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    );
};

export default ComboboxField; 