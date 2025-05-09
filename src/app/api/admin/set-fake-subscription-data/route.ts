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

        const fakeSubscriptions = [
            {
                title: "Abonnement Internet Fibre",
                slug: "abonnement-internet-fibre",
                price: 29.99,
                dueType: "monthly",
                dueDay: 1,
                startDatetime: new Date(),
                categories: [categories.find(c => c.slug === "internet")?.id],
                companies: [companies.find(c => c.slug === "free")?.id]
            },
            {
                title: "Abonnement Mobile 5G",
                slug: "abonnement-mobile-5g",
                price: 19.99,
                dueType: "monthly",
                dueDay: 15,
                startDatetime: new Date(),
                categories: [categories.find(c => c.slug === "telephone")?.id],
                companies: [companies.find(c => c.slug === "bouygues-telecom")?.id]
            },
            {
                title: "Abonnement Netflix Premium",
                slug: "abonnement-netflix-premium",
                price: 15.99,
                dueType: "monthly",
                dueDay: 5,
                startDatetime: new Date(),
                categories: [categories.find(c => c.slug === "internet")?.id],
                customCompany: "Netflix"
            },
            {
                title: "Abonnement Spotify Family",
                slug: "abonnement-spotify-family",
                price: 14.99,
                dueType: "monthly",
                dueDay: 20,
                startDatetime: new Date(),
                categories: [categories.find(c => c.slug === "internet")?.id],
                customCompany: "Spotify"
            }
        ];

        const createdSubscriptions = [];
        const skippedSubscriptions = [];

        for (const subscription of fakeSubscriptions) {
            const existingSubscription = await prisma.subscription.findFirst({
                where: {
                    slug: subscription.slug,
                    userId: adminUser.id
                }
            });

            if (existingSubscription) {
                skippedSubscriptions.push(subscription.slug);
                continue;
            }

            const newSubscription = await prisma.subscription.create({
                data: {
                    title: subscription.title,
                    slug: subscription.slug,
                    price: subscription.price,
                    dueType: subscription.dueType,
                    dueDay: subscription.dueDay,
                    startDatetime: subscription.startDatetime,
                    userId: adminUser.id,
                    customCompany: subscription.customCompany,
                    categories: {
                        connect: subscription.categories.map(id => ({ id }))
                    },
                    ...(subscription.companies && {
                        companies: {
                            connect: subscription.companies.map(id => ({ id }))
                        }
                    })
                }
            });
            createdSubscriptions.push(newSubscription);
        }

        return NextResponse.json({
            message: "Abonnements de test créés avec succès",
            created: createdSubscriptions,
            skipped: skippedSubscriptions
        }, { status: 201 });

    } catch (error) {
        if (error instanceof Error && error.message.includes("redirect")) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }
        console.error("Erreur lors de la création des abonnements de test:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création des abonnements de test" },
            { status: 500 }
        );
    }
}
