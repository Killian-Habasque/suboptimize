"use client";

import { Subscription } from "@/lib/types";
import { useMemo } from "react";
import { useSubscription } from "@/features/subscriptions/subscription-context";

const ProfileStats = () => {
    const { subscriptions = [], loading } = useSubscription();
    
    const stats = useMemo(() => {
        // Calculer le montant total en utilisant le prix des abonnements
        const totalAmount = subscriptions.reduce((sum, sub) => sum + (sub.price || 0), 0);
        
        // Compter les abonnements par catégorie
        const categoryCount: Record<string, number> = {};
        
        // Compter les abonnements par entreprise
        const companyCount: Record<string, number> = {};
        
        subscriptions.forEach(sub => {
            // Compter par catégorie
            if (sub.categories && sub.categories.length > 0) {
                sub.categories.forEach(category => {
                    if (category.name) {
                        categoryCount[category.name] = (categoryCount[category.name] || 0) + 1;
                    }
                });
            } else if (sub.customCompany) {
                // Si pas de catégorie mais une entreprise personnalisée
                categoryCount["Personnalisé"] = (categoryCount["Personnalisé"] || 0) + 1;
            }
            
            // Compter par entreprise
            if (sub.companies && sub.companies.length > 0) {
                sub.companies.forEach(company => {
                    if (company.name) {
                        companyCount[company.name] = (companyCount[company.name] || 0) + 1;
                    }
                });
            } else if (sub.customCompany) {
                companyCount[sub.customCompany] = (companyCount[sub.customCompany] || 0) + 1;
            }
        });
        
        // Trouver la catégorie la plus utilisée
        let topCategory = { name: '', count: 0 };
        Object.entries(categoryCount).forEach(([name, count]) => {
            if (count > topCategory.count) {
                topCategory = { name, count };
            }
        });
        
        // Trouver l'entreprise la plus utilisée
        let topCompany = { name: '', count: 0 };
        Object.entries(companyCount).forEach(([name, count]) => {
            if (count > topCompany.count) {
                topCompany = { name, count };
            }
        });
        
        return {
            totalAmount,
            totalSubscriptions: subscriptions.length,
            topCategory,
            topCompany
        };
    }, [subscriptions]);
    
    if (loading) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Mes Statistiques</h2>
                <div className="text-center py-8 text-gray-500">
                    Chargement des statistiques...
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Mes Statistiques</h2>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-600">Total mensuel</h3>
                    <p className="text-2xl font-bold">{stats.totalAmount.toFixed(2)} €</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-600">Abonnements</h3>
                    <p className="text-2xl font-bold">{stats.totalSubscriptions}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-600">Catégorie préférée</h3>
                    <p className="text-xl font-bold">{stats.topCategory.name || 'Aucune'}</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-600">Fournisseur principal</h3>
                    <p className="text-xl font-bold">{stats.topCompany.name || 'Aucun'}</p>
                </div>
            </div>
            
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Votre objectif</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>Actuel: {stats.totalAmount.toFixed(2)} €</span>
                    <span>Objectif: 1000 €</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileStats; 