import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding subscriptions...');

    const adminUser = await prisma.user.findUnique({
        where: {
            email: "killian.habasque@gmail.com"
        }
    });

    if (!adminUser) {
        console.error("Admin user not found");
        return;
    }

    const categories = await prisma.category.findMany();
    const companies = await prisma.company.findMany();

    if (categories.length === 0 || companies.length === 0) {
        console.error("No categories or companies found");
        return;
    }


    const fakeSubscriptions = [
        // Abonnements liés aux offres
        {
            title: "Netflix Standard avec publicité",
            slug: "netflix-standard-avec-pub",
            price: 5.99,
            dueType: "monthly",
            dueDay: 29,
            startDatetime: new Date(2025, 1, 29),
            categories: [categories.find(c => c.slug === "streaming")?.id],
            companies: [companies.find(c => c.slug === "netflix")?.id]
        },
        {
            title: "Spotify Premium",
            slug: "spotify-premium",
            price: 9.99,
            dueType: "monthly",
            dueDay: 14,
            startDatetime: new Date(2025, 1, 14),
            categories: [categories.find(c => c.slug === "musique")?.id],
            companies: [companies.find(c => c.slug === "spotify")?.id]
        },
        {
            title: "Freebox Pop",
            slug: "freebox-pop",
            price: 29.99,
            dueType: "monthly",
            dueDay: 16,
            startDatetime: new Date(2025, 2, 16),
            categories: [categories.find(c => c.slug === "internet")?.id],
            companies: [companies.find(c => c.slug === "free")?.id]
        },
        {
            title: "Forfait Free Mobile 5G",
            slug: "free-mobile-5g",
            price: 19.99,
            dueType: "monthly",
            dueDay: 2,
            startDatetime: new Date(2025, 4, 2),
            categories: [categories.find(c => c.slug === "telephonie")?.id],
            companies: [companies.find(c => c.slug === "free")?.id]
        },
        {
            title: "Microsoft 365 Family",
            slug: "microsoft-365-family",
            price: 99.99,
            dueType: "yearly",
            dueDay: 2,
            startDatetime: new Date(2025, 4, 2),
            categories: [categories.find(c => c.slug === "logiciels")?.id],
            companies: [companies.find(c => c.slug === "microsoft")?.id]
        },
        // Abonnements personnalisés
        {
            title: "Assurance Habitation",
            slug: "assurance-habitation",
            price: 35.50,
            dueType: "monthly",
            dueDay: 4,
            startDatetime: new Date(2024, 10, 4),
            categories: [categories.find(c => c.slug === "assurance")?.id],
            companies: [companies.find(c => c.slug === "axa")?.id]
        },
        {
            title: "Abonnement Navigo",
            slug: "abonnement-navigo",
            price: 84.10,
            dueType: "monthly",
            dueDay: 25,
            startDatetime: new Date(2025, 4, 25),
            categories: [categories.find(c => c.slug === "transport")?.id],
            companies: [companies.find(c => c.slug === "ratp")?.id]
        },
        {
            title: "Salle de sport",
            slug: "salle-de-sport",
            price: 39.90,
            dueType: "monthly",
            dueDay: 24,
            startDatetime: new Date(2025, 3, 24),
            categories: [categories.find(c => c.slug === "sport")?.id],
            companies: [companies.find(c => c.slug === "keep-cool")?.id]
        },
        {
            title: "Cours de piano",
            slug: "cours-de-piano",
            price: 120,
            dueType: "monthly",
            dueDay: 7,
            startDatetime: new Date(2025, 3, 7),
            categories: [categories.find(c => c.slug === "formation")?.id],
            customCompany: "École de musique"
        },
        {
            title: "Coiffeur",
            slug: "coiffeur",
            price: 45,
            dueType: "monthly",
            dueDay: 8,
            startDatetime: new Date(2025, 4, 8),
            categories: [categories.find(c => c.slug === "maison")?.id],
            customCompany: "Salon de coiffure"
        },
        {
            title: "Cours de yoga",
            slug: "cours-de-yoga",
            price: 60,
            dueType: "monthly",
            dueDay: 8,
            startDatetime: new Date(2025, 3, 8),
            categories: [categories.find(c => c.slug === "sport")?.id],
            customCompany: "Studio de yoga"
        },
        {
            title: "Box de beauté",
            slug: "box-de-beaute",
            price: 29.90,
            dueType: "monthly",
            dueDay: 2,
            startDatetime: new Date(2025, 3, 2),
            categories: [categories.find(c => c.slug === "shopping")?.id],
            customCompany: "Birchbox"
        },
        {
            title: "Cours de langue",
            slug: "cours-de-langue",
            price: 79,
            dueType: "monthly",
            dueDay: 9,
            startDatetime: new Date(2025, 3, 9),
            categories: [categories.find(c => c.slug === "formation")?.id],
            customCompany: "Babbel"
        },
        {
            title: "Location de box",
            slug: "location-de-box",
            price: 89.90,
            dueType: "monthly",
            dueDay: 12,
            startDatetime: new Date(2025, 4, 12),
            categories: [categories.find(c => c.slug === "maison")?.id],
            customCompany: "Shurgard"
        },
        {
            title: "Abonnement presse",
            slug: "abonnement-presse",
            price: 19.99,
            dueType: "monthly",
            dueDay: 20,
            startDatetime: new Date(2025, 0, 20),
            categories: [categories.find(c => c.slug === "presse")?.id],
            companies: [companies.find(c => c.slug === "le-monde")?.id]
        }
    ];

    for (const subscription of fakeSubscriptions) {
        const existingSubscription = await prisma.subscription.findFirst({
            where: {
                slug: subscription.slug,
                userId: adminUser.id
            }
        });

        if (existingSubscription) {
            console.log(`Skipping existing subscription: ${subscription.slug}`);
            continue;
        }

        await prisma.subscription.create({
            data: {
                title: subscription.title,
                slug: subscription.slug,
                price: subscription.price,
                dueType: subscription.dueType,
                dueDay: subscription.dueDay,
                startDatetime: subscription.startDatetime,
                userId: adminUser.id,
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
        console.log(`Created subscription: ${subscription.slug}`);
    }

    console.log('Subscriptions seeding completed.');
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 