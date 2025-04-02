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

const schema = z.object({
    title: z.string().min(1, "Le titre est obligatoire"),
    dueType: z.enum(["monthly", "yearly"]),
    dueDate: z.string(),
    endDate: z.string().optional(),
    price: z.coerce.number().min(0, "Le prix doit être positif"),
    category: z.any().nullable(),
    company: z.any().nullable(),
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

    const onSubmit = async (data: any) => {
        setErrorMessage("");
        try {
            const newSubscription = await add_Subscription(
                data.title,
                new Date(data.dueDate),
                data.endDate ? new Date(data.endDate) : null,
                data.price,
                data.category ? [data.category.id] : [],
                data.company ? [data.company.id] : []
            );

            setSubscriptions((prev) => [...prev, newSubscription]);
            onClose();
        } catch (error: unknown) {
            console.error("Erreur lors de l'ajout de l'abonnement :", error);
            setErrorMessage((error as Error).message);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
            <DialogPanel className="w-96 bg-white p-6 shadow-xl rounded-lg">
                <DialogTitle className="text-xl font-semibold text-gray-800">Ajouter un abonnement</DialogTitle>
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
                                placeholder="Rechercher une catégorie..."
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
                                displayValue={(cat) => cat?.name || ""}
                                onChange={(event) => {
                                    const query = event.target.value.toLowerCase();
                                    setFilteredCompanies(companies.filter((c) => c.name.toLowerCase().includes(query)));
                                }}
                                placeholder="Rechercher une catégorie..."
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
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isSubmitting ? "bg-gray-300" : "bg-indigo-600 hover:bg-indigo-700"}`}
                    >
                        {isSubmitting ? "Ajout en cours..." : "Ajouter l'abonnement"}
                    </button>
                    {errorMessage && <p className="text-red-600">{errorMessage}</p>}
                </form>
            </DialogPanel>
        </Dialog>
    );
};

export default AddSubscriptionDialog;
