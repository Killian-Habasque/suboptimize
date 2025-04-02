import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { add_Offer } from '../offerService';

interface AddOfferDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const offerSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().min(1, "La description est requise"),
    price: z.number().positive("Le prix doit être positif"),
    normalPrice: z.number().positive("Le prix normal doit être positif"),
    imageLink: z.string().url("Lien d'image invalide").or(z.literal('')).optional(),
});

type OfferFormData = z.infer<typeof offerSchema>;

const AddOfferDialog: React.FC<AddOfferDialogProps> = ({ isOpen, onClose }) => {
    const { data: session } = useSession();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<OfferFormData>({
        resolver: zodResolver(offerSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            normalPrice: 0,
            imageLink: '',
        },
    });

    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data: OfferFormData) => {
        const userId = session?.user?.id;
        if (!userId) {
            console.error("Utilisateur non connecté");
            return;
        }
    
        try {
            await add_Offer({
                ...data,
                slug: data.name.toLowerCase().replace(/ /g, '-'),
                userId,
            });
            reset();
            onClose();
        } catch (error: unknown) {
            console.error("Erreur lors de l'ajout de l'abonnement :", error);
            setErrorMessage((error as Error).message);
        }
    };
    

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
            <DialogPanel className="w-96 bg-white p-6 shadow-xl rounded-lg">
                <DialogTitle className="text-xl font-semibold text-gray-800">Ajouter une offre</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label>Nom</label>
                        <input {...register("name")} placeholder="Nom" />
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea {...register("description")} placeholder="Description" />
                        {errors.description && <p>{errors.description.message}</p>}
                    </div>
                    <div>
                        <label>Prix</label>
                        <input type="number" {...register("price", { valueAsNumber: true })} placeholder="Prix" />
                        {errors.price && <p>{errors.price.message}</p>}
                    </div>
                    <div>
                        <label>Prix normal</label>
                        <input type="number" {...register("normalPrice", { valueAsNumber: true })} placeholder="Prix normal" />
                        {errors.normalPrice && <p>{errors.normalPrice.message}</p>}
                    </div>
                    <div>
                        <label>Lien de l&apos;image</label>
                        <input type="text" {...register("imageLink")} placeholder="URL de l'image" />
                        {errors.imageLink && <p>{errors.imageLink.message}</p>}
                    </div>
                    <button type="submit">Ajouter</button>
                    <button type="button" onClick={onClose}>Annuler</button>
                    {errorMessage && <p className="text-red-600">{errorMessage}</p>}
                </form>
            </DialogPanel>
        </Dialog>
    );
};

export default AddOfferDialog;
