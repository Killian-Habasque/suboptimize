import { redirect } from "next/navigation";
import { baseAuth } from "./auth";

export const auth = async () => {
    const session = await baseAuth();
    return session?.user;
};

export const requiredAuth = async () => {
    const user = await auth();
    if (!user) {
        redirect("/connexion");
    }
    return user;
};

export const requiredGuest = async () => {
    const user = await auth();
    if (user) {
        redirect("/profil");
    }
    return user;
};

export const requiredAdmin = async () => {
    const user = await requiredAuth();
    console.log('User role:', user.role);
    if (user.role !== "admin") {
        redirect("/");
    }
    return user;
};
