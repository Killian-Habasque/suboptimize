"use client";

import { signIn } from "next-auth/react";

const Login = () => {
    return (
        <div>
            <button onClick={() => signIn("github", {redirectTo: '/home'})}>
                Sign In with Github
            </button>
            <button onClick={() => signIn("google", {redirectTo: '/home'})}>
                Sign In with Google
            </button>
        </div>
    );
};

export default Login;
