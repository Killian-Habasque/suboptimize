import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { requiredAdmin } from "@/lib/auth-helper"

export async function GET() {
    try {
        const companies = await prisma.company.findMany()
        return NextResponse.json(companies)
    } catch {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des entreprises" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        await requiredAdmin();
        const { name, slug, imageLink } = await request.json();
        const newCompany = await prisma.company.create({
            data: { name, slug, imageLink },
        });
        return NextResponse.json(newCompany, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message.includes("redirect")) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }
        return NextResponse.json(
            { error: "Erreur lors de l'ajout de l'entreprise" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await requiredAdmin();
        const { id, name, slug } = await request.json();
        const updatedCompany = await prisma.company.update({
            where: { id },
            data: { name, slug },
        });
        return NextResponse.json(updatedCompany);
    } catch (error) {
        if (error instanceof Error && error.message.includes("redirect")) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de l'entreprise" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await requiredAdmin();
        const { id } = await request.json();
        await prisma.company.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Entreprise supprimée" });
    } catch (error) {
        if (error instanceof Error && error.message.includes("redirect")) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }
        return NextResponse.json(
            { error: "Erreur lors de la suppression de l'entreprise" },
            { status: 500 }
        );
    }
}