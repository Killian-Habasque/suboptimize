import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requiredAdmin } from "@/lib/auth-helper";

export async function POST() {
    try {
        await requiredAdmin();

        const adminUser = await prisma.user.findUnique({
            where: {
                email: "killian.habasque@gmail.com"
            }
        });

        if (!adminUser) {
            return NextResponse.json(
                { error: "Utilisateur admin non trouvé" },
                { status: 404 }
            );
        }

        const categories = await prisma.category.findMany();
        const companies = await prisma.company.findMany();

        if (categories.length === 0 || companies.length === 0) {
            return NextResponse.json(
                { error: "Aucune catégorie ou entreprise trouvée" },
                { status: 404 }
            );
        }

        const fakeOffers = [
            {
                name: "Offre Internet Fibre",
                slug: "offre-internet-fibre",
                description: "Offre internet fibre optique à très haut débit",
                price: 29.99,
                normalPrice: 39.99,
                promoCode: "FIBRE2024",
                expirationDate: new Date("2024-12-31"),
                rankingScore: 4.5,
                categories: [categories.find(c => c.slug === "internet")?.id],
                companies: [companies.find(c => c.slug === "free")?.id]
            },
            {
                name: "Forfait Mobile 5G",
                slug: "forfait-mobile-5g",
                description: "Forfait mobile illimité avec 5G",
                price: 19.99,
                normalPrice: 24.99,
                promoCode: "MOBILE2024",
                expirationDate: new Date("2024-12-31"),
                rankingScore: 4.2,
                categories: [categories.find(c => c.slug === "telephone")?.id],
                companies: [companies.find(c => c.slug === "bouygues-telecom")?.id]
            }
        ];

        const createdOffers = [];
        const skippedOffers = [];

        for (const offer of fakeOffers) {
            const existingOffer = await prisma.offer.findFirst({
                where: {
                    slug: offer.slug,
                    userId: adminUser.id
                }
            });

            if (existingOffer) {
                skippedOffers.push(offer.slug);
                continue;
            }

            const newOffer = await prisma.offer.create({
                data: {
                    name: offer.name,
                    slug: offer.slug,
                    description: offer.description,
                    price: offer.price,
                    normalPrice: offer.normalPrice,
                    promoCode: offer.promoCode,
                    expirationDate: offer.expirationDate,
                    rankingScore: offer.rankingScore,
                    userId: adminUser.id,
                    categories: {
                        connect: offer.categories.map(id => ({ id }))
                    },
                    companies: {
                        connect: offer.companies.map(id => ({ id }))
                    }
                }
            });
            createdOffers.push(newOffer);
        }

        return NextResponse.json({
            message: "Offres de test créées avec succès",
            created: createdOffers,
            skipped: skippedOffers
        }, { status: 201 });

    } catch (error) {
        if (error instanceof Error && error.message.includes("redirect")) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }
        console.error("Erreur lors de la création des offres de test:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création des offres de test" },
            { status: 500 }
        );
    }
} 