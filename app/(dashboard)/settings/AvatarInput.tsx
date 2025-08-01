"use client";

import { useState } from "react";
import Avatar from "@/components/blogsys/Avatar";
import DeleteIcon from "@/public/icons/blogsys/delete.svg";
import InfoIcon from "@/public/icons/blogsys/info.svg";

type AvatarInputProps = {
  data?: string;
};

export default function AvatarInput(props: AvatarInputProps) {
  const [avatarPreview, setAvatarPreview] = useState(props.data);
  const [avatarChanged, setAvatarChanged] = useState(false);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
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
    setAvatarPreview(url);
    setAvatarChanged(true);
  }

  function handleDelete() {
    setAvatarPreview(undefined);
    setAvatarChanged(true);
  }

  return (
    <>
      <h2 className="font-bold text-2xl mt-8">Zmiana avatara</h2>
      <div className="h-8 flex gap-2 items-center text-gray-700 text-sm">
        <InfoIcon className="w-5 h-5 fill-current" />
        Maksymalny rozmiar pliku to 1MB.
      </div>

      <div className="flex gap-4">
        <Avatar src={avatarPreview} className="w-36 h-36" />

        <div className="flex flex-col gap-4 justify-center items-center">
          <label htmlFor="avatar" className="button">
            Wybierz plik
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/jpeg, image/png, image/gif, image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>

          <button
            type="button"
            onClick={handleDelete}
            className="button-outline w-full"
          >
            <DeleteIcon className="w-5 h-5" />
            Usuń
          </button>
        </div>
      </div>

      <input type="hidden" name="avatarChanged" value={avatarChanged ? "true" : "false"} />
    </>
  );
}
