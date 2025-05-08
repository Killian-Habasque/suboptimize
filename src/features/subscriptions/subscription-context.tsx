'use client'

import React, { createContext, useContext, useEffect, useState } from "react";
import { get_all_user_Subscriptions } from "./subscription-service";
import { Subscription } from "@/lib/types";
import { useSession } from "next-auth/react";

interface SubscriptionContextType {
  subscriptions: Subscription[];
  loading: boolean;
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
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
    const { data: session } = useSession();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            if (session?.user?.id) {
                try {
                    const subs = await get_all_user_Subscriptions();
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
    }, [session?.user?.id]);

  const value = { subscriptions, loading, setSubscriptions };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}