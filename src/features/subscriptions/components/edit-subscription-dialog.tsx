"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { update_Subscription } from "@/features/subscriptions/subscription-service";
import { useSubscription } from "@/features/subscriptions/subscription-context";
import { Category, Company } from "@prisma/client";
import { Subscription } from "@/lib/types";
import Field from "@/components/form/field";
import SubmitButton from "@/components/form/submit-button";
import ComboboxField from "@/components/form/combobox-field";
import SelectField from "@/components/form/select-field";
import { fetchCommonData } from "@/features/common-service";

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

interface EditSubscriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    subscription: Subscription;
}

const EditSubscriptionDialog: React.FC<EditSubscriptionDialogProps> = ({ isOpen, onClose, subscription }) => {
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
            price: "",
            category: null,
            company: null,
            customCompany: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            const loadData = async () => {
                try {
                    const { categories: categoriesData, companies: companiesData } = await fetchCommonData();
                    setCategories(categoriesData);
                    setFilteredCategories(categoriesData);
                    setCompanies(companiesData);
                    setFilteredCompanies(companiesData);
                } catch (error) {
                    console.error("Erreur lors du chargement des données :", error);
                }
            };
            loadData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && subscription) {
            setValue("title", subscription.title || "");
            setValue("dueType", (subscription.dueType === "monthly" || subscription.dueType === "yearly") 
                ? subscription.dueType 
                : "monthly");

            const startDate = new Date(subscription.startDatetime);
            setValue("dueDate", startDate.toISOString().split("T")[0]);

            if (subscription.endDatetime) {
                const endDate = new Date(subscription.endDatetime);
                setValue("endDate", endDate.toISOString().split("T")[0]);
            } else {
                setValue("endDate", "");
            }

            setValue("price", subscription.price?.toString() || "");

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

    const onSubmit = async (data: z.infer<typeof schema>) => {
        setErrorMessage("");
        try {
            const updatedSubscription = await update_Subscription(
                subscription.id,
                data.title,
                new Date(data.dueDate),
                data.endDate ? new Date(data.endDate) : null,
                parseFloat(data.price.replace(',', '.')),
                data.category ? [data.category.id] : [],
                data.company ? [data.company.id] : [],
                data.customCompany || null,
                data.dueType,
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
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
            <DialogPanel className="w-5xl min-h-3/4 bg-white p-6 shadow-xl rounded-lg ring-1 ring-black/[5%]">
                <DialogTitle className="mb-8 text-2xl font-semibold text-primary">Modifier l&apos;abonnement</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4 grid grid-cols-2 gap-4">
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
                        />

                        <SelectField
                            id="dueType"
                            label="Type d'échéance"
                            value={watch("dueType")}
                            onChange={(value) => setValue("dueType", value)}
                            options={[
                                { value: "monthly", label: "Mensuel" },
                                { value: "yearly", label: "Annuel" }
                            ]}
                        />

                        <Field
                            id="dueDate"
                            label="Date d'échéance"
                            type="date"
                            required
                            register={register}
                            name="dueDate"
                            errors={errors}
                        />

                        <Field
                            id="endDate"
                            label="Date de fin (optionnelle)"
                            type="date"
                            register={register}
                            name="endDate"
                            errors={errors}
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
                        />
                    </div>

                    <div className="relative space-y-4">
                        <ComboboxField
                            id="category"
                            label="Catégorie"
                            value={watch("category")}
                            onChange={(value) => setValue("category", value)}
                            options={filteredCategories}
                            displayValue={(cat) => cat?.name || ""}
                            onSearch={(query) => {
                                setFilteredCategories(categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())));
                            }}
                            placeholder="Rechercher ou saisir une catégorie..."
                        />

                        <ComboboxField
                            id="company"
                            label="Entreprise"
                            value={watch("company")}
                            onChange={(value) => setValue("company", value)}
                            options={filteredCompanies}
                            displayValue={(com) => com?.name || ""}
                            onSearch={(query) => {
                                setFilteredCompanies(companies.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())));
                            }}
                            placeholder="Rechercher ou saisir une entreprise..."
                        />

                        <Field
                            id="customCompany"
                            label="Entreprise personnalisée"
                            type="text"
                            placeholder="Saisissez une nouvelle entreprise..."
                            register={register}
                            name="customCompany"
                            errors={errors}
                        />
                    </div>

                    <div className="col-span-2">
                        <SubmitButton loading={isSubmitting}>
                            {isSubmitting ? "Modification en cours..." : "Modifier l'abonnement"}
                        </SubmitButton>
                        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
                    </div>
                </form>
            </DialogPanel>
        </Dialog>
    );
};

export default EditSubscriptionDialog;