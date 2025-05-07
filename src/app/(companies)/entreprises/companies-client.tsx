"use client"
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import BrandBubble from '@/components/ui/brand-bubble';
import Field from '@/components/form/field';
import SubmitButton from '@/components/form/submit-button';

interface Company {
  id: string;
  name: string;
  slug: string;
  imageLink?: string;
}

export default function CompaniesClient() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (imageFile && imageFile.size > 500 * 1024) {
                alert("Le fichier doit être inférieur à 500 Ko.");
                return;
            }

            let imageUrl = '';
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('slug', slug);

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
                body: JSON.stringify({ name, slug, imageLink: imageUrl }),
            });

            if (response.ok) {
                setName('');
                setSlug('');
                setImageFile(null);
                fetchCompanies();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-lg p-6">
                <h1 className="text-xl font-semibold mb-6">Ajouter une entreprise</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field
                        id="name"
                        label="Nom de l&apos;entreprise"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom de l&apos;entreprise"
                        required
                    />
                    <Field
                        id="slug"
                        label="Slug de l&apos;entreprise"
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="Slug de l&apos;entreprise"
                        required
                    />
                    <Field
                        id="image"
                        label="Logo de l&apos;entreprise"
                        type="file"
                        value=""
                        onChange={handleFileChange}
                        placeholder=""
                        accept="image/*"
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
                            <BrandBubble 
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