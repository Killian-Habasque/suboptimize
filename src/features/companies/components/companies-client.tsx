"use client"
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CompanyBubble from '@/components/ui/company-bubble';
import Field from '@/components/form/field';
import SubmitButton from '@/components/form/submit-button';

interface Company {
  id: string;
  name: string;
  slug: string;
  imageLink?: string;
}

const companySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  image: z.any().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function CompaniesClient() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    });

    const fetchCompanies = async () => {
        const response = await fetch('/api/companies');
        if (response.ok) {
            const data = await response.json();
            setCompanies(data);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const onSubmit = async (data: CompanyFormData) => {
        setIsSubmitting(true);
        try {
            let imageUrl = '';
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            const file = fileInput?.files?.[0];

            if (file) {
                if (file.size > 500 * 1024) {
                    alert("Le fichier doit être inférieur à 500 Ko.");
                    return;
                }

                const formData = new FormData();
                formData.append('file', file);
                formData.append('slug', data.slug);

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (uploadResponse.ok) {
                    const uploadData = await uploadResponse.json();
                    imageUrl = uploadData.url;
                } else {
                    alert("Erreur lors de l'upload de l'image.");
                    return;
                }
            }

            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: data.name, 
                    slug: data.slug, 
                    imageLink: imageUrl 
                }),
            });

            if (response.ok) {
                reset();
                fetchCompanies();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-lg p-6">
                <h1 className="text-xl font-semibold mb-6">Ajouter une entreprise</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Field
                        id="name"
                        label="Nom de l&apos;entreprise"
                        type="text"
                        placeholder="Nom de l&apos;entreprise"
                        required
                        register={register}
                        name="name"
                        errors={errors}
                    />
                    <Field
                        id="slug"
                        label="Slug de l&apos;entreprise"
                        type="text"
                        placeholder="Slug de l&apos;entreprise"
                        required
                        register={register}
                        name="slug"
                        errors={errors}
                    />
                    <Field
                        id="image"
                        label="Logo de l&apos;entreprise"
                        type="file"
                        accept="image/*"
                        register={register}
                        name="image"
                        errors={errors}
                    />
                    <SubmitButton loading={isSubmitting}>
                        Ajouter l&apos;entreprise
                    </SubmitButton>
                </form>
            </div>

            <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Liste des entreprises</h2>
                <div className="flex flex-wrap gap-4">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            className="flex flex-col items-center justify-center bg-white rounded-lg p-4"
                        >
                            <CompanyBubble 
                                image={company.imageLink || null} 
                                brandName={company.name} 
                                altText={company.name} 
                                variant="medium" 
                            />
                            <span className="text-xs text-gray-600 mt-2 font-medium">{company.name}</span>
                            <span className="text-xs text-gray-400">{company.slug}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 