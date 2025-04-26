import React from 'react';
import { PhoneIcon, MusicalNoteIcon, HomeIcon, WifiIcon, HeartIcon, BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

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
                        <button
                            key={category.name}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                        >
                            <Icon className="w-5 h-5" />
                            <span>{category.name}</span>
                        </button>
                    );
                })}
            </div>
            <button className="w-full mt-4 text-center text-gray-600 hover:text-gray-800">
                + 10 autres
            </button>
        </div>
    );
};

export default CategoryList; 