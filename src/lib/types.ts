import { User as NextAuthUser } from "next-auth";

export interface User extends NextAuthUser {
    image?: string | null | undefined; 
} 