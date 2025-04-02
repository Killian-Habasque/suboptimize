import { NextResponse } from "next/server";
import { get_all_Offers } from "@/features/offers/offerService";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const searchTerm = searchParams.get("searchTerm") || "";

    try {
        const { offers, lastDocId, totalOffers } = await get_all_Offers(page, limit, searchTerm);
        return NextResponse.json({
            offers,
            lastDoc: lastDocId,
            total: totalOffers
        });
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
    }
}
