"use client";

import { useActionState } from "react";
import { initialActionState } from "@/lib/utils";
import FormFooter from "@/components/blogsys/FormFooter";
import Toast from "@/components/blogsys/Toast";
import { login } from "@/actions/users";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, initialActionState);

  return (
    <form action={formAction} className="flex-1 w-full max-w-96 mx-auto">
      <Toast success={state?.success ?? false} messages={state?.messages ?? []} />
      <h1 className="text-3xl font-bold mb-8 mt-20 text-center">Logowanie</h1>

      <div className="h-44">
        <label className="block text-sm text-gray-600">Login</label>
        <input
          className="w-full h-10 p-2 mt-2 mb-4 border border-gray-300 rounded-md"
          name="email"
          type="email"
          required
        />

        <label className="block text-sm text-gray-600">Hasło</label>
        <input
          className="w-full h-10 p-2 mt-2 mb-4 border border-gray-300 rounded-md"
          name="password"
          type="password"
          required
        />
      </div>

      <div className="flex justify-center">
        <button type="submit" className="button">Zaloguj się</button>
      </div>

      <FormFooter showLoginLink={false} />
    </form>
  );
}
