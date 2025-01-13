import { auth } from "../config/firebase";
import { db } from "../config/firebase"; 
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";


export const addSubscription = async (
  title: string,
  startDatetime: Date,
  endDatetime: Date,
  billingDay: number
) => {
  if (!auth.currentUser) {
    throw new Error("Aucun utilisateur connecté.");
  }

  const uid = auth.currentUser.uid;

  const subscriptionsRef = collection(db, "subscriptions");

  await addDoc(subscriptionsRef, {
    userId: uid,
    title,
    startDatetime: startDatetime.toISOString(),
    endDatetime: endDatetime.toISOString(),
    billingDay,
    createdAt: serverTimestamp(),
  });

  console.log("Abonnement ajouté avec succès !");
};
