export interface Subscription {
    id: string;
    uid: string;
    title: string;
    startDatetime: string;
    endDatetime: string;
    billingDay: number;
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
}

export interface Category {
    id: string;
    title: string;
    slug: string;
}
export interface Offer {
    name: string;
    slug: string;
    description: string;
    imageLink: string;
    promoCode: string;
    price: string;
    normalPrice: string;
    expirationDate: string;
    rankingScore: string;
    category: Category[];
    brand: Brand[];
    userid: string;
}
