"use client";

import { init } from "@/actions/users";
import FormFooter from "@/components/blogsys/FormFooter";
import { useActionState, useEffect } from "react";
import { initialActionState } from "@/lib/utils";
import Toast from "@/components/blogsys/Toast";
import { redirect } from "next/navigation";

export default function InitAdminPage() {
  const [state, formAction] = useActionState(init, initialActionState);

  useEffect(() => {
    if (state.success) {
      redirect("/login");
    }
  }, [state.success]);

  return (
    <main className="flex-1">
      <Toast success={state.success} messages={state.messages} />

      <section className="mx-auto max-w-5xl px-4">
        <form action={formAction} className="flex-1 w-full max-w-96 mx-auto">
          <h1 className="text-3xl font-bold mb-8 mt-20 text-center">
            Tworzenie konta startowego
          </h1>

          <div className="h-72">
            <label className="block text-sm text-gray-600">Email</label>
            <input
              className="w-full h-10 p-2 mt-2 mb-4 border border-gray-300 rounded-md"
              type="email"
              name="email"
              maxLength={255}
              required
            />

            <label className="block text-sm text-gray-600">Hasło</label>
            <input
              className="w-full h-10 p-2 mt-2 mb-4 border border-gray-300 rounded-md"
              type="password"
              name="password"
              maxLength={255}
              required
            />

            <label className="block text-sm text-gray-600">Klucz autoryzacyjny</label>
            <input
              className="w-full h-10 p-2 mt-2 mb-4 border border-gray-300 rounded-md"
              type="password"
              name="key"
              maxLength={255}
              autoComplete="off"
              required
            />
          </div>

          <div className="flex justify-center">
            <button type="submit" className="button">
              Stwórz konto administratora
            </button>
          </div>

          <FormFooter />
        </form>
      </section>
    </main>
  );
}
