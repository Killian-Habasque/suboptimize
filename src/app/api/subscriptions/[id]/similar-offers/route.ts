import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { baseAuth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await baseAuth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { id } = await params;

        const subscription = await prisma.subscription.findFirst({
            where: {
                id: id,
                userId: session.user.id,
            },
            include: {
                categories: true,
                companies: true,
            },
        });

        if (!subscription) {
            return NextResponse.json({ error: "Abonnement non trouvé" }, { status: 404 });
        }

        const linkedOffer = await prisma.offer.findFirst({
            where: {
                AND: [
                    {
                        name: {
                            contains: subscription.title,
                            mode: 'insensitive'
                        }
                    },
                    {
                        companies: {
                            some: {
                                id: {
                                    in: subscription.companies.map(company => company.id)
                                }
                            }
                        }
                    }
                ]
            }
        });

        const whereCondition: Prisma.OfferWhereInput = {
            OR: [
                {
                    categories: {
                        some: {
                            id: {
                                in: subscription.categories.map(cat => cat.id)
                            }
                        }
                    }
                },
                {
                    name: {
                        contains: subscription.title,
                        mode: 'insensitive'
                    }
                }
            ]
        };

        if (linkedOffer) {
            whereCondition.AND = [{
                id: {
                    not: linkedOffer.id
                }
            }];
        }
        
        const similarOffers = await prisma.offer.findMany({
            where: whereCondition,
            include: {
                companies: true,
                categories: true,
            },
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(similarOffers);
    } catch (error) {
        console.error("Error fetching similar offers:", error);
        return NextResponse.json(
            { error: "Failed to fetch similar offers" },
            { status: 500 }
        );
    }
} 