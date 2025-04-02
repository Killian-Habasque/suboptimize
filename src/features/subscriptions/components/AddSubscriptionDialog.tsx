"use client"

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { add_Subscription } from "@/features/subscriptions/subscriptionService";
import { Category, Company } from "@prisma/client";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { useSubscription } from "@/features/subscriptions/subscriptionContext";

interface AddSubscriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddSubscriptionDialog = ({ isOpen, onClose }: AddSubscriptionDialogProps) => {
    const { setSubscriptions } = useSubscription();
    const [title, setTitle] = useState('');
    const [dueType, setDueType] = useState('monthly');
    const [dueDate, setDueDate] = useState(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState<Category | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, companiesRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/companies')
                ]);

                if (categoriesRes.ok && companiesRes.ok) {
                    const [categoriesData, companiesData] = await Promise.all([
                        categoriesRes.json(),
                        companiesRes.json()
                    ]);

                    setCategories(categoriesData);
                    setCompanies(companiesData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage('Erreur lors du chargement des données');
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (!title.trim()) {
            setErrorMessage('Le titre est obligatoire.');
            setIsSubmitting(false);
            return;
        }

        try {
            const newSubscription = await add_Subscription(
                title,
                dueDate,
                endDate,
                price,
                category ? [category.id] : [],
                company ? [company.id] : []
            );

            setSubscriptions((prevSubscriptions) => [...prevSubscriptions, newSubscription]);

            onClose();
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Une erreur est survenue lors de l\'ajout de l\'abonnement.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
            <DialogPanel className="w-96 bg-white p-6 shadow-xl rounded-lg">
                <DialogTitle className="text-xl font-semibold text-gray-800">Ajouter un abonnement</DialogTitle>
                <form onSubmit={onSubmit} className="space-y-4 mt-4 relative">
                    <div>
                        <label className="text-sm font-bold">Titre*</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full mt-2 px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold">Type d&apos;échéance</label>
                        <select
                            required
                            value={dueType}
                            onChange={(e) => setDueType(e.target.value)}
                            className="w-full mt-2 px-3 py-2 border rounded-lg"
                        >
                            <option value="monthly">Mensuel</option>
                            <option value="yearly">Annuel</option>
                        </select>
                    </div>

                    <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Date d&apos;échéance
                            </label>
                            <input
                                type="date"
                                required
                                value={dueDate.toISOString().split('T')[0]}
                                onChange={(e) => setDueDate(new Date(e.target.value))}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Date de fin (optionnelle)
                            </label>
                            <input
                                type="date"
                                value={endDate?.toISOString().split('T')[0] || ''}
                                onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>

                    <div>
                        <label className="text-sm font-bold">Prix</label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value))}
                            className="w-full mt-2 px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold">Catégorie</label>
                        <Combobox value={category} onChange={setCategory}>
                            <ComboboxInput
                                className="w-full px-3 py-2 border rounded-lg"
                                displayValue={(cat: Category | null) => cat?.name || ''}
                                onChange={(event) => {
                                    const value = event.target.value.toLowerCase();
                                    setCategory(categories.find(c => c.name.toLowerCase().includes(value)) || null);
                                }}
                                placeholder="Rechercher une catégorie..."
                            />
                            <ComboboxOptions className="absolute z-10 w-full mt-1 bg-white border rounded-lg max-h-40 overflow-y-auto">
                                {categories.map((cat) => (
                                    <ComboboxOption key={cat.id} value={cat} className="px-4 py-2 cursor-pointer">
                                        {cat.name}
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>
                    </div>

                    <div>
                        <label className="text-sm font-bold">Company</label>
                        <Combobox value={company} onChange={setCompany}>
                            <ComboboxInput
                                className="w-full px-3 py-2 border rounded-lg"
                                displayValue={(company: Company | null) => company?.name || ''}
                                onChange={(event) => {
                                    const value = event.target.value.toLowerCase();
                                    setCompany(companies.find(c => c.name.toLowerCase().includes(value)) || null);
                                }}
                                placeholder="Rechercher une catégorie..."
                            />
                            <ComboboxOptions className="absolute z-10 w-full mt-1 bg-white border rounded-lg max-h-40 overflow-y-auto">
                                {companies.map((company) => (
                                    <ComboboxOption key={company.id} value={company} className="px-4 py-2 cursor-pointer">
                                        {company.name}
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>
                    </div>
                    {errorMessage && <div className="text-red-600 font-bold text-sm">{errorMessage}</div>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                            isSubmitting ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {isSubmitting ? 'Ajout en cours...' : 'Ajouter l&apos;abonnement'}
                    </button>
                </form>
            </DialogPanel>
        </Dialog>
    );
};

export default AddSubscriptionDialog;
