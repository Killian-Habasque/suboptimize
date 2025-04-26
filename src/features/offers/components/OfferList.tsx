import React, { useState, useEffect } from 'react';
import OfferListItem from './OfferListItem';
import { useQuery } from '@tanstack/react-query';
import { debounce } from "lodash";
import { Offer, Category, Company } from "@prisma/client";

interface OfferWithRelations extends Offer {
    companies: Company[];
    categories: Category[];
}

const fetchOffers = async (page: number, limit: number, searchTerm: string) => {
    const response = await fetch(`/api/offers?page=${page}&limit=${limit}&searchTerm=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

const OfferList = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const limit = 10;

    useEffect(() => {
        const handler = debounce((value: string) => {
            setDebouncedSearchTerm(value);
        }, 500);
        handler(searchTerm);
        return () => handler.cancel();
    }, [searchTerm]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["offers", page, debouncedSearchTerm],
        queryFn: () => fetchOffers(page, limit, debouncedSearchTerm),
        placeholderData: (previousData) => previousData,
        staleTime: 10000,
        gcTime: 60000,
    });

    if (isLoading && !data) return <div className="text-center py-4">Chargement...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Une erreur est survenue</div>;

    return (
        <div className="space-y-4">
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Rechercher une offre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
            </div>

            {data?.offers.map((offer: OfferWithRelations) => (
                <div key={offer.id} className="bg-white rounded-lg shadow">
                    <div className="flex items-center px-4 py-2 bg-gray-50 rounded-t-lg">
                        <div className="bg-blue-100 rounded-full px-3 py-1 text-sm font-medium text-blue-800">
                            {offer.score || 70}
                        </div>
                    </div>
                    <OfferListItem
                        title={offer.name}
                        price={offer.price}
                        description={offer.description}
                        company={offer.companies[0]}
                        category={offer.categories[0]}
                        onClick={() => {}}
                    />
                </div>
            ))}

            {(!data?.offers || data.offers.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    Aucune offre trouvée
                </div>
            )}

            <div className="flex justify-center gap-4 mt-8">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-6 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                >
                    Précédent
                </button>
                <button
                    disabled={!data || data.offers.length < limit}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-6 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default OfferList; 