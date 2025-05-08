import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { add_Offer, OfferFormData, OfferApiData } from '../offerService';
import Field from '@/components/form/field';
import SubmitButton from '@/components/form/submit-button';
import Button from '@/components/ui/button';

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
    imageLink: z.string().url("Lien d'image invalide").or(z.literal('')).optional(),
});

const AddOfferDialog: React.FC<AddOfferDialogProps> = ({ isOpen, onClose }) => {
    const { data: session } = useSession();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<OfferFormData>({
        resolver: zodResolver(offerSchema),
        defaultValues: {
            name: '',
            description: '',
            price: '',
            normalPrice: '',
            imageLink: '',
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
            };

            await add_Offer(apiData);
            reset();
            onClose();
        } catch (error: unknown) {
            console.error("Erreur lors de l'ajout de l'abonnement :", error);
            setErrorMessage((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
            <DialogPanel className="w-96 bg-white p-6 shadow-xl rounded-lg">
                <DialogTitle className="text-xl font-semibold text-gray-800 mb-6">Ajouter une offre</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <Field
                        id="imageLink"
                        label="Lien de l'image"
                        type="text"
                        placeholder="URL de l'image"
                        register={register}
                        name="imageLink"
                        errors={errors}
                    />
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
