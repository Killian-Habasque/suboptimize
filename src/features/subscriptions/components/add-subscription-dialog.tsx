"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import { add_Subscription } from "@/features/subscriptions/subscription-service";
import { useSubscription } from "@/features/subscriptions/subscription-context";
import { Category, Company } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import OfferListItem from "@/features/offers/components/list-item-offer";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Field from "@/components/form/field";
import SubmitButton from "@/components/form/submit-button";
import Button from "@/components/ui/button";

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
    price: z.string()
        .min(1, "Le prix est requis")
        .refine((val) => {
            const num = parseFloat(val.replace(',', '.'));
            return !isNaN(num) && num >= 0;
        }, "Le prix doit être un nombre positif"),
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
            price: "",
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
            setValue("price", "");
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
            await add_Subscription(
                data.title,
                new Date(data.dueDate),
                data.endDate ? new Date(data.endDate) : null,
                parseFloat(data.price.replace(',', '.')),
                data.category ? [data.category.id] : [],
                data.company ? [data.company.id] : [],
                data.customCompany || null
            );

            const response = await fetch("/api/subscriptions");
            const updatedSubscriptions = await response.json();
            setSubscriptions(updatedSubscriptions);
            
            onClose();
        } catch (error: unknown) {
            console.error("Erreur lors de l'ajout de l'abonnement :", error);
            setErrorMessage((error as Error).message);
        }
    };

    const handleOfferSelect = (offer: Offer) => {
        setSelectedOffer(offer);
        setValue("title", offer.name);
        setValue("price", offer.price.toString());
        setValue("category", offer.categories.length > 0 ? { id: offer.categories[0].id, name: offer.categories[0].name } : null);
        setValue("company", offer.companies.length > 0 ? { id: offer.companies[0].id, name: offer.companies[0].name } : null);
        setStep("custom");
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
            <DialogPanel className="relative w-5xl min-h-3/4 bg-white p-6 shadow-xl rounded-lg ring-1 ring-black/[5%]">
                <DialogTitle className="mb-8 text-2xl font-semibold text-primary">Ajouter un abonnement</DialogTitle>

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
                            onClick={() => {
                                setStep("custom");
                                setValue("title", "");
                                setValue("dueType", "monthly");
                                setValue("dueDate", new Date().toISOString().split("T")[0]);
                                setValue("endDate", "");
                                setValue("price", "");
                                setValue("category", null);
                                setValue("company", null);
                                setValue("customCompany", "");
                            }}
                            variant="primary"
                            className="mt-4"
                        >
                            Ajouter une offre personnalisée
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4 grid grid-cols-2 gap-4">
                        <div className="col-span-2 flex gap-2 flex-col items-start">
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

                        <div className="space-y-4">
                            <Field
                                id="title"
                                label="Titre"
                                type="text"
                                placeholder="Titre de l'abonnement"
                                required
                                register={register}
                                name="title"
                                errors={errors}
                                disabled={!!selectedOffer}
                            />

                            <div>
                                <label className="text-sm font-bold">Type d&apos;échéance</label>
                                <select {...register("dueType")} className={`w-full px-3 py-2 border rounded-lg ${!!selectedOffer ? "bg-gray-100 cursor-not-allowed" : ""}`} disabled={!!selectedOffer}>
                                    <option value="monthly">Mensuel</option>
                                    <option value="yearly">Annuel</option>
                                </select>
                            </div>

                            <Field
                                id="dueDate"
                                label="Date d&apos;échéance"
                                type="text"
                                placeholder="Date d'échéance"
                                required
                                register={register}
                                name="dueDate"
                                errors={errors}
                                disabled={!!selectedOffer}
                            />

                            <Field
                                id="endDate"
                                label="Date de fin (optionnelle)"
                                type="text"
                                placeholder="Date de fin"
                                register={register}
                                name="endDate"
                                errors={errors}
                                disabled={!!selectedOffer}
                            />

                            <Field
                                id="price"
                                label="Prix"
                                type="text"
                                placeholder="Prix (ex: 10,99)"
                                required
                                register={register}
                                name="price"
                                errors={errors}
                                disabled={!!selectedOffer}
                            />
                        </div>

                        <div className="relative space-y-4">
                            <div>
                                <label className="text-sm font-bold">Catégorie</label>
                                <Combobox value={watch("category")} onChange={(value) => setValue("category", value)}>
                                    <ComboboxInput
                                        className={`w-full px-3 py-2 border rounded-lg ${!!selectedOffer ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
                                        className={`w-full px-3 py-2 border rounded-lg ${!!selectedOffer ? "bg-gray-100 cursor-not-allowed" : ""}`}
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

                            <Field
                                id="customCompany"
                                label="Entreprise personnalisée"
                                type="text"
                                placeholder="Saisissez une nouvelle entreprise..."
                                register={register}
                                name="customCompany"
                                errors={errors}
                                disabled={!!selectedOffer}
                            />
                        </div>

                        <div className="col-span-2">
                            <SubmitButton loading={isSubmitting}>
                                {isSubmitting ? "Ajout en cours..." : "Ajouter l'abonnement"}
                            </SubmitButton>
                            {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
                        </div>
                    </form>
                )}
            </DialogPanel>
        </Dialog>
    );
};

export default AddSubscriptionDialog; 