"use client"
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Field from '@/components/form/field';
import SubmitButton from '@/components/form/submit-button';
import * as HeroIcons from '@heroicons/react/24/solid';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

const categorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  icon: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

// Liste des icônes disponibles
const availableIcons = Object.keys(HeroIcons)
  .filter(key => key.endsWith('Icon'))
  .map(key => key.replace('Icon', ''));

export default function CategoriesClient() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            slug: '',
            icon: '',
        },
    });

    const fetchCategories = async () => {
        const response = await fetch('/api/categories');
        if (response.ok) {
            const data = await response.json();
            setCategories(data);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmit = async (data: CategoryFormData) => {
        setIsSubmitting(true);
        try {
            if (editingCategory) {
                const response = await fetch('/api/categories', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        id: editingCategory.id,
                        name: data.name, 
                        slug: data.slug,
                        icon: data.icon || null,
                    }),
                });

                if (response.ok) {
                    setEditingCategory(null);
                    reset();
                    fetchCategories();
                }
            } else {
                const response = await fetch('/api/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: data.name,
                        slug: data.slug,
                        icon: data.icon || null,
                    }),
                });

                if (response.ok) {
                    reset();
                    fetchCategories();
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setValue('name', category.name);
        setValue('slug', category.slug);
        setValue('icon', category.icon || '');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            return;
        }

        try {
            const response = await fetch('/api/categories', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                fetchCategories();
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const handleCancel = () => {
        setEditingCategory(null);
        reset();
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-lg p-6">
                <h1 className="text-xl font-semibold mb-6">
                    {editingCategory ? 'Modifier une catégorie' : 'Ajouter une catégorie'}
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Field
                        id="name"
                        label="Nom de la catégorie"
                        type="text"
                        placeholder="Nom de la catégorie"
                        required
                        register={register}
                        name="name"
                        errors={errors}
                    />
                    <Field
                        id="slug"
                        label="Slug de la catégorie"
                        type="text"
                        placeholder="Slug de la catégorie"
                        required
                        register={register}
                        name="slug"
                        errors={errors}
                    />
                    <div className="space-y-2">
                        <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                            Icône
                        </label>
                        <select
                            id="icon"
                            {...register('icon')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Sélectionner une icône</option>
                            {availableIcons.map((iconName) => (
                                <option key={iconName} value={iconName}>
                                    {iconName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <SubmitButton loading={isSubmitting}>
                            {editingCategory ? 'Modifier' : 'Ajouter'} la catégorie
                        </SubmitButton>
                        {editingCategory && (
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
                <h2 className="text-xl font-semibold mb-6">Liste des catégories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                            <div>
                                <h3 className="font-medium">{category.name}</h3>
                                <p className="text-sm text-gray-500">{category.slug}</p>
                                {category.icon && (
                                    <p className="text-xs text-gray-400">Icône: {category.icon}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="text-red-600 hover:text-red-800"
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