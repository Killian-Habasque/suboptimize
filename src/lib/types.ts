import { User as NextAuthUser } from "next-auth";

export interface User extends NextAuthUser {
    image?: string | null | undefined; 
} 

export interface Company {
    imageLink: Company | undefined;
    id: string;
    name: string;
    slug: string;
}

export interface Category {
    id: string;
    title: string;
    slug: string;
}

export interface Subscription {
    id: string;
    title: string;
    slug: string;
    dueType: string;
    description: string;
    dueDay: number;
    price: number;
    customCompany: string;
    startDatetime: string;
    endDatetime: string;
    userId: string;
    categories?: Category[];
    companies?: Company[];
    offerId?: string;
}
