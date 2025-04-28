import React from 'react';
import { PhoneIcon, MusicalNoteIcon, HomeIcon, WifiIcon, HeartIcon, BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import CategoryBadge from '@/components/ui/CategoryBadge';

const categories = [
    { name: 'Téléphone', icon: PhoneIcon },
    { name: 'Musique', icon: MusicalNoteIcon },
    { name: 'Maison', icon: HomeIcon },
    { name: 'Internet', icon: WifiIcon },
    { name: 'Santé', icon: HeartIcon },
    { name: 'Électricité', icon: BoltIcon },
    { name: 'Assurance', icon: ShieldCheckIcon },
];

const CategoryList = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Catégories d&apos;offres</h2>
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                        <CategoryBadge
                            key={category.name}
                            icon={<Icon className="w-5 h-5" />}
                            label={category.name}
                            variant='secondary'
                        />
                    );
                })}
                <button className="text-gray-600">
                    + 10 autres
                </button>
            </div>
            <button className='w-full justify-center border border-gray-300 rounded-md py-2 px-4 text-sm flex gap-2 items-center font-medium shadow-xs cursor-pointer text-gray-700 hover:bg-gray-100 transition duration-200'>
                En voir plus
            </button>
        </div>
    );
};

export default CategoryList; 