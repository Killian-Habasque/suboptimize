"use client";

import { useEffect, useState } from "react";
import { update_Subscription } from "@/features/subscriptions/subscription-service";
import { useSubscription } from "@/features/subscriptions/subscription-context";
import { Category, Company } from "@prisma/client";
import { Subscription } from "@/lib/types";
import { fetchCommonData } from "@/features/common-service";
import SubscriptionForm, { SubscriptionFormData } from "./subscription-form";
import Modal from "@/components/ui/modal";

interface EditSubscriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    subscription: Subscription;
}

const EditSubscriptionDialog: React.FC<EditSubscriptionDialogProps> = ({ isOpen, onClose, subscription }) => {
    const { setSubscriptions } = useSubscription();
    const [categories, setCategories] = useState<Category[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const onSubmit = async (data: SubscriptionFormData) => {
        setErrorMessage("");
        setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Modifier l'abonnement"
            size="5xl"
        >
            <SubscriptionForm
                onSubmit={onSubmit}
                categories={categories}
                companies={companies}
                isSubmitting={isSubmitting}
                submitLabel={isSubmitting ? "Modification en cours..." : "Modifier l'abonnement"}
                defaultValues={{
                    title: subscription.title || "",
                    dueType: (subscription.dueType === "monthly" || subscription.dueType === "yearly") 
                        ? subscription.dueType 
                        : "monthly",
                    dueDate: new Date(subscription.startDatetime).toISOString().split("T")[0],
                    endDate: subscription.endDatetime 
                        ? new Date(subscription.endDatetime).toISOString().split("T")[0]
                        : "",
                    price: subscription.price?.toString() || "",
                    category: subscription.categories && subscription.categories.length > 0
                        ? {
                            id: subscription.categories[0].id,
                            name: subscription.categories[0].name
                        }
                        : null,
                    company: subscription.companies && subscription.companies.length > 0
                        ? {
                            id: subscription.companies[0].id,
                            name: subscription.companies[0].name
                        }
                        : null,
                    customCompany: subscription.customCompany || "",
                }}
            />
            {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
        </Modal>
    );
};

export default EditSubscriptionDialog;