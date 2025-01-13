import { useAuth } from "../../contexts/authContext";
import { addSubscription } from "../../services/subscriptionService"; 

const Subscriptions = () => {
  const { currentUser } = useAuth();

  const handleAddSubscription = async () => {
    if (!currentUser) {
      alert("Vous devez être connecté pour ajouter un abonnement.");
      return;
    }

    try {
      await addSubscription(
        "Abonnement Exemple",
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
      {currentUser ? (
        <>
          <p>Hello {currentUser.displayName || currentUser.providerData[0]?.displayName}, you are now logged in.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleAddSubscription}
          >
            Ajouter un abonnement
          </button>
        </>
      ) : (
        <>You are not logged in.</>
      )}
    </div>
  );
};

export default Subscriptions;
