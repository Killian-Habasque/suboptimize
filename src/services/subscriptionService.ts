import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Subscription } from "../types/types";


export const getSubscriptions = async (userId: string): Promise<Subscription[]> => {
  if (!userId) throw new Error("L'UID de l'utilisateur est requis.");

  const subscriptionsRef = collection(db, "subscriptions");
  const q = query(subscriptionsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      uid: data.userId,
      title: data.title,
      startDatetime: data.startDatetime,
      endDatetime: data.endDatetime,
      billingDay: data.billingDay,
    } as Subscription;
  });
};

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
