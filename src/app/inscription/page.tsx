"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doCreateUserWithEmailAndDisplayName } from "@/services/authService";
import { useAuth } from "@/contexts/authContext";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userLoggedIn } = useAuth();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndDisplayName(email, password, pseudo);
        router.push("/");
      } catch (error) {
        console.error("Error during registration:", error);
        if (error instanceof Error) {
          setErrorMessage(error.message || "An error occurred during registration.");
        } else {
          setErrorMessage("An unknown error occurred.");
        }
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && router.push("/")}
      <main className="w-full h-screen flex items-center justify-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center mb-6">
            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
              Create a New Account
            </h3>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-bold">Pseudo</label>
              <input
                type="text"
                required
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-bold">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-bold">Password</label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-bold">
                Confirm Password
              </label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>
            {errorMessage && (
              <span className="text-red-600 font-bold">{errorMessage}</span>
            )}
            <button
              type="submit"
              disabled={isRegistering}
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                isRegistering
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
              }`}
            >
              {isRegistering ? "Signing Up..." : "Sign Up"}
            </button>
            <div className="text-sm text-center">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-center text-sm hover:underline font-bold">
                Continuer
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;