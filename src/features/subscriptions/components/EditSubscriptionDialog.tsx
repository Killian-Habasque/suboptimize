"use client";

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import { update_Subscription } from "@/features/subscriptions/subscriptionService";
import { useSubscription } from "@/features/subscriptions/subscriptionContext";
import { Category, Company } from "@prisma/client";
import { Subscription } from "@/lib/types";

const schema = z.object({
    title: z.string().min(1, "Le titre est obligatoire"),
    dueType: z.enum(["monthly", "yearly"]),
    dueDate: z.string(),
    endDate: z.string().optional(),
    price: z.coerce.number().min(0, "Le prix doit être positif"),
    category: z.any().nullable(),
    company: z.any().nullable(),
    customCompany: z.string().optional(),
});

interface EditSubscriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    subscription: Subscription;
}

const EditSubscriptionDialog: React.FC<EditSubscriptionDialogProps> = ({ isOpen, onClose, subscription }) => {
    const { subscriptions, setSubscriptions } = useSubscription();
    const [categories, setCategories] = useState<Category[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

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
        if (isOpen && subscription) {
            setValue("title", subscription.title || "");
            setValue("dueType", subscription.dueType || "monthly");

            // Format date for the input
            const startDate = new Date(subscription.startDatetime);
            setValue("dueDate", startDate.toISOString().split("T")[0]);

            if (subscription.endDatetime) {
                const endDate = new Date(subscription.endDatetime);
                setValue("endDate", endDate.toISOString().split("T")[0]);
            } else {
                setValue("endDate", "");
            }

            setValue("price", subscription.price || 0);

            if (subscription.categories && subscription.categories.length > 0) {
                setValue("category", {
                    id: subscription.categories[0].id,
                    name: subscription.categories[0].name
                });
            } else {
                setValue("category", null);
            }

            if (subscription.companies && subscription.companies.length > 0) {
                setValue("company", {
                    id: subscription.companies[0].id,
                    name: subscription.companies[0].name
                });
            } else {
                setValue("company", null);
            }

            setValue("customCompany", subscription.customCompany || "");
            setErrorMessage("");
        }
    }, [isOpen, subscription, setValue]);

    const onSubmit = async (data: any) => {
        setErrorMessage("");
        try {
            const updatedSubscription = await update_Subscription(
                subscription.id,
                data.title,
                new Date(data.dueDate),
                data.endDate ? new Date(data.endDate) : null,
                data.price,
                data.category ? [data.category.id] : [],
                data.company ? [data.company.id] : [],
                data.customCompany || null
            );

            setSubscriptions((prev) =>
                prev.map((sub) => (sub.id === subscription.id ? updatedSubscription : sub))
            );
            onClose();
        } catch (error: unknown) {
            console.error("Erreur lors de la modification de l'abonnement :", error);
            setErrorMessage((error as Error).message);
        }
    };

    return (

        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle className="text-xl font-semibold text-gray-800">Modifier l'abonnement</DialogTitle>
                                <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4 mt-4">
                                    <div>
                                        <label className="text-sm font-bold">Titre*</label>
                                        <input {...register("title")} className="w-full px-3 py-2 border rounded-lg" />
                                        {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold">Type d'échéance</label>
                                        <select {...register("dueType")} className="w-full px-3 py-2 border rounded-lg">
                                            <option value="monthly">Mensuel</option>
                                            <option value="yearly">Annuel</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold">Date d'échéance</label>
                                        <input type="date" {...register("dueDate")} className="w-full px-3 py-2 border rounded-lg" />
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold">Date de fin (optionnelle)</label>
                                        <input type="date" {...register("endDate")} className="w-full px-3 py-2 border rounded-lg" />
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold">Prix</label>
                                        <input type="number" step="0.01" {...register("price")} className="w-full px-3 py-2 border rounded-lg" />
                                        {errors.price && <p className="text-red-600">{errors.price.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold">Catégorie</label>
                                        <Combobox value={watch("category")} onChange={(value) => setValue("category", value)}>
                                            <ComboboxInput
                                                className="w-full px-3 py-2 border rounded-lg"
                                                displayValue={(cat) => cat?.name || ""}
                                                onChange={(event) => {
                                                    const query = event.target.value.toLowerCase();
                                                    setFilteredCategories(categories.filter((c) => c.name.toLowerCase().includes(query)));
                                                }}
                                                placeholder="Rechercher ou saisir une catégorie..."
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
                                                className="w-full px-3 py-2 border rounded-lg"
                                                displayValue={(com) => com?.name || ""}
                                                onChange={(event) => {
                                                    const query = event.target.value.toLowerCase();
                                                    setFilteredCompanies(companies.filter((c) => c.name.toLowerCase().includes(query)));
                                                }}
                                                placeholder="Rechercher ou saisir une entreprise..."
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
                                            className="w-full px-3 py-2 border rounded-lg"
                                            placeholder="Saisissez une nouvelle entreprise..."
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`px-4 py-2 text-white font-medium rounded-lg ${isSubmitting ? "bg-gray-300" : "bg-indigo-600 hover:bg-indigo-700"}`}
                                        >
                                            {isSubmitting ? "Modification en cours..." : "Modifier l'abonnement"}
                                        </button>
                                    </div>

                                    {errorMessage && <p className="text-red-600">{errorMessage}</p>}
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default EditSubscriptionDialog;