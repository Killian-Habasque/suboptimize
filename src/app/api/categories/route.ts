import { NextResponse } from "next/server"
import prisma from "@/../prisma/prisma"

export async function GET() {
    try {
        const categories = await prisma.category.findMany()
        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des catégories" },
            { status: 500 }
        )
    }
}