"use client";
import InfoIcon from "@/public/icons/info.svg";
import DeleteIcon from "@/public/icons/delete.svg";
import { useEffect, useState } from "react";
import Avatar from "@/components/blogsys/Avatar";
import { useFormStatus } from "react-dom";
import SpinnerIcon from "@/public/icons/spinner.svg";

type AvatarInputProps = {
  data: string | null;
};

export default function AvatarInput(props: AvatarInputProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(props.data);
  const [isDeleting, setIsDeleting] = useState(false);
  const { pending } = useFormStatus();

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
    e.target.form?.requestSubmit();
  }

  function handleDelete() {
    setIsDeleting(true);
    setAvatarPreview(null);
  }

  useEffect(() => {
    if (!isDeleting && !pending) {
      setIsDeleting(false);
    }
  }, [pending, isDeleting]);

  return (
    <>
      <h2 className="font-bold text-2xl mt-8">Zmiana avatara</h2>
      <div className="h-8 flex gap-2 items-center text-gray-700 text-sm">
        <InfoIcon className="w-5 h-5 fill-current" />
        Maksymalny rozmiar pliku to 1MB.
      </div>

      <div className="flex gap-4">
        <Avatar src={avatarPreview} />

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

          <button type="submit" onClick={handleDelete} className="button-outline w-full">
            {isDeleting && pending
              ? <SpinnerIcon className="w-5 h-5 fill-current animate-spin" />
              : <DeleteIcon className="w-5 h-5" />}
            Usuń
          </button>
        </div>
      </div>
    </>
  );
}
