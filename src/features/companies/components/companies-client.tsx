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
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CompanyFormData>({
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

            if (editingCompany) {
                // Update existing company
                const response = await fetch('/api/companies', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        id: editingCompany.id,
                        name: data.name, 
                        slug: data.slug,
                        imageLink: imageUrl || editingCompany.imageLink
                    }),
                });

                if (response.ok) {
                    setEditingCompany(null);
                    reset();
                    fetchCompanies();
                }
            } else {
                // Create new company
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
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (company: Company) => {
        setEditingCompany(company);
        setValue('name', company.name);
        setValue('slug', company.slug);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
            return;
        }

        try {
            const response = await fetch('/api/companies', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                fetchCompanies();
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const handleCancel = () => {
        setEditingCompany(null);
        reset();
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-lg p-6">
                <h1 className="text-xl font-semibold mb-6">
                    {editingCompany ? 'Modifier une entreprise' : 'Ajouter une entreprise'}
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Field
                        id="name"
                        label="Nom de l'entreprise"
                        type="text"
                        placeholder="Nom de l'entreprise"
                        required
                        register={register}
                        name="name"
                        errors={errors}
                    />
                    <Field
                        id="slug"
                        label="Slug de l'entreprise"
                        type="text"
                        placeholder="Slug de l'entreprise"
                        required
                        register={register}
                        name="slug"
                        errors={errors}
                    />
                    <Field
                        id="image"
                        label="Logo de l'entreprise"
                        type="file"
                        accept="image/*"
                        register={register}
                        name="image"
                        errors={errors}
                    />
                    <div className="flex gap-4">
                        <SubmitButton loading={isSubmitting}>
                            {editingCompany ? 'Modifier' : 'Ajouter'} l&apos;entreprise
                        </SubmitButton>
                        {editingCompany && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Liste des entreprises</h2>
                <div className="flex flex-wrap gap-4">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            className="flex flex-col items-center justify-center rounded-lg p-4 border border-gray-200 bg-gray-50"
                        >
                            <CompanyBubble 
                                image={company.imageLink || null} 
                                brandName={company.name} 
                                altText={company.name} 
                                variant="medium" 
                            />
                            <span className="text-xs text-gray-600 mt-2 font-medium">{company.name}</span>
                            <span className="text-xs text-gray-400">{company.slug}</span>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleEdit(company)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(company.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 