// import { useAuth } from "../../contexts/authContext";
import { useSubscription } from "../../contexts/subscriptionContext";
// import { addSubscription } from "../../services/subscriptionService";
import Calendar from '../../components/calendar_sub.jsx'

const Subscriptions = () => {
    // const { currentUser } = useAuth();
    const { subscriptions, loading } = useSubscription();

    // const handleAddSubscription = async () => {
    //     if (!currentUser) {
    //         alert("Vous devez être connecté pour ajouter un abonnement.");
    //         return;
    //     }

    //     try {
    //         await addSubscription(
    //             "Abonnement Exemple New",
    //             new Date("2025-01-01"),
    //             new Date("2025-12-31"),
    //             15
    //         );
    //         alert("Abonnement ajouté avec succès !");
    //     } catch (error) {
    //         console.error("Erreur lors de l'ajout de l'abonnement :", error);
    //         alert("Impossible d'ajouter l'abonnement. Veuillez réessayer.");
    //     }
    // };

    return (
        <div className="text-2xl font-bold pt-14">
            {/* <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleAddSubscription}
            >
                Ajouter un abonnement
            </button> */}
            {loading ? (
                <p>Chargement des abonnements...</p>
            ) : subscriptions.length > 0 ? (
                <Calendar subscriptions={subscriptions} />
            ) : (
                <p>Vous n'avez aucun abonnement pour l'instant.</p>
            )}
        </div>
    );
};

export default Subscriptions;
