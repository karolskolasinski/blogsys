import PhotoIcon from "@/public/icons/blogsys/photo.svg";
import { useState } from "react";

type CoverProps = {
  cover?: string;
};

export function Cover(props: CoverProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(props.cover ?? null);

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
    <div className="flex gap-2 items-center">
      <label
        htmlFor="cover"
        className="button !border-gray-300 flex-1 whitespace-nowrap overflow-hidden text-shadow-md bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: coverPreview ? `url(${coverPreview})` : undefined,
        }}
      >
        <div className="flex gap-2 p-1 rounded bg-gray-800">
          <PhotoIcon className="w-5 h-5 fill-white" />
          {coverPreview ? "Zmień okładkę" : "Dodaj okładkę"}
        </div>
        <input
          id="cover"
          name="cover"
          type="file"
          accept="image/jpeg, image/png, image/gif, image/webp"
          className="hidden"
          onChange={handleCoverChange}
        />
      </label>
    </div>
  );
}
