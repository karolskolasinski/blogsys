"use client";

import { useEffect } from "react";
import FormFooter from "@/components/blogsys/FormFooter";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error(props: ErrorProps) {
  const { error, reset } = props;
  useEffect(() => console.error(error), [error]);

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-4">
        <div className="flex-1 w-full max-w-96 mx-auto">
          <h1 className="text-3xl font-bold mb-8 mt-16 text-center">
            Błąd tworzenia konta startowego
          </h1>

          <div className="h-72 flex justify-center items-center text-red-500">
            {error.message}
          </div>

          <div className="flex justify-center">
            <button onClick={() => reset()} className="button">
              Spróbuj ponownie
            </button>
          </div>

          <FormFooter />
        </div>
      </section>
    </main>
  );
}
