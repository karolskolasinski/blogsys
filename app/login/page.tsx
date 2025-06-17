"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", { redirect: false, email, password });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      alert("Błędne dane logowania");
    }
  };

  return (
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
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />
      </div>

      <button type="submit" className="button mt-4">
        Zaloguj się
      </button>
    </form>
  );
}
