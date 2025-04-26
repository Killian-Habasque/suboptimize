"use client";

import { Subscription } from "@/lib/types";
import Image from "next/image";
import { useSubscription } from "@/features/subscriptions/subscriptionContext";

const ProfileSubscriptions = () => {
    const { subscriptions = [], loading } = useSubscription();
    
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Mes Abonnements</h2>
            
            <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded-md text-sm">
                        Tous
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-200">
                        Mensuel
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-200">
                        Annuel
                    </button>
                </div>
                <button className="text-purple-600 hover:underline text-sm">
                    Trier par prix
                </button>
            </div>
            
            {loading ? (
                <div className="text-center py-8 text-gray-500">
                    Chargement des abonnements...
                </div>
            ) : subscriptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Vous n'avez pas encore d'abonnements.
                </div>
            ) : (
                <div className="space-y-4">
                    {subscriptions.map((subscription, index) => {
                        // Récupérer la première entreprise associée pour l'affichage
                        const company = subscription.companies && subscription.companies.length > 0 
                            ? subscription.companies[0] 
                            : null;
                        
                        // Récupérer la première catégorie associée pour l'affichage
                        const category = subscription.categories && subscription.categories.length > 0 
                            ? subscription.categories[0] 
                            : null;
                        
                        return (
                            <div key={subscription.id || index} className="border rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {company?.imageLink ? (
                                        <Image 
                                            src={company.imageLink} 
                                            alt={subscription.title || "Abonnement"}
                                            width={48}
                                            height={48}
                                            className="rounded-md"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                            <span>{subscription.title ? subscription.title.charAt(0) : "?"}</span>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <h3 className="font-semibold">{subscription.title || "Abonnement sans nom"}</h3>
                                        <div className="flex items-center text-sm text-gray-600 space-x-2">
                                            <span>{category?.name || subscription.customCompany || "Non catégorisé"}</span>
                                            <span>•</span>
                                            <span>{subscription.dueType === 'monthly' ? 'Mensuel' : 'Annuel'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <p className="font-bold">{subscription.price?.toFixed(2) || "0.00"} €</p>
                                    <p className="text-sm text-gray-600">
                                        Prochain paiement: {subscription.dueDay ? `Le ${subscription.dueDay} du mois` : "Non spécifié"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            <div className="mt-6 flex justify-center">
                <button className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full hover:bg-purple-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Ajouter un abonnement
                </button>
            </div>
        </div>
    );
};

export default ProfileSubscriptions; 