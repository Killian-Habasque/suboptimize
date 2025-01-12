import React, { useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

// Définir un type pour l'utilisateur
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  providerData: Array<any>;
}

// Définir un type pour le contexte d'authentification
interface AuthContextType {
  currentUser: User | null;
  userLoggedIn: boolean;
  isEmailUser: boolean;
  isGoogleUser: boolean;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  function initializeUser(user: FirebaseUser | null) {
    if (user) {
      const { uid, email, displayName, providerData } = user;

      setCurrentUser({
        uid,
        email,
        displayName,
        providerData,
      });

      setIsEmailUser(providerData.some((provider) => provider.providerId === "password"));
      setIsGoogleUser(providerData.some((provider) => provider.providerId === "google.com"));

      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  }

  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}