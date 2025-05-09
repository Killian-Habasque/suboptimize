import { NextResponse } from "next/server";
import { get_all_Offers } from "@/features/offers/offer-service";
import { prisma } from "@/lib/prisma";
import { baseAuth } from "@/lib/auth";
import { Prisma } from "@prisma/client"; // Importer le type Prisma si nécessaire

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const searchTerm = searchParams.get("searchTerm") || "";

    try {
        const { offers, lastDocId, totalOffers } = await get_all_Offers(page, limit, searchTerm);
        return NextResponse.json({
            offers,
            lastDoc: lastDocId,
            total: totalOffers
        });
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await baseAuth();

        if (!session?.user?.id) {
            console.error("Utilisateur non connecté");
            return new NextResponse("Non autorisé - Utilisateur non connecté", { status: 401 });
        }

        const {
            name,
            description,
            price,
            normalPrice,
            imageLink,
            promoCode,
            expirationDate,
            categoryIds,
            companyIds
        } = await request.json();

        const newOffer = await prisma.offer.create({
            data: {
                name,
                description,
                price,
                normalPrice,
                imageLink,
                promoCode,
                expirationDate: expirationDate ? new Date(expirationDate) : null,
                slug: name.toLowerCase().replace(/ /g, '-'),
                userId: session.user.id,
                categories: {
                    connect: categoryIds?.map((id: string) => ({ id })) || []
                },
                companies: {
                    connect: companyIds?.map((id: string) => ({ id })) || []
                }
            },
            include: {
                categories: true,
                companies: true
            }
        });

        return NextResponse.json(newOffer);
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'offre:", error);
        
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json({ error: "L'offre existe déjà avec ce nom." }, { status: 409 });
        }
        return NextResponse.json({ error: "Erreur lors de l'ajout de l'offre" }, { status: 500 });
    }
}