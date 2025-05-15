import React, { useEffect, useState } from 'react';
import { get_popular_companies } from '../offer-service';
import { Company } from '@prisma/client';
import CompanyBubble from '@/components/ui/company-bubble';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { buildUrlWithParams } from '@/services/utils';


const FIRST_LIMIT = 8;
const LOAD_MORE_LIMIT = 10;
const GRID_COLS = 5;

const PopularCompanies = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCompanies, setTotalCompanies] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const searchParams = useSearchParams();
    const currentCompany = searchParams.get('company');

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            try {
                let fetchedCompanies: Company[] = [];
                let total = 0;
                let more = false;
                if (page === 1) {
                    const response = await get_popular_companies(1, FIRST_LIMIT);
                    fetchedCompanies = response.companies;
                    total = response.total;
                    more = response.hasMore;
                    setCompanies(fetchedCompanies);
                } else {
                    let allCompanies: Company[] = [];
                    let fetched = 0;
                    let currentPage = 1;
                    let keepFetching = true;
                    while (keepFetching && fetched < (FIRST_LIMIT + (page - 1) * LOAD_MORE_LIMIT)) {
                        const limit = currentPage === 1 ? FIRST_LIMIT : LOAD_MORE_LIMIT;
                        const response = await get_popular_companies(currentPage, limit);
                        allCompanies = allCompanies.concat(response.companies);
                        total = response.total;
                        more = response.hasMore;
                        fetched += response.companies.length;
                        currentPage++;
                        keepFetching = response.hasMore && response.companies.length > 0;
                    }
                    setCompanies(allCompanies);
                }
                setTotalCompanies(total);
                setHasMore(more && companies.length < total);
            } catch (error) {
                console.error('Error fetching companies:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    if (loading && page === 1) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Marques populaires</h2>
                <div className="grid grid-cols-5 gap-4">
                    {[...Array(FIRST_LIMIT + 1)].map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center bg-white rounded-lg animate-pulse"
                        >
                            <div className="w-12 h-12 bg-gray-200 rounded-full" />
                            <div className="w-12 h-2 bg-gray-200 rounded mt-2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    const allCompanies = [
        { id: 'all', name: 'Tout', slug: '', imageLink: null } as Company,
        ...companies
    ];
    const remainingCompanies = totalCompanies - companies.length;

    const gridItems = allCompanies.map((company) => {
        if (company.id === 'all') {
            return (
                <Link
                    key={company.id}
                    href={buildUrlWithParams('/offres', searchParams, 'company', undefined)}
                    className={`flex flex-col items-center justify-center bg-white rounded-lg ${!currentCompany ? 'opacity-25' : ''}`}
                >
                    <CompanyBubble
                        image={null}
                        brandName="Tout"
                        altText="Toutes les marques"
                        variant="medium"
                    />
                    <span className="text-xs text-gray-400 mt-2 font-medium">Tout</span>
                </Link>
            );
        } else {
            const isActive = currentCompany === company.slug;
            return (
                <Link
                    key={company.id}
                    href={buildUrlWithParams('/offres', searchParams, 'company', isActive ? undefined : company.slug)}
                    className={`flex flex-col items-center justify-center bg-white rounded-lg ${isActive ? 'opacity-25' : ''}`}
                >
                    <CompanyBubble
                        image={company?.imageLink ? company.imageLink : null}
                        brandName={company.name || undefined}
                        altText={company.name}
                        variant="medium"
                    />
                    <span className="text-xs text-gray-400 mt-2 font-medium text-center">{company.name}</span>
                </Link>
            );
        }
    });

    if (hasMore && remainingCompanies > 0) {
        gridItems.push(
            <button
                key="more-count"
                className="flex flex-col items-center justify-center bg-white rounded-lg w-full h-full text-xs text-center text-gray-400"
                style={{ minHeight: 80 }}
                onClick={handleLoadMore}
            >
                + {remainingCompanies} autres
            </button>
        );
    }


    while (gridItems.length % GRID_COLS !== 0) {
        gridItems.push(<div key={`empty-${gridItems.length}`} />);
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Marques populaires</h2>
            <div className="grid grid-cols-5 gap-4">
                {gridItems}
            </div>
            {hasMore && (
                <button
                    className='w-full justify-center border border-gray-300 rounded-md py-2 px-4 text-sm flex gap-2 items-center font-medium shadow-xs cursor-pointer text-gray-700 hover:bg-gray-100 transition duration-200'
                    onClick={handleLoadMore}
                >
                    En voir plus
                </button>
            )}
        </div>
    );
};

export default PopularCompanies; 