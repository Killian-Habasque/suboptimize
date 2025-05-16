"use client";

import { useEffect, useState } from "react";
import { add_Subscription } from "@/features/subscriptions/subscription-service";
import { useSubscription } from "@/features/subscriptions/subscription-context";
import { Category, Company } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import OfferListItem from "@/features/offers/components/list-item-offer";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { fetchCommonData } from "@/features/common-service";
import Button from "@/components/ui/button";
import SubscriptionForm, { SubscriptionFormData } from "./subscription-form";
import Modal from "@/components/ui/modal";

interface Offer {
    id: string;
    name: string;
    price: number;
    categories: { id: string; name: string; slug: string; icon: string | null; createdAt: Date; updatedAt: Date; }[];
    companies: { id: string; name: string; slug: string; imageLink: string | null; createdAt: Date; updatedAt: Date; }[];
}

interface AddSubscriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddSubscriptionDialog: React.FC<AddSubscriptionDialogProps> = ({ isOpen, onClose }) => {
    const { setSubscriptions } = useSubscription();
    const [categories, setCategories] = useState<Category[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [searchOfferTerm, setSearchOfferTerm] = useState("");
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [step, setStep] = useState<"search" | "custom">("search");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: offersData } = useQuery<{ offers: Offer[] }>({
        queryKey: ["offers", searchOfferTerm],
        queryFn: async () => {
            const response = await fetch(`/api/offers?searchTerm=${encodeURIComponent(searchOfferTerm)}`);
            return response.json();
        },
        enabled: !!searchOfferTerm,
    });

    useEffect(() => {
        if (isOpen) {
            const loadData = async () => {
                try {
                    const { categories: categoriesData, companies: companiesData } = await fetchCommonData();
                    setCategories(categoriesData);
                    setCompanies(companiesData);
                } catch (error) {
                    console.error("Erreur lors du chargement des données :", error);
                }
            };
            loadData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setSearchOfferTerm("");
            setSelectedOffer(null);
            setStep("search");
            setErrorMessage("");
        }
    }, [isOpen]);

    const handleOfferSelect = (offer: Offer) => {
        setSelectedOffer(offer);
        setStep("custom");
    };

    const onSubmit = async (formData: SubscriptionFormData) => {
        setErrorMessage("");
        setIsSubmitting(true);
        try {
            await add_Subscription(
                formData.title,
                new Date(formData.dueDate),
                formData.endDate ? new Date(formData.endDate) : null,
                parseFloat(formData.price.replace(',', '.')),
                formData.category ? [formData.category.id] : [],
                formData.company ? [formData.company.id] : [],
                formData.customCompany || null,
                formData.dueType
            );

            const response = await fetch("/api/subscriptions");
            const data = await response.json();
            setSubscriptions(data.subscriptions);
            
            onClose();
        } catch (error: unknown) {
            console.error("Erreur lors de l'ajout de l'abonnement :", error);
            setErrorMessage((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ajouter un abonnement"
            size="5xl"
        >
            {step === "search" ? (
                <div>
                    <div className="flex flex-col gap-2 text-primary text-sm mb-4">
                        Rechercher un abonnement parmis les offres existantes
                        <input
                            type="text"
                            placeholder="Rechercher une offre..."
                            value={searchOfferTerm}
                            onChange={(e) => setSearchOfferTerm(e.target.value)}
                            className="w-full p-2 ring-1 ring-inset ring-gray-300 rounded border-none text-sm"
                        />
                    </div>

                    <ul className="ring-1 ring-inset ring-gray-300 rounded h-96 overflow-scroll">
                        {offersData && offersData.offers.length > 0 ? (
                            offersData.offers.map((offer: Offer) => (
                                <OfferListItem
                                    key={offer.id}
                                    price={offer.price}
                                    title={offer.name}
                                    company={offer.companies[0]}
                                    category={offer.categories[0]}
                                    onClick={() => handleOfferSelect(offer)}
                                />
                            ))
                        ) : <span className="w-full flex justify-center p-2 opacity-25">
                            {searchOfferTerm ? "Aucun abonnement trouvé" : "Rechercher un abonnement"}
                        </span>}
                    </ul>
                    <Button
                        onClick={() => setStep("custom")}
                        variant="primary"
                        className="mt-4"
                    >
                        Ajouter une offre personnalisée
                    </Button>
                </div>
            ) : (
                <div className="relative">
                    <div className="flex gap-2 flex-col items-start mb-4">
                        <Button
                            type="button"
                            variant="light"
                            onClick={() => {
                                setSelectedOffer(null);
                                setStep("search");
                            }}
                            className="text-blue-600 hover:text-blue-400"
                        >
                            <ArrowUturnLeftIcon className="w-4 h-4 mr-1" />
                            Retour à la recherche d&apos;offres
                        </Button>
                    </div>

                    <SubscriptionForm
                        onSubmit={onSubmit}
                        categories={categories}
                        companies={companies}
                        isSubmitting={isSubmitting}
                        submitLabel={isSubmitting ? "Ajout en cours..." : "Ajouter l'abonnement"}
                        defaultValues={selectedOffer ? {
                            title: selectedOffer.name,
                            price: selectedOffer.price.toString(),
                            category: selectedOffer.categories.length > 0 ? { 
                                id: selectedOffer.categories[0].id, 
                                name: selectedOffer.categories[0].name 
                            } : null,
                            company: selectedOffer.companies.length > 0 ? { 
                                id: selectedOffer.companies[0].id, 
                                name: selectedOffer.companies[0].name 
                            } : null,
                        } : undefined}
                    />
                    {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
                </div>
            )}
        </Modal>
    );
};

export default AddSubscriptionDialog; 