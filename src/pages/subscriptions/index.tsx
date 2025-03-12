import { useSubscription } from "../../contexts/subscriptionContext";
import Calendar from '../../components/calendar_sub';

const Subscriptions = () => {
    const { subscriptions, loading } = useSubscription();
    return (
        <div className="text-2xl font-bold pt-14">
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
