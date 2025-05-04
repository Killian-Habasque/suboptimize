import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requiredAuth } from "@/lib/auth-helper";

export async function POST(req: Request) {
    // Authentification requise mais l'utilisateur n'est pas nécessaire dans cette fonction
    await requiredAuth();

    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const slug = formData.get("slug") as string | null;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 500 * 1024) {
        return NextResponse.json({ error: "File size must be less than 500 KB" }, { status: 400 });
    }

    if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const sanitizedSlug = slug.replace(/\s+/g, '-').toLowerCase();

    const blob = await put(`companies/${sanitizedSlug}-${Date.now()}`, file, {
        access: "public",
    });

    return NextResponse.json({ url: blob.url });
}