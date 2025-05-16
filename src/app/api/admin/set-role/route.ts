import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT() {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                email: 'killian.habasque@gmail.com'
            },
            data: {
                role: 'admin'
            }
        });

        return NextResponse.json({ 
            message: 'User role updated successfully',
            user: updatedUser 
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json(
            { error: 'Failed to update user role' },
            { status: 500 }
        );
    }
}
