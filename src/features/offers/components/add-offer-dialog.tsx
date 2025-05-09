import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { add_Offer, OfferFormData, OfferApiData } from '../offer-service';
import { fetchCommonData } from '@/features/common-service';
import Field from '@/components/form/field';
import SubmitButton from '@/components/form/submit-button';
import Button from '@/components/ui/button';
import { Category, Company } from '@prisma/client';

interface AddOfferDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const offerSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().min(1, "La description est requise"),
    price: z.string()
        .min(1, "Le prix est requis")
        .refine((val) => {
            const num = parseFloat(val.replace(',', '.'));
            return !isNaN(num) && num > 0;
        }, "Le prix doit être un nombre positif"),
    normalPrice: z.string()
        .min(1, "Le prix normal est requis")
        .refine((val) => {
            const num = parseFloat(val.replace(',', '.'));
            return !isNaN(num) && num > 0;
        }, "Le prix normal doit être un nombre positif"),
    imageLink: z.string().optional(),
    promoCode: z.string().optional(),
    expirationDate: z.string().optional(),
    category: z.object({ id: z.string(), name: z.string() }).nullable(),
    company: z.object({ id: z.string(), name: z.string() }).nullable(),
});

const AddOfferDialog: React.FC<AddOfferDialogProps> = ({ isOpen, onClose }) => {
    const { data: session } = useSession();
    const [categories, setCategories] = useState<Category[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<OfferFormData>({
        resolver: zodResolver(offerSchema),
        defaultValues: {
            name: '',
            description: '',
            price: '',
            normalPrice: '',
            imageLink: '',
            promoCode: '',
            expirationDate: '',
            category: null,
            company: null,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (isOpen) {
            reset();
            setErrorMessage("");
        }
    }, [isOpen, reset]);

    const onSubmit = async (formData: OfferFormData) => {
        const userId = session?.user?.id;
        if (!userId) {
            console.error("Utilisateur non connecté");
            return;
        }

        setIsSubmitting(true);
        try {
            const apiData: OfferApiData = {
                ...formData,
                price: parseFloat(formData.price.replace(',', '.')),
                normalPrice: parseFloat(formData.normalPrice.replace(',', '.')),
                slug: formData.name.toLowerCase().replace(/ /g, '-'),
                userId,
                categoryIds: formData.category ? [formData.category.id] : [],
                companyIds: formData.company ? [formData.company.id] : [],
            };

            await add_Offer(apiData);
            reset();
            onClose();
        } catch (error: unknown) {
            console.error("Erreur lors de l'ajout de l'offre :", error);
            setErrorMessage((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
            <DialogPanel className="w-[600px] bg-white p-6 shadow-xl rounded-lg">
                <DialogTitle className="text-xl font-semibold text-gray-800 mb-6">Ajouter une offre</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <Field
                                id="name"
                                label="Nom"
                                type="text"
                                placeholder="Nom de l'offre"
                                required
                                register={register}
                                name="name"
                                errors={errors}
                            />
                            <Field
                                id="description"
                                label="Description"
                                type="textarea"
                                placeholder="Description de l'offre"
                                required
                                register={register}
                                name="description"
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
                            <Field
                                id="normalPrice"
                                label="Prix normal"
                                type="text"
                                placeholder="Prix normal (ex: 10,99)"
                                required
                                register={register}
                                name="normalPrice"
                                errors={errors}
                            />
                        </div>
                        <div className="space-y-4">
                            <Field
                                id="imageLink"
                                label="Lien de l'image"
                                type="text"
                                placeholder="URL de l'image"
                                register={register}
                                name="imageLink"
                                errors={errors}
                            />
                            <Field
                                id="promoCode"
                                label="Code promo"
                                type="text"
                                placeholder="Code promo"
                                register={register}
                                name="promoCode"
                                errors={errors}
                            />
                            <Field
                                id="expirationDate"
                                label="Date d'expiration"
                                type="date"
                                register={register}
                                name="expirationDate"
                                errors={errors}
                            />
                            <div>
                                <label className="text-sm font-bold">Catégorie</label>
                                <Combobox value={watch("category")} onChange={(value) => setValue("category", value)}>
                                    <ComboboxInput
                                        className="w-full px-3 py-2 border rounded-lg"
                                        displayValue={(cat: { name: string } | null) => cat?.name || ""}
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
                                        displayValue={(com: { name: string } | null) => com?.name || ""}
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
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="light"
                            onClick={onClose}
                        >
                            Annuler
                        </Button>
                        <SubmitButton loading={isSubmitting}>
                            Ajouter
                        </SubmitButton>
                    </div>
                    {errorMessage && (
                        <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
                    )}
                </form>
            </DialogPanel>
        </Dialog>
    );
};

export default AddOfferDialog;
