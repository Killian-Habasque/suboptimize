import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Setting admin role...');

    try {
        const updatedUser = await prisma.user.update({
            where: {
                email: 'killian.habasque@gmail.com'
            },
            data: {
                role: 'admin'
            }
        });

        console.log('Admin role set successfully for user:', updatedUser.email);
    } catch (error) {
        console.error('Error setting admin role:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 