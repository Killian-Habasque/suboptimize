"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { User } from "@/lib/types";

interface ProfileInfoProps {
    user: User;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Mon Profil</h2>
            <div className="flex items-center gap-6 mb-8">
                {user.image ? (
                    <Image
                        src={user.image}
                        alt="Photo de profil"
                        width={96}
                        height={96}
                        className="rounded-full"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl">{user.name?.charAt(0) || "U"}</span>
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            </div>
            
            <div className="flex gap-4">
                <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                    Modifier mon profil
                </button>
                <button 
                    onClick={() => signOut()}
                    className="border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
                >
                    Déconnexion
                </button>
            </div>
        </div>
    );
};

export default ProfileInfo; 