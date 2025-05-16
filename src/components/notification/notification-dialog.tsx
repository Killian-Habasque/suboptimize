"use client";

import { useState } from 'react';
import Modal from '@/components/ui/modal';
import Field from '@/components/form/field';
import SubmitButton from '@/components/form/submit-button';
import Button from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface NotificationDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const notificationSchema = z.object({
    keywords: z.string().min(1, "Les mots clés sont requis"),
    range: z.number().min(0).max(100),
    emailNotification: z.boolean(),
    phoneNotification: z.boolean(),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

const NotificationDialog: React.FC<NotificationDialogProps> = ({ isOpen, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { register, handleSubmit, formState: { errors }, watch } = useForm<NotificationFormData>({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            keywords: '',
            range: 10,
            emailNotification: false,
            phoneNotification: false,
        },
    });

    const rangeValue = watch('range');

    const onSubmit = async (formData: NotificationFormData) => {
        setIsSubmitting(true);
        try {
            console.log('Notification settings:', formData);
            onClose();
        } catch (error: unknown) {
            console.error("Erreur lors de la configuration des notifications :", error);
            setErrorMessage((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Configuration des notifications"
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field
                    id="keywords"
                    label="Tapez un mot clé"
                    type="text"
                    placeholder="Ex: Netflix, Spotify..."
                    required
                    register={register}
                    name="keywords"
                    errors={errors}
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Score de popularité
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            {...register('range', { valueAsNumber: true })}
                            className="w-full"
                        />
                        <span className="text-sm text-gray-500">
                            {rangeValue == 100 ? "+" : ""}
                            {rangeValue}
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="emailNotification"
                            {...register('emailNotification')}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="emailNotification" className="ml-2 block text-sm text-gray-700">
                            Recevoir une notification par email
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="phoneNotification"
                            {...register('phoneNotification')}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="phoneNotification" className="ml-2 block text-sm text-gray-700">
                            Recevoir une notification par téléphone
                        </label>
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
                        Enregistrer
                    </SubmitButton>
                </div>

                {errorMessage && (
                    <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
                )}
            </form>
        </Modal>
    );
};

export default NotificationDialog; 