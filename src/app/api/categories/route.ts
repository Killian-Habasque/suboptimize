import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { requiredAdmin } from "@/lib/auth-helper"

export async function GET() {
    try {
        const categories = await prisma.category.findMany()
        return NextResponse.json(categories)
    } catch {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des catégories" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        await requiredAdmin();
        const { name, slug } = await request.json();
        const newCategory = await prisma.category.create({
            data: { name, slug },
        });
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message.includes("redirect")) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }
        return NextResponse.json(
            { error: "Erreur lors de l'ajout de la catégorie" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await requiredAdmin();
        const { id, name, slug } = await request.json();
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name, slug },
        });
        return NextResponse.json(updatedCategory);
    } catch (error) {
        if (error instanceof Error && error.message.includes("redirect")) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de la catégorie" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await requiredAdmin();
        const { id } = await request.json();
        await prisma.category.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Catégorie supprimée" });
    } catch (error) {
        if (error instanceof Error && error.message.includes("redirect")) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }
        return NextResponse.json(
            { error: "Erreur lors de la suppression de la catégorie" },
            { status: 500 }
        );
    }
}