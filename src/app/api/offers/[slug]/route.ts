import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const offer = await prisma.offer.findUnique({
            where: {
                slug: slug,
            },
            include: {
                companies: true,
                categories: true,
            },
        });

        if (!offer) {
            return NextResponse.json({ error: "Offer not found" }, { status: 404 });
        }

        return NextResponse.json(offer);
    } catch (error) {
        console.error("Error fetching offer:", error);
        return NextResponse.json(
            { error: "Failed to fetch offer" },
            { status: 500 }
        );
    }
} 