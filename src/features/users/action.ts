
'use server'

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { saltAndHashPassword } from "@/utils/password";


export async function doSocialLogin(formData) {
    const action = formData.get('action');
    await signIn(action, { redirectTo: "/home" });
}

export async function doLogout() {
    await signOut({ redirectTo: "/" });
}

export async function doCredentialLogin(formData) {
    console.log("formData", formData);

    try {
        const response = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });
        return response;
    } catch (err) {
        throw err;
    }
}

export async function doRegister(formData) {
    try {
        const email = formData.get("email");
        const password = formData.get("password");
        const name = formData.get("name");

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "Cet email est déjà utilisé" };
        }

        const hashedPassword = await saltAndHashPassword(password);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Erreur lors de l'inscription" };
    }
}