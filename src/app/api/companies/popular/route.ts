import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const companies = await prisma.company.findMany({
            take: 10,
            orderBy: {
                offers: {
                    _count: 'desc'
                }
            },
            include: {
                _count: {
                    select: {
                        offers: true
                    }
                }
            }
        });
        return NextResponse.json(companies);
    } catch (error) {
        console.error("Error fetching popular companies:", error);
        return NextResponse.json(
            { error: "Failed to fetch popular companies" },
            { status: 500 }
        );
    }
} 