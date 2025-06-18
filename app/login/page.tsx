"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FirebaseError } from "@firebase/app";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const code = err instanceof FirebaseError ? err.code : "nieznany błąd";
      setError(`Wystąpił błąd logowania (${code}).`);
    }
  };

  if (isLoading) {
    return <main className="flex-1" />;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-96 mx-auto mt-44 gap-4 flex-1"
      >
        <div>
          <label className="block text-sm text-gray-600">Login</label>
          <input
            className="w-full h-10 p-2 mt-2 bg-white border border-gray-300 rounded-md"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setError("");
              setEmail(e.target.value);
            }}
            required={true}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Hasło</label>
          <input
            className="w-full h-10 p-2 mt-2 bg-white border border-gray-300 rounded-md"
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setError("");
              setPassword(e.target.value);
            }}
            required={true}
          />
        </div>

        <button type="submit" className="button mt-4">
          Zaloguj się
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </>
  );
}
