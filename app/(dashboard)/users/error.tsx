"use client";

import { useEffect } from "react";
import DashboardMenu from "@/components/DashboardMenu";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error(props: ErrorProps) {
  const { error, reset } = props;
  useEffect(() => console.error(error), [error]);

  return (
    <main className="flex-1">
      <DashboardMenu active="/posts" />

      <div className="h-72 flex justify-center items-center text-red-500">
        {error.message}
      </div>

      <div className="flex justify-center">
        <button onClick={() => reset()} className="button">
          Spróbuj ponownie
        </button>
      </div>
    </main>
  );
}
