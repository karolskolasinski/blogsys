"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InitAdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch("/api/init", {  // todo: server action instead of fetch
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, key }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setMessage(data.error || "Wystąpił nieznany błąd.");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Wystąpił nieznany błąd.");
    }
  };

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-4">
        <h1 className="text-3xl font-bold mb-4 mt-16 w-full">Tworzenie konta startowego</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full lg:w-1/2 gap-4"
        >
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              className="w-full h-10 p-2 mt-2 bg-white border border-gray-300 rounded-md"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Hasło</label>
            <input
              className="w-full h-10 p-2 mt-2 bg-white border border-gray-300 rounded-md"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Klucz autoryzacyjny</label>
            <input
              className="w-full h-10 p-2 mt-2 bg-white border border-gray-300 rounded-md"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="button mt-4">
            Stwórz konto administratora
          </button>

          {status === "success" && (
            <div className="mt-4 text-green-600">
              Konto administratora zostało utworzone.
              <button
                className="block mt-2 text-blue-600 underline"
                onClick={() => router.push("/login")}
              >
                Przejdź do logowania
              </button>
            </div>
          )}

          {status === "error" && <div className="mt-4 text-red-600">Błąd: {message}</div>}
        </form>
      </section>
    </main>
  );
}
