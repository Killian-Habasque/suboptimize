import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { addSubscription, filterSubscriptionsByMonth, getSubscriptions } from "../../services/subscriptionService";
import { Subscription } from "../../types/types";
import Calendar from '../../components/calendar_sub.jsx'

const Subscriptions = () => {
    const { currentUser } = useAuth();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            if (!currentUser) {
                setSubscriptions([]);
                setLoading(false);
                return;
            }

            try {
                const userSubscriptions = await getSubscriptions(currentUser.uid);
                setSubscriptions(userSubscriptions);
            } catch (error) {
                console.error("Erreur lors de la récupération des abonnements :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, [currentUser]);

    const handleAddSubscription = async () => {
        if (!currentUser) {
            alert("Vous devez être connecté pour ajouter un abonnement.");
            return;
        }

        try {
            await addSubscription(
                "Abonnement Exemple New",
                new Date("2025-01-01"),
                new Date("2025-12-31"),
                15
            );
            alert("Abonnement ajouté avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'abonnement :", error);
            alert("Impossible d'ajouter l'abonnement. Veuillez réessayer.");
        }
    };

    return (
        <div className="text-2xl font-bold pt-14">
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleAddSubscription}
            >
                Ajouter un abonnement
            </button>
            {subscriptions.length > 0 ? <Calendar subscriptions={subscriptions} /> : ''}
 
            
            {/* {currentUser ? (
                <>
                    <p>
                        Hello {currentUser.displayName || currentUser.providerData[0]?.displayName}, you are now logged in.
                    </p>
                    <h2 className="mt-6 text-xl font-semibold">Vos abonnements :</h2>
                    {loading ? (
                        <p>Chargement des abonnements...</p>
                    ) : subscriptions.length > 0 ? (
                        <ul className="mt-4 space-y-4">
                            {subscriptions.map((sub) => (
                                <li key={sub.id} className="border p-4 rounded shadow">
                                    <p><strong>Titre :</strong> {sub.title}</p>
                                    <p><strong>Date de début :</strong> {new Date(sub.startDatetime).toLocaleDateString()}</p>
                                    <p><strong>Date de fin :</strong> {new Date(sub.endDatetime).toLocaleDateString()}</p>
                                    <p><strong>Jour de facturation :</strong> {sub.billingDay}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Vous n'avez aucun abonnement pour l'instant.</p>
                    )}
                </>
            ) : (
                <>You are not logged in.</>
            )} */}
        </div>
    );
};

export default Subscriptions;
