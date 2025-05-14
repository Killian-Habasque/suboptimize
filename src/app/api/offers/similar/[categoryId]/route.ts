import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params;
        const offers = await prisma.offer.findMany({
            where: {
                categories: {
                    some: {
                        id: categoryId,
                    },
                },
            },
            include: {
                companies: true,
                categories: true,
            },
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(offers);
    } catch (error) {
        console.error("Error fetching similar offers:", error);
        return NextResponse.json(
            { error: "Failed to fetch similar offers" },
            { status: 500 }
        );
    }
} 