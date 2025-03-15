import { db } from "@/config/firebase";
import {
    collection,
    getDocs,
    query,
    orderBy,
} from "firebase/firestore";
import { Offer } from "@/types/types";


export const get_all_Offers = async (): Promise<Offer[]> => {
    const subscriptionsRef = collection(db, "offers");
    const q = query(subscriptionsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log(data)
        const offer: Offer = {
            name: data.name,
            slug: data.slug,
            userId: data.userId,
            price: data.price,
        };
        if (data.description) offer.description = data.description;
        if (data.imageLink) offer.imageLink = data.imageLink;
        if (data.promoCode) offer.promoCode = data.promoCode;
        if (data.normalPrice) offer.normalPrice = data.normalPrice;
        if (data.expirationDate) offer.expirationDate = data.expirationDate;
        if (data.rankingScore) offer.rankingScore = data.rankingScore;
        if (data.externalLink) offer.externalLink = data.externalLink;
        if (data.category) offer.category = data.category;
        if (data.company) offer.company = data.company;

        return offer;
    });
};