"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error }: ErrorProps) {
  useEffect(() => console.error(error), [error]);

  return (
    <section className="flex items-center flex-1 h-full w-full max-w-7xl mx-auto py-4 px-2">
      <div className="text-red-500">
        <strong>Błąd:</strong> <span>{error.name}</span>
      </div>
    </section>
  );
}
