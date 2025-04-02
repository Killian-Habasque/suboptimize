import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const companies = await prisma.company.findMany()
        return NextResponse.json(companies)
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des entreprises" },
            { status: 500 }
        )
    }
}