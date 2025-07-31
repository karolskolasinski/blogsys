"use client";

import InfoIcon from "@/public/icons/blogsys/info.svg";
import WarningIcon from "@/public/icons/blogsys/warning.svg";
import { useState } from "react";

export default function ResetPass() {
  const [resetMode, setResetMode] = useState(false);

  return (
    <>
      <h2 className="font-bold text-2xl mt-8">Zmiana hasła</h2>
      <div className="pb-2 lg:h-8 flex gap-2 items-center text-gray-700 text-sm">
        <InfoIcon className="min-w-5 h-5 fill-current" />
        Aby zmienić hasło naciśnij przycisk poniżej, wpisz nowe hasło lub pozostaw wygenerowane
        domyślnie, po czym naciśnij przycisk Zapisz.
      </div>

      {resetMode
        ? (
          <input
            name="password"
            type="text"
            defaultValue={Math.random().toString(36).slice(-8).toUpperCase()}
            maxLength={50}
            className="w-1/2 bg-white p-2 border border-gray-300 rounded-lg shadow"
            placeholder="Wpisz hasło startowe"
          />
        )
        : (
          <button
            className="button w-fit !bg-yellow-400 !border-yellow-500 hover:!border-yellow-400 !text-gray-700"
            onClick={() => setResetMode(true)}
          >
            <WarningIcon className="w-5 h-5" />
            Zmień hasło
          </button>
        )}
    </>
  );
}
