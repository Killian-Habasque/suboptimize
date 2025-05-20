"use client";

import { useState } from "react";
import { useSubscription } from "@/features/subscriptions/subscription-context";
import LoadingCursor from "@/components/ui/loading-cursor";
import SubscriptionListItem from "@/features/subscriptions/components/list-item-subscription";
import Link from "next/link";

type DueType = "all" | "monthly" | "yearly";

const ProfileSubscriptions = () => {
    const { subscriptions = [], loading } = useSubscription();
    const [selectedDueType, setSelectedDueType] = useState<DueType>("all");

    const filteredSubscriptions = subscriptions.filter(subscription => {
        if (selectedDueType === "all") return true;
        return subscription.dueType === selectedDueType;
    });

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Mes Abonnements</h2>

            <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                    <button
                        className={`px-3 py-1 rounded-md text-sm ${selectedDueType === "all"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        onClick={() => setSelectedDueType("all")}
                    >
                        Tous
                    </button>
                    <button
                        className={`px-3 py-1 rounded-md text-sm ${selectedDueType === "monthly"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        onClick={() => setSelectedDueType("monthly")}
                    >
                        Mensuel
                    </button>
                    <button
                        className={`px-3 py-1 rounded-md text-sm ${selectedDueType === "yearly"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        onClick={() => setSelectedDueType("yearly")}
                    >
                        Annuel
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-500">
                    <div className="flex justify-center items-center">
                        <LoadingCursor />
                        Chargement des abonnements...
                    </div>
                </div>
            ) : filteredSubscriptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {selectedDueType === "all"
                        ? "Vous n'avez pas encore d'abonnements."
                        : "Aucun abonnement trouvé pour ce filtre."}
                </div>
            ) : (
                <div className="divide-y divide-gray-100 rounded-lg bg-white shadow ring-1 ring-black/[5%]">
                    {filteredSubscriptions.map((subscription) => (
                        <div key={subscription.id} className="hover:bg-gray-50 rounded-md py-4 px-8">
                            <Link
                                href={`/abonnements/${subscription.id}`}
                            >
                                <SubscriptionListItem
                                    id={subscription.id}
                                    price={subscription.price}
                                    title={subscription.title}
                                    description={subscription.description}
                                    company={subscription.companies ? subscription.companies[0] : null}
                                    customCompany={subscription.customCompany}
                                    category={subscription.categories ? subscription.categories[0] : null}
                                    dueType={subscription.dueType === "monthly" ? "mensuel" : "annuel"}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default ProfileSubscriptions; 