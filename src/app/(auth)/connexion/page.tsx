
import Login from "@/features/auth/components/login";
import { requiredGuest } from "@/lib/auth-helper";

export default async function Home() {
    await requiredGuest();
    return (
        <div className="flex flex-col justify-center items-center m-4">
            <h1 className="text-3xl my-3">Hey, time to Sign In</h1>
            <Login />
        </div>
    );
}
