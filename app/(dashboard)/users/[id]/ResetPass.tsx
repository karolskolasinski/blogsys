"use client";

import InfoIcon from "@/public/icons/info.svg";
import WarningIcon from "@/public/icons/warning.svg";
import { useState } from "react";

export default function ResetPass() {
  const [resetMode, setResetMode] = useState(false);

  return (
    <>
      <h2 className="font-bold text-2xl mt-8">Reset hasła</h2>
      <div className="h-8 flex gap-2 items-center text-gray-700 text-sm">
        <InfoIcon className="w-5 h-5 fill-current" />
        Aby zresetować hasło naciśnij przycisk, wpisz nowe hasło lub pozostaw wygenerowane
        domyślnie, po czym zapisz użytkownika.
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
            Resetuj
          </button>
        )}
    </>
  );
}
