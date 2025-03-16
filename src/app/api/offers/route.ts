import { NextResponse } from "next/server";
import { get_all_Offers } from "@/services/offerService";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const lastVisible = searchParams.get("lastDoc") || undefined;

    try {
        const { offers, lastDocId } = await get_all_Offers(page, limit, lastVisible);

        return NextResponse.json({
            offers,
            lastDoc: lastDocId,
        });
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
    }
}
