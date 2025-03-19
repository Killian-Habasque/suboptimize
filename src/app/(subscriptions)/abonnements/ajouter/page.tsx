"use client"

import { useState, useEffect } from 'react'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react'
import { add_Subscription } from "@/features/subscriptions/subscriptionService";
import { Category, Company, Offer } from "@/features/types";
// import { get_all_Offers } from "@/features/offers/offerService";
import { debounce } from 'lodash';
import { addOffer } from '@/features/offers/offerService';

const AddSubscription = () => {
    const [title, setTitle] = useState('')
    const [dueType, setDueType] = useState('annuel')
    const [endDate, setEndDate] = useState(new Date())
    const [dueDate, setDueDate] = useState(new Date())
    const [price, setPrice] = useState(0)
    const [category, setCategory] = useState<Category | null>(null)
    const [company, setCompany] = useState<Company | null>(null)
    const [isPublic, setIsPublic] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [offers, setOffers] = useState<Offer[]>([])
    const [offer, setOffer] = useState<Offer | null>(null)
    const [searchTerm, setSearchTerm] = useState('');

    const categories: Category[] = [
        { id: '1', title: 'Téléphone', slug: 'telephone' },
        { id: '2', title: 'Internet', slug: 'internet' }
    ];

    const companies: Company[] = [
        { id: '1', name: 'Orange', slug: 'orange' },
        { id: '2', name: 'Bouygues', slug: 'bouygues' }
    ];

    const fetchOffers = async (term: string) => {
        if (term.length < 3) {
            setOffers([]);
            return;
        }
        try {
            const response = await fetch(`/api/offers/search?search=${term}`);
            const data = await response.json();
            setOffers(data.offers);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    const debouncedFetchOffers = debounce(fetchOffers, 500);

    useEffect(() => {
        debouncedFetchOffers(searchTerm);
    }, [searchTerm]);

    const onSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setIsSigningIn(true)
        try {
            await add_Subscription(
                title,
                dueDate,
                endDate,
                price,
                category ? [category] : [],
                company ? [company] : [],
                isPublic
            );
        } catch (error) {
            setErrorMessage('Une erreur est survenue lors de l\'ajout de l\'abonnement.' + error)
        } finally {
            setIsSigningIn(false)
        }
    }

    const offerData = {
        createdAt: Date.now(),
        description: "test",
        name: "Forfait mobile 5G",
        price: 20,
        slug: "forfait-mobile-5g",
        userId: "zuG0b5CE1FX4drRddeatpfE4m2L2"
    };
    const onSubmit2 = async (e) => {
        e.preventDefault();
        try {
            await addOffer(offerData);
            // Traitez le succès (afficher un message, réinitialiser le formulaire, etc.)
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'offre :", error);
        }
    };
    return (
        <div>
            <main className="w-full h-screen flex self-center place-content-center place-items-center">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                    <div className="text-center">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Add subscription</h3>
                        </div>
                        <button onClick={onSubmit2}>OOOOOOOFFFFEEERS</button>
                    </div>
                    <form
                        onSubmit={onSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Offres
                            </label>
                            <Combobox value={offer} onChange={setOffer}>
                                <div className="relative mt-2">
                                    <ComboboxInput
                                        className="w-full px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                        displayValue={(offer: Offer | null) => offer ? offer.name : ''}
                                        onChange={(event) => {
                                            setSearchTerm(event.target.value);
                                            setOffer(null);
                                        }}
                                        placeholder="Rechercher une offre..."
                                    />
                                    <ComboboxOptions className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                                        {offers.filter(o => o && o.name && o.name.toLowerCase().includes((offer?.name || '').toLowerCase())).map((o, index) => (
                                            <ComboboxOption key={index} value={o} className={({ active }) => `cursor-default select-none relative px-4 py-2 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}>
                                                {o.name}
                                            </ComboboxOption>
                                        ))}
                                    </ComboboxOptions>
                                </div>
                            </Combobox>
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Titre
                            </label>
                            <input
                                type="text"
                                required
                                value={title} onChange={(e) => { setTitle(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Type d&apos;échéance
                            </label>
                            <select
                                required
                                value={dueType} onChange={(e) => { setDueType(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            >
                                <option value="annuel">Annuel</option>
                                <option value="mensuel">Mensuel</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Date de fin d&pos;abonnement
                            </label>
                            <input
                                type="date"
                                required
                                value={endDate.toISOString().split('T')[0]} onChange={(e) => { setEndDate(new Date(e.target.value)) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Date d&apos;échéance
                            </label>
                            <input
                                type="date"
                                required
                                value={dueDate.toISOString().split('T')[0]} onChange={(e) => { setDueDate(new Date(e.target.value)) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Prix
                            </label>
                            <input
                                type="number"
                                required
                                value={price} onChange={(e) => { setPrice(parseFloat(e.target.value)) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Catégories
                            </label>
                            <Combobox value={category} onChange={setCategory}>
                                <div className="relative mt-2">
                                    <ComboboxInput
                                        className="w-full px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                        displayValue={(cat: Category | null) => cat ? cat.title : ''}
                                        onChange={(event) => setCategory(categories.find(c => c.title.toLowerCase().includes(event.target.value.toLowerCase())) || null)}
                                        placeholder="Rechercher une catégorie..."
                                    />
                                    <ComboboxOptions className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                                        {categories.filter(cat => cat.title.toLowerCase().includes((category?.title || '').toLowerCase())).map((cat, index) => (
                                            <ComboboxOption key={index} value={cat} className={({ active }) => `cursor-default select-none relative px-4 py-2 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}>
                                                {cat.title}
                                            </ComboboxOption>
                                        ))}
                                    </ComboboxOptions>
                                </div>
                            </Combobox>
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Marque
                            </label>
                            <Combobox value={company} onChange={setCompany}>
                                <div className="relative mt-2">
                                    <ComboboxInput
                                        className="w-full px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                        displayValue={(br: Company | null) => br ? br.name : ''}
                                        onChange={(event) => setCompany(companies.find(b => b.name.toLowerCase().includes(event.target.value.toLowerCase())) || null)}
                                        placeholder="Rechercher une marque..."
                                    />
                                    <ComboboxOptions className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                                        {companies.filter(br => br.name.toLowerCase().includes((company?.name || '').toLowerCase())).map((br, index) => (
                                            <ComboboxOption key={index} value={br} className={({ active }) => `cursor-default select-none relative px-4 py-2 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}>
                                                {br.name}
                                            </ComboboxOption>
                                        ))}
                                    </ComboboxOptions>
                                </div>
                            </Combobox>
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isPublic} onChange={(e) => { setIsPublic(e.target.checked) }}
                                    className="mr-2"
                                />
                                Partager en public
                            </label>
                        </div>

                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isSigningIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isSigningIn ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default AddSubscription