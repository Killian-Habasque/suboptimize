import { User as NextAuthUser } from "next-auth";

export interface User extends NextAuthUser {
    image?: string | null | undefined; 
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

export interface Subscription {
    id: string;
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
