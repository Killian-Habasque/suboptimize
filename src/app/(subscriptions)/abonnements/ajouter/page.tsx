"use client"

import { useState, useEffect } from 'react'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react'
import { add_Subscription } from "@/features/subscriptions/subscriptionService"
import { Category, Company, Offer } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const AddSubscription = () => {
    // const { data: session } = useSession()
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [dueType, setDueType] = useState('monthly')
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [dueDate, setDueDate] = useState(new Date())
    const [price, setPrice] = useState(0)
    const [category, setCategory] = useState<Category | null>(null)
    const [company, setCompany] = useState<Company | null>(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [companies, setCompanies] = useState<Company[]>([])

    useEffect(() => {
        // Charger les catégories et entreprises depuis l'API
        const fetchData = async () => {
            try {
                const [categoriesRes, companiesRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/companies')
                ])
                
                if (categoriesRes.ok && companiesRes.ok) {
                    const [categoriesData, companiesData] = await Promise.all([
                        categoriesRes.json(),
                        companiesRes.json()
                    ])
                    
                    setCategories(categoriesData)
                    setCompanies(companiesData)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                setErrorMessage('Erreur lors du chargement des données')
            }
        }

        fetchData()
    }, [])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // if (!session?.user?.id) {
        //     setErrorMessage('Vous devez être connecté pour ajouter un abonnement')
        //     return
        // }

        setIsSubmitting(true)
        try {
            await add_Subscription(
                // session.user.id,
                // 'cm8nj13c10000g4nux4kt5r28',
                title,
                dueDate,
                endDate,
                price,
                category ? [category.id] : [],
                company ? [company.id] : []
            )
            
            router.push('/abonnements')
        } catch (error) {
            console.error('Error:', error)
            setErrorMessage('Une erreur est survenue lors de l\'ajout de l\'abonnement.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <main className="w-full h-screen flex self-center place-content-center place-items-center">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                    <div className="text-center">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Ajouter un abonnement</h3>
                        </div>
                    </div>
                    <form
                        onSubmit={onSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Titre
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Type d&apos;échéance
                            </label>
                            <select
                                required
                                value={dueType}
                                onChange={(e) => setDueType(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
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
                            <label className="text-sm text-gray-600 font-bold">
                                Prix
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(parseFloat(e.target.value))}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Catégorie
                            </label>
                            <Combobox value={category} onChange={setCategory}>
                                <div className="relative mt-2">
                                    <ComboboxInput
                                        className="w-full px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        displayValue={(cat: Category | null) => cat?.name || ''}
                                        onChange={(event) => {
                                            const value = event.target.value.toLowerCase()
                                            setCategory(categories.find(c => c.name.toLowerCase().includes(value)) || null)
                                        }}
                                        placeholder="Rechercher une catégorie..."
                                    />
                                    <ComboboxOptions className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                                        {categories.map((cat) => (
                                            <ComboboxOption
                                                key={cat.id}
                                                value={cat}
                                                className={({ active }) =>
                                                    `cursor-default select-none relative px-4 py-2 ${
                                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                                    }`
                                                }
                                            >
                                                {cat.name}
                                            </ComboboxOption>
                                        ))}
                                    </ComboboxOptions>
                                </div>
                            </Combobox>
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Entreprise
                            </label>
                            <Combobox value={company} onChange={setCompany}>
                                <div className="relative mt-2">
                                    <ComboboxInput
                                        className="w-full px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        displayValue={(comp: Company | null) => comp?.name || ''}
                                        onChange={(event) => {
                                            const value = event.target.value.toLowerCase()
                                            setCompany(companies.find(c => c.name.toLowerCase().includes(value)) || null)
                                        }}
                                        placeholder="Rechercher une entreprise..."
                                    />
                                    <ComboboxOptions className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                                        {companies.map((comp) => (
                                            <ComboboxOption
                                                key={comp.id}
                                                value={comp}
                                                className={({ active }) =>
                                                    `cursor-default select-none relative px-4 py-2 ${
                                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                                    }`
                                                }
                                            >
                                                {comp.name}
                                            </ComboboxOption>
                                        ))}
                                    </ComboboxOptions>
                                </div>
                            </Combobox>
                        </div>

                        {errorMessage && (
                            <div className="text-red-600 font-bold text-sm">{errorMessage}</div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                                isSubmitting
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
                            }`}
                        >
                            {isSubmitting ? 'Ajout en cours...' : 'Ajouter l\'abonnement'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default AddSubscription