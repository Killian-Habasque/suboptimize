import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Category, Company } from "@prisma/client";
import { useState } from "react";
import Field from "@/components/form/field";
import SubmitButton from "@/components/form/submit-button";
import ComboboxField from "@/components/form/combobox-field";
import SelectField from "@/components/form/select-field";

export const subscriptionSchema = z.object({
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

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
    onSubmit: (data: SubscriptionFormData) => Promise<void>;
    defaultValues?: Partial<SubscriptionFormData>;
    categories: Category[];
    companies: Company[];
    isSubmitting: boolean;
    submitLabel: string;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
    onSubmit,
    defaultValues,
    categories,
    companies,
    isSubmitting,
    submitLabel,
}) => {
    const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(companies);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SubscriptionFormData>({
        resolver: zodResolver(subscriptionSchema),
        defaultValues: {
            title: "",
            dueType: "monthly",
            dueDate: new Date().toISOString().split("T")[0],
            endDate: "",
            price: "",
            category: null,
            company: null,
            customCompany: "",
            ...defaultValues,
        },
    });

    return (
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
                    {submitLabel}
                </SubmitButton>
            </div>
        </form>
    );
};

export default SubscriptionForm; 