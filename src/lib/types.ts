import { User as NextAuthUser } from "next-auth";
import { Category as PrismaCategory, Company as PrismaCompany } from "@prisma/client";
import type { DefaultSession } from "next-auth"

export interface User extends NextAuthUser {
    image?: string | null | undefined; 
} 

export type Company = PrismaCompany;
export type Category = PrismaCategory;

export interface Subscription {
    id: string;
    title: string;
    slug: string;
    dueType: "monthly" | "yearly";
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



declare module "next-auth" {
    interface User {
        role?: string
    }

    interface Session {
        user: {
            id: string
            role?: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string
    }
} 