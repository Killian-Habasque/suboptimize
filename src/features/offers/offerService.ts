import { prisma } from "@/lib/prisma";
import { Offer } from "@prisma/client";

export const get_all_Offers = async (page: number, limit: number, searchTerm: string): Promise<{ offers: Offer[], lastDocId?: string | undefined, totalOffers?: number | undefined }> => {
    try {
        const skip = (page - 1) * limit;

        const [offers, totalOffers] = await Promise.all([
            prisma.offer.findMany({
                where: {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.offer.count({
                where: {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
            }),
        ]);

        const lastDocId = (skip + limit < totalOffers) ? offers[offers.length - 1]?.id : undefined;

        return { offers, lastDocId, totalOffers };
    } catch (error) {
        console.error("Error fetching offers:", error);
        throw new Error("Failed to fetch offers");
    }
};