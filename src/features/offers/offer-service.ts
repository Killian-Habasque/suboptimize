import { prisma } from "@/lib/prisma";
import { Offer, Prisma } from "@prisma/client";

export interface OfferFormData {
    name: string;
    description: string;
    price: string;
    normalPrice: string;
    link?: string;
    promoCode?: string;
    expirationDate?: string;
    category: { id: string; name: string } | null;
    company: { id: string; name: string } | null;
}

export interface OfferApiData {
    name: string;
    description: string;
    price: number;
    normalPrice: number;
    link?: string;
    promoCode?: string;
    expirationDate?: string;
    slug: string;
    userId: string;
    categoryIds: string[];
    companyIds: string[];
}

export const get_all_Offers = async (page: number, limit: number, searchTerm: string, sortBy: 'recent' | 'ranking' = 'recent', categorySlug?: string | null, companySlug?: string | null): Promise<{ offers: Offer[], lastDocId?: string | undefined, totalOffers?: number | undefined }> => {
    try {
        const skip = (page - 1) * limit;

        const whereClause: Prisma.OfferWhereInput = {
            name: {
                contains: searchTerm,
                mode: 'insensitive',
            },
        };

        if (categorySlug) {
            whereClause.categories = {
                some: {
                    slug: categorySlug
                }
            };
        }

        if (companySlug) {
            whereClause.companies = {
                some: {
                    slug: companySlug
                }
            };
        }

        const [offers, totalOffers] = await Promise.all([
            prisma.offer.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: sortBy === 'recent'
                    ? { createdAt: 'desc' }
                    : [
                        { rankingScore: 'desc' },
                        { createdAt: 'desc' }
                    ],
                include: {
                    companies: true,
                    categories: true,
                },
            }),
            prisma.offer.count({
                where: whereClause,
            }),
        ]);

        if (sortBy === 'ranking') {
            offers.sort((a, b) => {
                const scoreA = a.rankingScore || 0;
                const scoreB = b.rankingScore || 0;
                return scoreB - scoreA;
            });
        }

        const lastDocId = (skip + limit < totalOffers) ? offers[offers.length - 1]?.id : undefined;

        return { offers, lastDocId, totalOffers };
    } catch (error) {
        console.error("Error fetching offers:", error);
        throw new Error("Failed to fetch offers");
    }
};

export const add_Offer = async (data: OfferApiData): Promise<void> => {
    const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'offre');
    }
};

export const get_popular_companies = async (page: number = 1, limit: number = 8) => {
    try {
        const response = await fetch(`/api/companies/popular?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch popular companies');
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching popular companies:", error);
        throw new Error("Failed to fetch popular companies");
    }
};
