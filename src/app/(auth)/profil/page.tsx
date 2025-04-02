import { requiredAuth } from "@/lib/auth-helper";
import Profil from "@/features/auth/components/profil";

export default async function HomePage() {
    const user = await requiredAuth();

    return (
        <Profil user={user} />
    );
}
