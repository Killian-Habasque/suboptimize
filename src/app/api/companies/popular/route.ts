import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const skip = (page - 1) * limit;

    try {
        const [companies, totalCompanies] = await Promise.all([
            prisma.company.findMany({
                skip,
                take: limit,
                orderBy: {
                    name: 'asc'
                }
            }),
            prisma.company.count()
        ]);

        return NextResponse.json({
            companies,
            total: totalCompanies,
            hasMore: skip + limit < totalCompanies
        });
    } catch (error) {
        console.error("Error fetching popular companies:", error);
        return NextResponse.json(
            { error: "Failed to fetch popular companies" },
            { status: 500 }
        );
    }
} 