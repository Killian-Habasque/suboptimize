"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/ui/modal";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Subscription } from "@/lib/types";
import { debounce } from "lodash";
import SubscriptionListItem from "./list-item-subscription";

interface SearchSubscriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchSubscriptionDialog: React.FC<SearchSubscriptionDialogProps> = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    useEffect(() => {
        const handler = debounce((value: string) => {
            setDebouncedSearchTerm(value);
        }, 500);
        handler(searchTerm);
        return () => handler.cancel();
    }, [searchTerm]);

    const { data: subscriptionsData } = useQuery<{ subscriptions: Subscription[] }>({
        queryKey: ["subscriptions", debouncedSearchTerm],
        queryFn: async () => {
            const response = await fetch(`/api/subscriptions?searchTerm=${encodeURIComponent(debouncedSearchTerm)}`);
            return response.json();
        },
        enabled: !!debouncedSearchTerm,
    });

    useEffect(() => {
        if (isOpen) {
            setSearchTerm("");
            setDebouncedSearchTerm("");
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Rechercher un abonnement"
            size="2xl"
        >
            <div className="flex flex-col gap-4">
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher un abonnement..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>

                <div className="mt-2 max-h-96 overflow-y-auto">
                    {subscriptionsData?.subscriptions && subscriptionsData.subscriptions.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                            {subscriptionsData.subscriptions.map((subscription) => (
                                <li
                                    key={subscription.id}
                                    className="hover:bg-gray-50 px-4 rounded-md"
                                >
                                    <SubscriptionListItem
                                        id={subscription.id}
                                        title={subscription.title}
                                        price={subscription.price}
                                        description={subscription.description}
                                        category={subscription.category}
                                        company={subscription.companies[0]}
                                        dueType={subscription.dueType === "monthly" ? "mensuel" : "annuel"}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            {searchTerm ? "Aucun abonnement trouvé" : "Commencez à taper pour rechercher"}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default SearchSubscriptionDialog; 