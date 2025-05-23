"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/layout/container";
import Grid from "@/components/layout/grid";
import GridItem from "@/components/layout/grid-item";
import Card from "@/components/layout/card";
import OfferListItem from "@/features/offers/components/list-item-offer";
import { Offer, Category, Company } from "@prisma/client";
import LoginCard from "@/features/auth/components/login-card";
import LoadingCursor from "@/components/ui/loading-cursor";
import Link from "next/link";
import Button from "@/components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import CompanyBubble from "@/components/ui/company-bubble";

interface OfferWithRelations extends Offer {
    companies: Company[];
    categories: Category[];
}

const OfferDetailsPage = () => {
    const params = useParams();
    const [offer, setOffer] = useState<OfferWithRelations | null>(null);
    const [similarOffers, setSimilarOffers] = useState<OfferWithRelations[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOfferDetails = async () => {
            try {
                const response = await fetch(`/api/offers/${params.slug}`);
                if (!response.ok) throw new Error("Failed to fetch offer");
                const data = await response.json();
                setOffer(data);

                if (data.categories?.[0]?.id) {
                    const similarResponse = await fetch(`/api/offers/similar/${data.categories[0].id}`);
                    if (similarResponse.ok) {
                        const similarData = await similarResponse.json();
                        setSimilarOffers(similarData.filter((o: OfferWithRelations) => o.id !== data.id));
                    }
                }
            } catch (error) {
                console.error("Error fetching offer details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOfferDetails();
    }, [params.slug]);

    if (loading) {
        return (
            <Container>
                <Grid columns={3}>
                    <GridItem colSpan={3}>
                        <Card>
                            <div className="h-96 text-center py-8 flex justify-center">
                                <div className="flex justify-center items-center">
                                    <LoadingCursor />
                                    Chargement...
                                </div>
                            </div>
                        </Card>
                    </GridItem>
                </Grid>
            </Container>
        );
    }

    if (!offer) {
        return (
            <Container>
                <div className="text-center py-8 text-white">Offre non trouvée</div>
            </Container>
        );
    }

    return (
        <Container>
            <Grid columns={3}>
                <GridItem colSpan={3}>
                    <Card>
                        <div className="p-6">
                            <div className="mb-8">
                                <Link href="/offres">
                                    <Button variant="light" className="text-blue-600 hover:text-blue-400">
                                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                                        Retour aux offres
                                    </Button>
                                </Link>
                            </div>
                            <div className="mb-8">
                                <div className="flex items-center gap-8 mb-4">
                                    {offer.companies?.[0] && (
                                        <CompanyBubble
                                            image={offer.companies[0].imageLink}
                                            altText={offer.companies[0].name}
                                            variant="extra-large"
                                        />
                                    )}
                                    <div className="w-full">
                                        <h1 className="text-3xl font-bold mb-4">{offer.name}</h1>
                                        <div className="flex gap-4 items-center">
                                            {offer.companies?.[0] && (
                                                <span className="font-medium">{offer.companies[0].name}</span>
                                            )}
                                            {offer.categories?.[0] && (
                                                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                                                    {offer.categories[0].name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {offer.normalPrice && (
                                                <span className="text-gray-400 line-through text-xl">
                                                    {offer.normalPrice} €
                                                </span>
                                            )}
                                            <span className="text-2xl font-bold text-primary">
                                                {offer.price} €
                                            </span>
                                        </div>
                                    </div>
                                    {offer.link && (
                                        <div className="mt-4">
                                            <a
                                                href={offer.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block whitespace-nowrap bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                                            >
                                                Voir l&apos;offre
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Description</h2>
                                <p className="text-gray-600">{offer.description}</p>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Commentaires</h2>
                                <div className="space-y-4">
                                    <LoginCard label="Pour voir les commentaires, connectez-vous !" />
                                    {/* Placeholder for comments */}
                                    <div className="text-center py-8 text-gray-500">
                                        La section commentaires sera bientôt disponible
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </GridItem>

                <GridItem colSpan={3}>
                    <Card>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-4">Offres similaires</h2>
                            <div className="space-y-4">
                                {similarOffers.length > 0 ? (
                                    similarOffers.map((similarOffer) => (
                                        <div key={similarOffer.id} className="ring-1 ring-inset ring-gray-300 rounded-lg">
                                            <OfferListItem
                                                title={similarOffer.name}
                                                price={similarOffer.price}
                                                normalPrice={similarOffer.normalPrice}
                                                description={similarOffer.description}
                                                company={similarOffer.companies[0]}
                                                category={similarOffer.categories[0]}
                                                preview={true}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        Aucune offre similaire trouvée
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </GridItem>
            </Grid>
        </Container>
    );
};

export default OfferDetailsPage; 