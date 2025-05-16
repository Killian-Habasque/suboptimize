import React, { useState, useEffect } from 'react';
import OfferListItem from './list-item-offer';
import { useQuery } from '@tanstack/react-query';
import { debounce } from "lodash";
import { Offer, Category, Company } from "@prisma/client";
import AddOfferDialog from './add-offer-dialog';
import LoadingCursor from '@/components/ui/loading-cursor';

interface OfferWithRelations extends Offer {
    companies: Company[];
    categories: Category[];
}

interface OfferListProps {
    categorySlug?: string | null;
    companySlug?: string | null;
}

const fetchOffers = async (page: number, limit: number, searchTerm: string, sortBy: 'recent' | 'ranking', categorySlug?: string | null, companySlug?: string | null) => {
    const response = await fetch(`/api/offers?page=${page}&limit=${limit + 1}&searchTerm=${encodeURIComponent(searchTerm)}&sortBy=${sortBy}${categorySlug ? `&category=${encodeURIComponent(categorySlug)}` : ''}${companySlug ? `&company=${encodeURIComponent(companySlug)}` : ''}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

const OfferList: React.FC<OfferListProps> = ({ categorySlug, companySlug }) => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<'recent' | 'ranking'>('recent');
    const limit = 10;
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const handler = debounce((value: string) => {
            setDebouncedSearchTerm(value);
        }, 500);
        handler(searchTerm);
        return () => handler.cancel();
    }, [searchTerm]);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["offers", page, debouncedSearchTerm, sortBy, categorySlug, companySlug],
        queryFn: () => fetchOffers(page, limit, debouncedSearchTerm, sortBy, categorySlug, companySlug),
        placeholderData: (previousData) => previousData,
        staleTime: 10000,
        gcTime: 60000,
    });

    if (isLoading && !data) return <div className="text-center py-4 h-[700px]">
        <div className="flex justify-center items-center">
            <LoadingCursor />
            Chargement...
        </div></div>;
    if (error) return <div className="text-center py-4 text-red-500">Une erreur est survenue</div>;

    const totalPages = Math.ceil((data?.total || 0) / limit);
    const displayedOffers = data?.offers?.slice(0, limit) || [];

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`px-3 py-1 rounded-md cursor-pointer ${page === i
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Rechercher une offre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full outline-none ring-1 ring-inset ring-gray-300 border-none rounded-lg"
                />
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="cursor-pointer whitespace-nowrap ml-6 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    Ajouter une offre
                </button>
            </div>

            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => {
                        setSortBy('recent');
                        setPage(1);
                    }}
                    className={`px-4 py-2 rounded-md ${
                        sortBy === 'recent'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    Les plus récentes
                </button>
                <button
                    onClick={() => {
                        setSortBy('ranking');
                        setPage(1);
                    }}
                    className={`px-4 py-2 rounded-md ${
                        sortBy === 'ranking'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    Les mieux notées
                </button>
            </div>

            {displayedOffers.map((offer: OfferWithRelations) => (
                <div key={offer.id} className='ring-1 ring-inset ring-gray-300 rounded-lg'>
                    <OfferListItem
                        title={offer.name}
                        price={offer.price}
                        normalPrice={offer.normalPrice}
                        description={offer.description}
                        company={offer.companies[0]}
                        category={offer.categories[0]}
                        preview={false}
                        slug={offer.slug}
                        rankingScore={offer.rankingScore}
                        createdAt={offer.createdAt}
                    />
                </div>
            ))}

            {(!displayedOffers || displayedOffers.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    Aucune offre trouvée
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
                    >
                        «
                    </button>
                    {renderPageNumbers()}
                    <button
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
                    >
                        »
                    </button>
                </div>
            )}

            <AddOfferDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    refetch();
                }}
            />
        </div>
    );
};

export default OfferList; 