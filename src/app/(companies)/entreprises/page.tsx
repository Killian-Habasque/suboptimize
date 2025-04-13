"use client"
import { useEffect, useState } from 'react';

export default function CompaniesPage() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [companies, setCompanies] = useState([]);

    const handleSubmit = async (e) => {
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

    return (
        <div>
            <h1>Ajouter une entreprise</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom de l'entreprise"
                    required
                />
                <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Slug de l'entreprise"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required
                />
                <button type="submit">Ajouter</button>
            </form>

            <h2>Liste des entreprises</h2>
            <ul>
                {companies.map((company) => (
                    <li key={company.id}>
                        {company.name} - {company.slug}
                        {company.imageLink && <img src={company.imageLink} alt={company.name} style={{ width: '100px', height: 'auto' }} />}
                    </li>
                ))}
            </ul>
        </div>
    );
}
