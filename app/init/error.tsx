"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => console.error(error), [error]);

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-4">
        <div className="flex-1 w-full lg:w-5/12 mx-auto">
          <h1 className="text-3xl font-bold mb-8 mt-16 text-center">
            Błąd tworzenia konta startowego
          </h1>

          <div className="h-64 flex justify-center items-center text-red-500">
            {error.message}
          </div>

          <div className="flex justify-center">
            <button onClick={() => reset()} className="button mt-4">
              Spróbuj ponownie
            </button>
          </div>

          <hr className="my-6 border-gray-300" />

          <div className="text-center text-sm flex flex-col gap-4 text-gray-700">
            <div>
              Masz już konto?{" "}
              <Link href="/login" className="text-center mt-4 hover:text-black">
                Zaloguj się!
              </Link>
            </div>

            <Link href="/" className="text-center text-sm hover:text-black">
              Wróć na stronę główną
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
