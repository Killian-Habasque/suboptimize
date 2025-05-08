import React, { useEffect, useState } from 'react';
import { get_popular_companies } from '../offer-service';
import { Company } from '@prisma/client';
import CompanyBubble from '@/components/ui/company-bubble';

const PopularCompanies = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const popularCompanies = await get_popular_companies();
                setCompanies(popularCompanies);
            } catch (error) {
                console.error('Error fetching companies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Marques populaires</h2>
                <div className="grid grid-cols-5 gap-4">
                    {[...Array(9)].map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center bg-white rounded-lg animate-pulse"
                        >
                            <div className="w-12 h-12 bg-gray-200 rounded-full" />
                            <div className="w-12 h-2 bg-gray-200 rounded mt-2" />
                        </div>
                    ))}
                </div>
                <div className="w-full h-10 bg-gray-200 rounded-md" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Marques populaires</h2>
            <div className="grid grid-cols-5 gap-4">
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className="flex flex-col items-center justify-center bg-white rounded-lg"
                    >
                        <CompanyBubble image={company?.imageLink ? company.imageLink : null} brandName={company.name || undefined} altText={company.name} variant="medium" />
                        <span className="text-xs text-gray-400 mt-2 font-medium">{company.name}</span>
                    </div>
                ))}
                <button className="w-full mt-4 text-xs text-center text-gray-400">
                    + 500 autres
                </button>
            </div>
            <button className='w-full justify-center border border-gray-300 rounded-md py-2 px-4 text-sm flex gap-2 items-center font-medium shadow-xs cursor-pointer text-gray-700 hover:bg-gray-100 transition duration-200'>
                En voir plus
            </button>
        </div>
    );
};

export default PopularCompanies; 