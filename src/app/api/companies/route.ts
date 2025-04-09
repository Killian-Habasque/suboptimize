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

export async function POST(request) {
    const { name, slug, imageLink } = await request.json();
    try {
        const newCompany = await prisma.company.create({
            data: { name, slug, imageLink },
        });
        return NextResponse.json(newCompany, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur lors de l'ajout de l'entreprise" },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    const { id, name, slug } = await request.json();
    try {
        const updatedCompany = await prisma.company.update({
            where: { id },
            data: { name, slug },
        });
        return NextResponse.json(updatedCompany);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de l'entreprise" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    const { id } = await request.json();
    try {
        await prisma.company.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Entreprise supprimée" });
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur lors de la suppression de l'entreprise" },
            { status: 500 }
        );
    }
}