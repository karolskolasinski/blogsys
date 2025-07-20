"use client";

import InfoIcon from "@/public/icons/info.svg";

export default function AvatarInput() {
  return (
    <>
      <h2 className="font-bold text-2xl mt-8">Zmiana avatara</h2>
      <div className="h-8 flex gap-2 items-center text-gray-700 text-sm">
        <InfoIcon className="w-5 h-5 fill-current" />
        Maksymalny rozmiar pliku to 1MB.
      </div>
    </>
  );
}
