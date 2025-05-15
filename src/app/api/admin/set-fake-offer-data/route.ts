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
            // Streaming
            {
                name: "Netflix Standard avec publicité",
                slug: "netflix-standard-avec-pub",
                description: "Netflix avec publicité, 2 appareils simultanés, 1080p",
                price: 5.99,
                link: "https://www.netflix.com/fr/",
                normalPrice: 13.49,
                promoCode: null,
                expirationDate: null,
                rankingScore: 4,
                categories: [categories.find(c => c.slug === "streaming")?.id],
                companies: [companies.find(c => c.slug === "netflix")?.id]
            },
            {
                name: "Disney+ Standard",
                slug: "disney-plus-standard",
                description: "Disney+ avec publicité, 2 appareils simultanés, 1080p",
                price: 5.99,
                link: "https://www.disneyplus.com/fr-fr",
                normalPrice: 8.99,
                promoCode: null,
                expirationDate: null,
                rankingScore: 3,
                categories: [categories.find(c => c.slug === "streaming")?.id],
                companies: [companies.find(c => c.slug === "disney-plus")?.id]
            },
            // Musique
            {
                name: "Spotify Premium",
                slug: "spotify-premium",
                description: "Spotify Premium sans publicité, qualité audio élevée",
                price: 9.99,
                link: "https://www.spotify.com/fr/premium/",
                normalPrice: 9.99,
                promoCode: null,
                expirationDate: null,
                rankingScore: 5,
                categories: [categories.find(c => c.slug === "musique")?.id],
                companies: [companies.find(c => c.slug === "spotify")?.id]
            },
            // Téléphonie
            {
                name: "Forfait Free Mobile 5G",
                slug: "free-mobile-5g",
                description: "Forfait 5G illimité avec 210 Go en Europe",
                price: 19.99,
                link: "https://mobile.free.fr/",
                normalPrice: 19.99,
                promoCode: null,
                expirationDate: null,
                rankingScore: 6,
                categories: [categories.find(c => c.slug === "telephonie")?.id],
                companies: [companies.find(c => c.slug === "free")?.id]
            },
            // Internet
            {
                name: "Freebox Pop",
                slug: "freebox-pop",
                description: "Fibre optique jusqu'à 5 Gb/s, TV incluse",
                price: 29.99,
                link: "https://www.free.fr/adsl/",
                normalPrice: 29.99,
                promoCode: null,
                expirationDate: null,
                rankingScore: 4,
                categories: [categories.find(c => c.slug === "internet")?.id],
                companies: [companies.find(c => c.slug === "free")?.id]
            },
            // Logiciels
            {
                name: "Microsoft 365 Family",
                slug: "microsoft-365-family",
                description: "Office 365 pour 6 personnes, 1 To OneDrive par personne",
                price: 99.99,
                link: "https://www.microsoft.com/fr-fr/microsoft-365/family",
                normalPrice: 99.99,
                promoCode: null,
                expirationDate: null,
                rankingScore: 10,
                categories: [categories.find(c => c.slug === "logiciels")?.id],
                companies: [companies.find(c => c.slug === "microsoft")?.id]
            },
            // Livraison
            {
                name: "Uber Eats Pass",
                slug: "uber-eats-pass",
                description: "Livraison gratuite illimitée, réductions exclusives",
                price: 4.99,
                link: "https://www.ubereats.com/fr",
                normalPrice: 4.99,
                promoCode: null,
                expirationDate: null,
                rankingScore: 2,
                categories: [categories.find(c => c.slug === "livraison")?.id],
                companies: [companies.find(c => c.slug === "uber-eats")?.id]
            },
            // Shopping
            {
                name: "Amazon Prime",
                slug: "amazon-prime",
                description: "Livraison gratuite en 1 jour, Prime Video, Prime Music",
                price: 49.99,
                link: "https://www.amazon.fr/prime",
                normalPrice: 49.99,
                promoCode: null,
                expirationDate: null,
                rankingScore: -10,
                categories: [categories.find(c => c.slug === "shopping")?.id],
                companies: [companies.find(c => c.slug === "amazon")?.id]
            },
            // Assurance
            {
                name: "MAIF Auto",
                slug: "maif-auto",
                description: "Assurance auto tous risques avec assistance 24/7",
                price: 45.00,
                link: "https://www.maif.fr/assurance-auto",
                normalPrice: 45.00,
                promoCode: null,
                expirationDate: null,
                rankingScore: 6,
                categories: [categories.find(c => c.slug === "assurance")?.id],
                companies: [companies.find(c => c.slug === "maif")?.id]
            },
            // Transport
            {
                name: "Navigo Mois",
                slug: "navigo-mois",
                description: "Pass illimité pour tous les transports en Île-de-France",
                price: 84.10,
                link: "https://www.navigo.fr/",
                normalPrice: 84.10,
                promoCode: null,
                expirationDate: null,
                rankingScore: 0,
                categories: [categories.find(c => c.slug === "transport")?.id],
                companies: [companies.find(c => c.slug === "ratp")?.id]
            },
            // Sport
            {
                name: "Basic-Fit Premium",
                slug: "basic-fit-premium",
                description: "Accès à toutes les salles Basic-Fit, cours collectifs inclus",
                price: 29.99,
                link: "https://www.basic-fit.com/fr-fr/abonnements",
                normalPrice: 29.99,
                promoCode: null,
                expirationDate: null,
                rankingScore: -3,
                categories: [categories.find(c => c.slug === "sport")?.id],
                companies: [companies.find(c => c.slug === "basic-fit")?.id]
            },
            // Jeux vidéo
            {
                name: "Xbox Game Pass Ultimate",
                slug: "xbox-game-pass-ultimate",
                description: "Accès à plus de 100 jeux, Xbox Live Gold inclus",
                price: 14.99,
                link: "https://www.xbox.com/fr-FR/games/store/xbox-game-pass-ultimate/cfq7ttc0khs0",
                normalPrice: 14.99,
                promoCode: null,
                expirationDate: null,
                rankingScore: 5,
                categories: [categories.find(c => c.slug === "jeux-video")?.id],
                companies: [companies.find(c => c.slug === "xbox")?.id]
            },
            // Presse
            {
                name: "Le Monde Digital",
                slug: "le-monde-digital",
                description: "Accès illimité au site et à l'application Le Monde",
                price: 19.99,
                link: "https://boutique.lemonde.fr/",
                normalPrice: 19.99,
                promoCode: null,
                expirationDate: null,
                rankingScore: 2,
                categories: [categories.find(c => c.slug === "presse")?.id],
                companies: [companies.find(c => c.slug === "le-monde")?.id]
            },
            // Formation
            {
                name: "LinkedIn Premium Business",
                slug: "linkedin-premium-business",
                description: "Accès aux outils de recrutement et de développement business",
                price: 59.99,
                link: "https://www.linkedin.com/premium/products",
                normalPrice: 59.99,
                promoCode: null,
                expirationDate: null,
                rankingScore: -30,
                categories: [categories.find(c => c.slug === "formation")?.id],
                companies: [companies.find(c => c.slug === "linkedin")?.id]
            },
            // Stockage
            {
                name: "Google One 2 To",
                slug: "google-one-2to",
                description: "2 To de stockage Google Drive, VPN inclus",
                price: 9.99,
                link: "https://one.google.com/",
                normalPrice: 9.99,
                promoCode: null,
                expirationDate: null,
                rankingScore: 30,
                categories: [categories.find(c => c.slug === "stockage")?.id],
                companies: [companies.find(c => c.slug === "google")?.id]
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
                    link: offer.link,
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