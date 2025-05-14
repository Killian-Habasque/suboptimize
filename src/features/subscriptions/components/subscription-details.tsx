"use client";

import { useQuery } from "@tanstack/react-query";
import { Subscription } from "@/lib/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import OfferListItem from "@/features/offers/components/list-item-offer";
import { Offer, Category, Company } from "@prisma/client";
import LoadingCursor from "@/components/ui/loading-cursor";

interface OfferWithRelations extends Offer {
    companies: Company[];
    categories: Category[];
}

interface SubscriptionDetailsProps {
    id: string;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({ id }) => {
    const router = useRouter();

    const { data: subscription, isLoading, error } = useQuery<Subscription>({
        queryKey: ["subscription", id],
        queryFn: async () => {
            const response = await fetch(`/api/subscriptions/${id}`);
            if (response.status === 401) {
                router.push('/connexion');
                throw new Error("Vous devez être connecté pour accéder à cette page");
            }
            if (response.status === 403) {
                router.push('/abonnements');
                throw new Error("Vous n'avez pas l'autorisation d'accéder à cet abonnement");
            }
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération de l'abonnement");
            }
            return response.json();
        },
    });

    const { data: similarOffers, isLoading: isLoadingOffers } = useQuery<OfferWithRelations[]>({
        queryKey: ["similar-offers", id],
        queryFn: async () => {
            const response = await fetch(`/api/subscriptions/${id}/similar-offers`);
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des offres similaires");
            }
            return response.json();
        },
        enabled: !!subscription,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingCursor />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error instanceof Error ? error.message : "Une erreur est survenue lors du chargement de l'abonnement"}</p>
                <Link href="/abonnements">
                    <Button variant="light" className="text-blue-600 hover:text-blue-400">
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        Retour aux abonnements
                    </Button>
                </Link>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Abonnement non trouvé</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <Link href="/abonnements">
                    <Button variant="light" className="text-blue-600 hover:text-blue-400">
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        Retour aux abonnements
                    </Button>
                </Link>
            </div>

            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">{subscription.title}</h1>
                    <div className="flex items-center gap-4 mb-4">
                        {subscription.companies?.[0] && (
                            <div className="flex items-center gap-2">
                                {subscription.companies[0].imageLink && (
                                    <img
                                        src={subscription.companies[0].imageLink}
                                        alt={subscription.companies[0].name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                )}
                                <span className="font-medium">{subscription.companies[0].name}</span>
                            </div>
                        )}
                        {subscription.categories?.[0] && (
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                                {subscription.categories[0].name}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-primary">
                            {subscription.price}€ / {subscription.dueType === "monthly" ? "mois" : "an"}
                        </span>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Détails de l&apos;abonnement</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Date de prélèvement</h3>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                Le {subscription.dueDay} de chaque {subscription.dueType === "monthly" ? "mois" : "année"}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Date de début</h3>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                {format(new Date(subscription.startDatetime), "d MMMM yyyy", { locale: fr })}
                            </p>
                        </div>

                        {subscription.endDatetime && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Date de fin</h3>
                                <p className="mt-1 text-lg font-semibold text-gray-900">
                                    {format(new Date(subscription.endDatetime), "d MMMM yyyy", { locale: fr })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {subscription.customCompany && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Entreprise personnalisée</h2>
                        <p className="text-gray-600">{subscription.customCompany}</p>
                    </div>
                )}

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Offres similaires pour optimiser votre abonnement</h2>
                    {isLoadingOffers ? (
                        <div className="flex justify-center items-center">
                            <LoadingCursor />
                        </div>
                    ) : similarOffers && similarOffers.length > 0 ? (
                        <div className="space-y-4">
                            {similarOffers.map((offer) => (
                                <div key={offer.id} className="ring-1 ring-inset ring-gray-300 rounded-lg">
                                    <OfferListItem
                                        slug={offer.slug}
                                        title={offer.name}
                                        price={offer.price}
                                        normalPrice={offer.normalPrice}
                                        description={offer.description}
                                        company={offer.companies[0]}
                                        category={offer.categories[0]}
                                        preview={true}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Aucune offre similaire trouvée</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionDetails; 