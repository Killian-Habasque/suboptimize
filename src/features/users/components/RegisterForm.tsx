 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doRegister } from "../action";

const RegisterForm = () => {
    const router = useRouter();
    const [error, setError] = useState("");

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const response = await doRegister(formData);

            if (response.error) {
                setError(response.error);
            } else {
                router.push("/signin");
            }
        } catch (e) {
            console.error(e);
            setError("Une erreur est survenue lors de l'inscription");
        }
    }

    return (
        <form 
            className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
            onSubmit={onSubmit}
        >
            <div className="text-xl text-red-500">{error}</div>
            
            <div className="my-2">
                <label htmlFor="name">Nom</label>
                <input 
                    className="border mx-2 border-gray-500 rounded" 
                    type="text" 
                    name="name" 
                    id="name" 
                    required 
                />
            </div>

            <div className="my-2">
                <label htmlFor="email">Email</label>
                <input 
                    className="border mx-2 border-gray-500 rounded" 
                    type="email" 
                    name="email" 
                    id="email" 
                    required 
                />
            </div>

            <div className="my-2">
                <label htmlFor="password">Mot de passe</label>
                <input 
                    className="border mx-2 border-gray-500 rounded" 
                    type="password" 
                    name="password" 
                    id="password" 
                    required 
                />
            </div>

            <button 
                type="submit" 
                className="bg-green-500 text-white mt-4 rounded flex justify-center items-center w-36 p-2"
            >
                S'inscrire
            </button>
        </form>
    );
};

export default RegisterForm;