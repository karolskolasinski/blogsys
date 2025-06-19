"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FirebaseError } from "@firebase/app";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        const res = await fetch("/api/auth/verify-session");
        if (!res.ok) {
          await signOut(auth);
        }
      } catch (err) {
        console.error(err);
        await signOut(auth);
      }

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
      const user = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        setError(`Wystąpił błąd logowania.`);
      }

      router.push("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "nieznany błąd";
      setError(`Wystąpił błąd logowania (${code}).`);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-1" />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main>
        <form onSubmit={handleSubmit} className="flex flex-col w-96 mx-auto mt-44 gap-4">
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
              required
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
              required
            />
          </div>

          <button type="submit" className="button mt-4">
            Zaloguj się
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </main>

      <Footer />
    </>
  );
}
