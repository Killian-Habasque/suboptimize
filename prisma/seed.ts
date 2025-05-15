import { PrismaClient } from '@prisma/client';
import seedData from './seed-data.json';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    await prisma.offer.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();
    await prisma.company.deleteMany();

    // Seed des companies
    for (const company of seedData.companies) {
        const existingCompany = await prisma.company.findUnique({
            where: { slug: company.slug },
        });

        if (!existingCompany) {
            await prisma.company.create({
                data: {
                    name: company.name,
                    slug: company.slug,
                    imageLink: company.imageLink ?? null,
                },
            });
        }
    }

    // Seed des categories
    for (const category of seedData.categories) {
        const existingCategory = await prisma.category.findUnique({
            where: { slug: category.slug },
        });

        if (!existingCategory) {
            await prisma.category.create({
                data: {
                    name: category.name,
                    slug: category.slug,
                    icon: category.icon ?? null,
                },
            });
        }
    }

    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });