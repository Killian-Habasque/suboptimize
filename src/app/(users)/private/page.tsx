import { auth, requiredAuth } from "@/lib/auth-helper";

export default async function HomePage() {
    await requiredAuth();
    const user = await auth();
    
    return (
        <div>ONLY LOGIN PEOPLE ! 
            {user?.name}</div>
    );
};

