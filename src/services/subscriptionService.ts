import { auth } from "@/config/firebase";
import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Company, Category, Subscription } from "@/types/types";
import { parse } from 'date-fns';

export const get_all_user_Subscriptions = async (userId: string): Promise<Subscription[]> => {
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

export const add_Subscription = async (
  title: string,
  dueDate: Date,
  endDate: Date,
  price: number,
  category: Category[],
  company: Company[],
  isPublic: boolean
) => {
  if (!auth.currentUser) {
    throw new Error("Aucun utilisateur connecté.");
  }

  const uid = auth.currentUser.uid;

  const subscriptionsRef = collection(db, "subscriptions");

  await addDoc(subscriptionsRef, {
    userId: uid,
    title,
    endDate: endDate.toISOString(),
    dueDate,
    price,
    createdAt: serverTimestamp(),
    category: category[0],
    company: company[0],
    isPublic
  });


  console.log("Abonnement ajouté avec succès !");
};

export const filter_Subscriptions_by_month = (
    subscriptions: Subscription[],
    targetMonthYear: string 
) => {
    const targetDate = parse(targetMonthYear, 'MMM-yyyy', new Date());

    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    return subscriptions.filter((sub) => {
        const startDate = new Date(sub.startDatetime);
        const endDate = new Date(sub.endDatetime);
        const billingDate = new Date(targetYear, targetMonth, sub.billingDay);
        return (
            billingDate >= startDate &&
            billingDate <= endDate &&
            billingDate.getMonth() === targetMonth &&
            billingDate.getFullYear() === targetYear
        );
    });
};