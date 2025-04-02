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
