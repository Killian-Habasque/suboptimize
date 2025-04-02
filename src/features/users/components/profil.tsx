"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { User } from "@/lib/types";

interface ProfilProps {
    user: User;
}

const Profil: React.FC<ProfilProps> = ({ user }) => {
    return (
        <div>
            {user.image && (
                <Image
                    src={user.image}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
            )}
            {user.name && <span>{user.name}</span>}
            <button onClick={() => signOut()}>
                Déconnexion
            </button>
        </div>
    );
};

export default Profil;
