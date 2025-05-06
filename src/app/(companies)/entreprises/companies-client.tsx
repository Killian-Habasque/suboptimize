"use client"
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';

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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
        <div>
            <h1>Ajouter une entreprise</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder="Nom de l'entreprise"
                    required
                />
                <input
                    type="text"
                    value={slug}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)}
                    placeholder="Slug de l'entreprise"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit">Ajouter</button>
            </form>

            <h2>Liste des entreprises</h2>
            <ul>
                {companies.map((company) => (
                    <li key={company.id}>
                        {company.name} - {company.slug}
                        {company.imageLink && 
                            <Image 
                                src={company.imageLink} 
                                alt={company.name} 
                                width={100} 
                                height={100} 
                                style={{ height: 'auto' }} 
                            />
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
} 