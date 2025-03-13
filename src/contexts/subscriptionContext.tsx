import React, { createContext, useContext, useEffect, useState } from "react";
import { get_all_user_Subscriptions } from "../services/subscriptionService";
import { Subscription } from "../types/types";
import { useAuth } from "./authContext";

interface SubscriptionContextType {
  subscriptions: Subscription[];
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (currentUser) {
        try {
          const userId = currentUser.uid;
          const subs = await get_all_user_Subscriptions(userId);
          setSubscriptions(subs);
        } catch (error) {
          console.error("Erreur lors de la récupération des abonnements:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [currentUser]);

  const value = { subscriptions, loading };

  return (
    <SubscriptionContext.Provider value={value}>
      {!loading && children}
    </SubscriptionContext.Provider>
  );
} 