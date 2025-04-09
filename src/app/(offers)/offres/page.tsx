"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { debounce } from "lodash";
import AddOfferDialog from "@/features/offers/components/AddOfferDialog";
import OfferListItem from "@/features/offers/components/OfferListItem";
import Button from "@/components/ui/Button";
import { PlusIcon } from "@heroicons/react/20/solid";

const fetchOffers = async (page: number, limit: number, searchTerm: string) => {
    const response = await fetch(`/api/offers?page=${page}&limit=${limit}&searchTerm=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

const Offers = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const limit = 10;

    useEffect(() => {
        const handler = debounce((value) => {
            setDebouncedSearchTerm(value);
        }, 500);
        handler(searchTerm);
        return () => handler.cancel();
    }, [searchTerm]);

    const { data, error, isFetching, refetch } = useQuery({
        queryKey: ["offers", page, debouncedSearchTerm],
        queryFn: () => fetchOffers(page, limit, debouncedSearchTerm),
        placeholderData: (previousData) => previousData,
        staleTime: 10000,
        gcTime: 60000,
    });

    return (
        <div className="text-2xl font-bold pt-14">
            <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
                <PlusIcon className="w-5 h-5" />
                Ajouter une offre
            </Button>
            {/* <div className="w-[500px]"> */}
            <OfferListItem
                image="/assets/orange.png"
                price="10,99"
                title="Forfait mobile 2h - 100gb"
                brand="Orange"
                category="Téléphone"
                dueType="mensuel"
            />
            {/* </div> */}

            <input
                type="text"
                placeholder="Rechercher une offre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border rounded"
            />
            <button
                onClick={() => setIsDialogOpen(true)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Ajouter une offre
            </button>

            {isFetching && !data && <p>Chargement des offres...</p>}
            {error && <p className="text-red-500">{error.message}</p>}

            {data && data.offers.length > 0 ? (
                data.offers.map((offer) => (
                    <div key={offer.id}>
                        <h2>{offer.name}</h2>
                        <p>{offer.price} €</p>
                    </div>
                ))
            ) : (
                !isFetching && <p>Aucune offre pour l'instant</p>
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
                    disabled={!data || data.offers.length < limit}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-gray-300 disabled:opacity-50"
                >
                    Suivant
                </button>
            </div>

            <AddOfferDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    refetch();
                }}
            />
        </div>
    );
};

export default Offers;
