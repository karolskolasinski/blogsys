"use client";

import Image from "next/image";

export default function LogoutButton() {
  return (
    <button onClick={() => console.log("logout")} className="button">
      <Image
        src="/off.svg"
        alt="logout"
        width={24}
        height={24}
      />

      Wyloguj się
    </button>
  );
}
