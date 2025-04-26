import React from 'react';
import Image from 'next/image';

const brands = [
    { name: 'Sosh', image: '/brands/sosh.png' },
    { name: 'Hellobank', image: '/brands/hellobank.png' },
    { name: 'Bouygues', image: '/brands/bouygues.png' },
    { name: 'Chatgpt', image: '/brands/chatgpt.png' },
    { name: 'Spotify', image: '/brands/spotify.png' },
    { name: 'Verisure', image: '/brands/verisure.png' },
    { name: 'Free', image: '/brands/free.png' },
    { name: 'Orange', image: '/brands/orange.png' },
    { name: 'Ovh', image: '/brands/ovh.png' },
];

const PopularBrands = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Marques populaires</h2>
            <div className="grid grid-cols-3 gap-4">
                {brands.map((brand) => (
                    <div
                        key={brand.name}
                        className="flex flex-col items-center justify-center p-2 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                        <div className="w-12 h-12 relative">
                            <Image
                                src={brand.image}
                                alt={brand.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-sm text-gray-600 mt-2">{brand.name}</span>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 text-center text-gray-600 hover:text-gray-800">
                + 500 autres
            </button>
        </div>
    );
};

export default PopularBrands; 