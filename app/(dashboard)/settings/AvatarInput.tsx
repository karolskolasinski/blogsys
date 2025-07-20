"use client";

import InfoIcon from "@/public/icons/info.svg";
import PhotoIcon from "@/public/icons/photo.svg";
import { useState } from "react";

export default function AvatarInput() {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 1024 * 1024) {
      alert("Plik jest za duży! Maksymalny rozmiar to 1MB.");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Wybierz plik obrazu!");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  }

  return (
    <>
      <h2 className="font-bold text-2xl mt-8">Zmiana avatara</h2>
      <div className="h-8 flex gap-2 items-center text-gray-700 text-sm">
        <InfoIcon className="w-5 h-5 fill-current" />
        Maksymalny rozmiar pliku to 1MB.
      </div>

      <label
        htmlFor="cover"
        className="w-36 h-36 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: coverPreview ? `url(${coverPreview})` : undefined,
          borderColor: "transparent",
        }}
        title="Zmień avatar"
      >
        {!coverPreview && <PhotoIcon className="w-10 h-10 fill-white" />}

        <input
          id="cover"
          name="cover"
          type="file"
          accept="image/jpeg, image/png, image/gif, image/webp"
          className="hidden"
          onChange={handleCoverChange}
        />
      </label>
    </>
  );
}
