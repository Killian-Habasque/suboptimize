"use client";

import { useQuery } from "@tanstack/react-query";
import { Subscription } from "@/lib/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Button from "@/components/ui/button";

interface SubscriptionDetailsProps {
    id: string;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({ id }) => {
    const { data: subscription, isLoading, error } = useQuery<Subscription>({
        queryKey: ["subscription", id],
        queryFn: async () => {
            const response = await fetch(`/api/subscriptions/${id}`);
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération de l'abonnement");
            }
            return response.json();
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">Une erreur est survenue lors du chargement de l&apos;abonnement</p>
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
            </div>
        </div>
    );
};

export default SubscriptionDetails; 