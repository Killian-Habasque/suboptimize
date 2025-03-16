"use client";
import { useEffect, useState } from "react";
import { Offer } from "@/types/types";

const Offers = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [lastDoc, setLastDoc] = useState<string | null>(null);
    const limit = 10;

    const fetchOffers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/offers?page=${page}&limit=${limit}&lastDoc=${lastDoc || ''}`);
            const data = await response.json();
            
            setOffers(data.offers);
            setLastDoc(data.lastDoc || null);
        } catch (err) {
            setError("Impossible de charger les offres. " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, [page]);

    return (
        <div className="text-2xl font-bold pt-14">
            {loading && <p>Chargement des offres...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && offers.length > 0 ? (
                offers.map((offer) => (
                    <div key={offer.slug}>
                        <h2>{offer.name}</h2>
                        <p>{offer.price} €</p>
                    </div>
                ))
            ) : (
                !loading && <p>Aucune offre pour l&apos;instant</p>
            )}

            <div className="flex gap-4 mt-4">
                <button 
                    disabled={page <= 1} 
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-4 py-2 bg-gray-300 disabled:opacity-50"
                >
                    Précédent
                </button>
                <button 
                    disabled={!lastDoc || offers.length < limit}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-gray-300 disabled:opacity-50"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default Offers;
