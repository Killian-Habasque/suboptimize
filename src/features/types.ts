export interface Subscription {
    id: string;
    uid: string;
    title: string;
    startDatetime: string;
    endDatetime: string;
    billingDay: number;
}

export interface Company {
    id: string;
    name: string;
    slug: string;
}

export interface Category {
    id: string;
    title: string;
    slug: string;
}


export interface Subscription2 {
    subId: string;
    title: string;
    slug: string;
    dueType: string;
    dueDay: number;
    startDatetime: string;
    endDatetime: string;
    userId: string;
    category?: Category[];
    company?: Company[];
    offerId?: string;
}



export interface Offer {
    name: string;
    slug: string;
    userId: string;
    price: number;
    description?: string;
    imageLink?: string;
    promoCode?: string;
    normalPrice?: string;
    expirationDate?: string;
    rankingScore?: string;
    externalLink?: string;
    category?: Category[];
    company?: Company[];
}

export interface User {
    pseudo: string;
    imageLink?: string;
}

export interface User {
    pseudo: string;
    imageLink?: string;
}