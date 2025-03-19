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
    where,
    serverTimestamp,
    getFirestore,
} from "firebase/firestore";
import { Offer } from "@/features/types";
import { FirebaseError } from "firebase/app";
import { convertToSlug } from "@/services/utils";

export const get_all_Offers = async (page: number, limit: number, lastVisible?: string, searchTerm?: string): Promise<{ offers: Offer[], lastDocId?: string }> => {
    try {
        const offersRef = collection(db, "offers");
        let q = query(offersRef, orderBy("createdAt", "desc"), firestoreLimit(limit));

        if (searchTerm) {
            const searchQuery = query(
                offersRef,
                where("slug", ">=", searchTerm),
                where("slug", "<=", searchTerm + '\uf8ff'),
                orderBy("name")
            );
            q = query(searchQuery, orderBy("createdAt", "desc"), firestoreLimit(limit));
        }

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
        if (error instanceof FirebaseError) {
            throw new Error(`Firebase error: ${error.message}`);
        }
        throw new Error("Failed to fetch offers");
    }
};





// Configuration pour générer un ID en ordre chronologique inversé
const GENERATION_OFFSET = new Date('5000-01-01').getTime();
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateId = () => {
  let autoId = '';
  for (let i = 0; i < 10; i++) {
    autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return (GENERATION_OFFSET - Date.now()).toString(32) + autoId;
};

// Fonction pour générer les trigrammes d'une chaîne
export const triGram = (txt) => {
  const map = {};
  const s1 = (txt || '').toLowerCase();
  const n = 3;
  for (let k = 0; k <= s1.length - n; k++) {
    map[s1.substring(k, k + n)] = true;
  }
  return map;
};

// Fonction pour ajouter une offre avec le champ _smeta pour la recherche full-text
export const addOffer = async (offer) => {
  const db = getFirestore();
  
  // Utilise le slug comme ID si présent, sinon génère un ID unique
  const id = offer.slug || generateId();
  
  // Concatène les champs à indexer (ici "name" et "description") et génère les trigrammes
  const payload = {
    ...offer,
    createdAt: offer.createdAt || serverTimestamp(),
    _smeta: triGram([offer.name || '', offer.description || ''].join(' ').slice(0, 500))
  };
  
  // Insertion dans la collection "offers"
  const offerRef = doc(db, "offers", id);
  await setDoc(offerRef, payload);
  
  console.log("Offre ajoutée avec succès !");
};
