"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import { add_Subscription } from "@/features/subscriptions/subscriptionService";
import { useSubscription } from "@/features/subscriptions/subscriptionContext";
import { Category, Company } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import SubscriptionListItem from "./SubscriptionListItem";
import OfferListItem from "@/features/offers/components/OfferListItem";

// Définir l'interface pour les offres
interface Offer {
    id: string;
    name: string;
    price: number;
    categories: { id: string; name: string }[];
    companies: { id: string; name: string }[];
}

const schema = z.object({
    title: z.string().min(1, "Le titre est obligatoire"),
    dueType: z.enum(["monthly", "yearly"]),
    dueDate: z.string(),
    endDate: z.string().optional(),
    price: z.coerce.number().min(0, "Le prix doit être positif"),
    category: z.object({ id: z.string(), name: z.string() }).nullable(),
    company: z.object({ id: z.string(), name: z.string() }).nullable(),
    customCompany: z.string().optional(),
});

interface AddSubscriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddSubscriptionDialog: React.FC<AddSubscriptionDialogProps> = ({ isOpen, onClose }) => {
    const { setSubscriptions } = useSubscription();
    const [categories, setCategories] = useState<Category[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [searchOfferTerm, setSearchOfferTerm] = useState("");
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [step, setStep] = useState<"search" | "custom">("search");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            dueType: "monthly",
            dueDate: new Date().toISOString().split("T")[0],
            endDate: "",
            price: 0,
            category: null,
            company: null,
            customCompany: "",
        },
    });

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
            const fetchData = async () => {
                try {
                    const [categoriesRes, companiesRes] = await Promise.all([
                        fetch("/api/categories"),
                        fetch("/api/companies"),
                    ]);

                    if (categoriesRes.ok && companiesRes.ok) {
                        const [categoriesData, companiesData] = await Promise.all([
                            categoriesRes.json(),
                            companiesRes.json(),
                        ]);

                        setCategories(categoriesData);
                        setFilteredCategories(categoriesData);
                        setCompanies(companiesData);
                        setFilteredCompanies(companiesData);
                    }
                } catch (error) {
                    console.error("Erreur lors du chargement des données :", error);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setValue("title", "");
            setValue("dueType", "monthly");
            setValue("dueDate", new Date().toISOString().split("T")[0]);
            setValue("endDate", "");
            setValue("price", 0);
            setValue("category", null);
            setValue("company", null);
            setValue("customCompany", "");
            setSearchOfferTerm("");
            setSelectedOffer(null);
            setStep("search");
            setErrorMessage("");
        }
    }, [isOpen, setValue]);

    const onSubmit = async (data: z.infer<typeof schema>) => {
        setErrorMessage("");
        try {
            const newSubscription = await add_Subscription(
                data.title,
                new Date(data.dueDate),
                data.endDate ? new Date(data.endDate) : null,
                data.price,
                data.category ? [data.category.id] : [],
                data.company ? [data.company.id] : [],
                data.customCompany || null
            );

            setSubscriptions((prev) => [...prev, newSubscription]);
            onClose();
        } catch (error: unknown) {
            console.error("Erreur lors de l'ajout de l'abonnement :", error);
            setErrorMessage((error as Error).message);
        }
    };

    const handleOfferSelect = (offer: Offer) => {
        setSelectedOffer(offer);
        setValue("title", offer.name);
        setValue("price", offer.price);
        setValue("category", offer.categories.length > 0 ? { id: offer.categories[0].id, name: offer.categories[0].name } : null);
        setValue("company", offer.companies.length > 0 ? { id: offer.companies[0].id, name: offer.companies[0].name } : null);

        setStep("custom");
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
            <DialogPanel className="relative w-5xl h-3/4 bg-white p-6 shadow-xl rounded-lg">
                <DialogTitle className="text-xl font-semibold text-gray-800">Ajouter un abonnement</DialogTitle>

                {step === "search" ? (
                    <div>
                        <input
                            type="text"
                            placeholder="Rechercher une offre..."
                            value={searchOfferTerm}
                            onChange={(e) => setSearchOfferTerm(e.target.value)}
                            className="mb-4 p-2 border rounded"
                        />
                        <ul className="border rounded h-96 overflow-scroll">
                            {offersData && offersData.offers.length > 0 ? (
                                offersData.offers.map((offer: Offer) => (

                                    <>
                                        {/* <li key={offer.id} onClick={() => handleOfferSelect(offer)} className="cursor-pointer p-2 hover:bg-gray-200">
                                            {offer.name} - {offer.price} €
                                        </li> */}
                                        <OfferListItem
                                            key={offer.id}
                                            price={offer.price}
                                            title={offer.name}
                                            // description={offer.description}
                                            company={offer.companies[0]}
                                            category={offer.categories[0]}
                                            onClick={() => handleOfferSelect(offer)} 
                                        />
                                    </>

                                ))
                            ) : <span className="w-full flex justify-center p-2 opacity-25">
                                {searchOfferTerm ? "Aucun abonnement trouvé" : "Rechercher un abonnement"}
                            </span>}
                        </ul>
                        <button onClick={() => {
                            setStep("custom");
                            setValue("title", "");
                            setValue("dueType", "monthly");
                            setValue("dueDate", new Date().toISOString().split("T")[0]);
                            setValue("endDate", "");
                            setValue("price", 0);
                            setValue("category", null);
                            setValue("company", null);
                            setValue("customCompany", "");
                        }} className="mt-4 text-blue-600">Ajouter une offre personnalisée</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4 mt-4">
                        <div>
                            <label className="text-sm font-bold">Titre*</label>
                            <input {...register("title")} className={`w-full px-3 py-2 border rounded-lg ${!!selectedOffer ? "bg-gray-200 cursor-not-allowed" : ""}`} disabled={!!selectedOffer} />
                            {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-bold">Type d&apos;échéance</label>
                            <select {...register("dueType")} className={`w-full px-3 py-2 border rounded-lg ${!!selectedOffer ? "bg-gray-200 cursor-not-allowed" : ""}`} disabled={!!selectedOffer}>
                                <option value="monthly">Mensuel</option>
                                <option value="yearly">Annuel</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-bold">Date d&apos;échéance</label>
                            <input type="date" {...register("dueDate")} className={`w-full px-3 py-2 border rounded-lg ${!!selectedOffer ? "bg-gray-200 cursor-not-allowed" : ""}`} disabled={!!selectedOffer} />
                        </div>

                        <div>
                            <label className="text-sm font-bold">Date de fin (optionnelle)</label>
                            <input type="date" {...register("endDate")} className={`w-full px-3 py-2 border rounded-lg ${!!selectedOffer ? "bg-gray-200 cursor-not-allowed" : ""}`} disabled={!!selectedOffer} />
                        </div>

                        <div>
                            <label className="text-sm font-bold">Prix</label>
                            <input type="number" step="0.01" {...register("price")} className={`w-full px-3 py-2 border rounded-lg ${!!selectedOffer ? "bg-gray-200 cursor-not-allowed" : ""}`} disabled={!!selectedOffer} />
                            {errors.price && <p className="text-red-600">{errors.price.message}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-bold">Catégorie</label>
                            <Combobox value={watch("category")} onChange={(value) => setValue("category", value)}>
                                <ComboboxInput
                                    className={`w-full px-3 py-2 border rounded-lg ${!!selectedOffer ? "bg-gray-200 cursor-not-allowed" : ""}`}
                                    displayValue={(cat: { name: string } | null) => cat?.name || ""}
                                    onChange={(event) => {
                                        const query = event.target.value.toLowerCase();
                                        setFilteredCategories(categories.filter((c) => c.name.toLowerCase().includes(query)));
                                    }}
                                    placeholder="Rechercher ou saisir une catégorie..."
                                    disabled={!!selectedOffer}
                                />
                                <ComboboxOptions className="absolute z-10 w-full mt-1 bg-white border rounded-lg max-h-40 overflow-y-auto">
                                    {filteredCategories.map((cat) => (
                                        <ComboboxOption key={cat.id} value={cat} className="px-4 py-2 cursor-pointer">
                                            {cat.name}
                                        </ComboboxOption>
                                    ))}
                                </ComboboxOptions>
                            </Combobox>
                        </div>

                        <div>
                            <label className="text-sm font-bold">Entreprise</label>
                            <Combobox value={watch("company")} onChange={(value) => setValue("company", value)}>
                                <ComboboxInput
                                    className={`w-full px-3 py-2 border rounded-lg ${!!selectedOffer ? "bg-gray-200 cursor-not-allowed" : ""}`}
                                    displayValue={(com: { name: string } | null) => com?.name || ""}
                                    onChange={(event) => {
                                        const query = event.target.value.toLowerCase();
                                        setFilteredCompanies(companies.filter((c) => c.name.toLowerCase().includes(query)));
                                    }}
                                    placeholder="Rechercher ou saisir une entreprise..."
                                    disabled={!!selectedOffer}
                                />
                                <ComboboxOptions className="absolute z-10 w-full mt-1 bg-white border rounded-lg max-h-40 overflow-y-auto">
                                    {filteredCompanies.map((com) => (
                                        <ComboboxOption key={com.id} value={com} className="px-4 py-2 cursor-pointer">
                                            {com.name}
                                        </ComboboxOption>
                                    ))}
                                </ComboboxOptions>
                            </Combobox>
                        </div>

                        <div>
                            <label className="text-sm font-bold">Entreprise personnalisée</label>
                            <input
                                type="text"
                                {...register("customCompany")}
                                className={`w-full px-3 py-2 border rounded-lg ${!!selectedOffer ? "bg-gray-200 cursor-not-allowed" : ""}`}
                                placeholder="Saisissez une nouvelle entreprise..."
                                disabled={!!selectedOffer}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setSelectedOffer(null);
                                setStep("search");
                            }}
                            className="mt-4 text-blue-600"
                        >
                            Retour à la recherche d&apos;offres
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isSubmitting ? "bg-gray-300" : "bg-indigo-600 hover:bg-indigo-700"}`}
                        >
                            {isSubmitting ? "Ajout en cours..." : "Ajouter l&apos;abonnement"}
                        </button>
                        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
                    </form>
                )}
            </DialogPanel>
        </Dialog>
    );
};

export default AddSubscriptionDialog;
