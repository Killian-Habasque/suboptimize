"use client"
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function HomePage() {
    const { data: session } = useSession();

    return (
        <>
            {session?.user ? (
                <>
                    {session?.user.image && (
                        <Image
                            src={session.user.image}
                            alt="user avatar"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    )}
                    {session.user.name && (
                        <span>{session.user.name}</span>
                    )}
                    <button onClick={() => signOut()}>
                        Déconnexion
                    </button>
                </>
            ) : (
                <div className="flex flex-col items-center m-4">

                </div>
            )}
        </>
    );
};

