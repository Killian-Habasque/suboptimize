import { db } from "@/config/firebase";
import {
    collection,
    getDocs,
    query,
    orderBy,
    startAfter,
    limit as firestoreLimit,
    getDoc,
    doc,
} from "firebase/firestore";
import { Offer } from "@/features/types";

export const get_all_Offers = async (page: number, limit: number, lastVisible?: string): Promise<{ offers: Offer[], lastDocId?: string }> => {
    try {
        const offersRef = collection(db, "offers");
        let q = query(offersRef, orderBy("createdAt", "desc"), firestoreLimit(limit));

        if (lastVisible) {
            const lastVisibleDoc = await getDoc(doc(offersRef, lastVisible)); 
            q = query(offersRef, orderBy("createdAt", "desc"), startAfter(lastVisibleDoc), firestoreLimit(limit));
        }
        const querySnapshot = await getDocs(q);

        const offers: Offer[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id, 
                name: data.name, 
                slug: data.slug,
                userId: data.userId,
                price: data.price,
                description: data.description,
                imageLink: data.imageLink,
                promoCode: data.promoCode,
                normalPrice: data.normalPrice,
                expirationDate: data.expirationDate,
                rankingScore: data.rankingScore,
                externalLink: data.externalLink,
                category: data.category,
                company: data.company,
            } as Offer;
        });

        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

        return { offers, lastDocId: lastDoc ? lastDoc.id : undefined };
    } catch (error) {
        console.error("Error fetching offers:", error);
        throw new Error("Failed to fetch offers");
    }
};
