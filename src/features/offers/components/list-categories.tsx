"use client"
import React, { useEffect, useState } from 'react';
import CategoryBadge from '@/components/ui/category-badge';
import { getHeroIcon } from '@/lib/icon-helper';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

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
        return <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Catégories d&apos;offres</h2>
            <div className="flex flex-wrap gap-2">
                {[...Array(8)].map((_, index) => (
                    <div
                        key={index}
                        className="flex flex-wrap bg-white animate-pulse"
                    >
                        <div className="w-20 h-6 bg-gray-200 rounded-full mt-2" />
                    </div>
                ))}
            </div>
        </div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Catégories d&apos;offres</h2>
            <div className="flex flex-wrap gap-2">
                <Link 
                    href="/offres"
                    className={!currentCategory ? 'opacity-50' : ''}
                >
                    <CategoryBadge
                        icon={null}
                        label="Tout"
                        variant='secondary'
                    />
                </Link>
                {categories.map((category) => {
                    const Icon = getHeroIcon(category.icon);
                    const isActive = currentCategory === category.slug;
                    return (
                        <Link 
                            key={category.id} 
                            href={isActive ? '/offres' : `/offres?category=${category.slug}`}
                            className={isActive ? 'opacity-50' : ''}
                        >
                            <CategoryBadge
                                icon={Icon ? <Icon className="w-5 h-5" /> : null}
                                label={category.name}
                                variant='secondary'
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryList; 