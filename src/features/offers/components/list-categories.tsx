"use client"
import React, { useEffect, useState } from 'react';
import CategoryBadge from '@/components/ui/category-badge';
import { getHeroIcon } from '@/lib/icon-helper';

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des catégories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div>Chargement des catégories...</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Catégories d&apos;offres</h2>
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                    const Icon = getHeroIcon(category.icon);
                    return (
                        <CategoryBadge
                            key={category.id}
                            icon={Icon ? <Icon className="w-5 h-5" /> : null}
                            label={category.name}
                            variant='secondary'
                        />
                    );
                })}
                {categories.length > 10 && (
                    <button className="text-gray-600">
                        + {categories.length - 10} autres
                    </button>
                )}
            </div>
            <button className='w-full justify-center border border-gray-300 rounded-md py-2 px-4 text-sm flex gap-2 items-center font-medium shadow-xs cursor-pointer text-gray-700 hover:bg-gray-100 transition duration-200'>
                En voir plus
            </button>
        </div>
    );
};

export default CategoryList; 