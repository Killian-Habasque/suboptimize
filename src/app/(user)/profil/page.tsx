"use client";
import { useAuth } from "@/contexts/authContext";
import { useState } from "react";
import { updateUserProfileImage } from "@/services/authService";

const Profil = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !currentUser) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'upload");
            }

            const data = await response.json();
            const photoURL = data.url;

            await updateUserProfileImage(photoURL);
            setCurrentUser((prev) => prev ? { ...prev, photoURL } : null);

        } catch (error) {
            console.error("Erreur lors de l'upload de l'image :", error);
        }

        setUploading(false);
    };
    console.log(currentUser)
    return (
        <div className="text-2xl font-bold pt-14">
            {currentUser ? (
                <div>
                    <h1>Profil de {currentUser.displayName}</h1>
                    <p>Email: {currentUser.email}</p>

                    <img
                        src={
                            currentUser.providerData[0].photoURL ||
                            `https://ui-avatars.com/api/?name=${currentUser.displayName}`
                        }
                        alt="Photo de profil"
                        className="h-32 w-32 rounded-full"
                    />

                    <div className="mt-4">
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <button
                            onClick={handleUpload}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                            disabled={uploading}
                        >
                            {uploading ? "Upload en cours..." : "Mettre à jour la photo"}
                        </button>
                    </div>
                </div>
            ) : (
                <p>Aucun utilisateur connecté.</p>
            )}
        </div>
    );
};

export default Profil;
