"use client";

import DeleteIcon from "@/public/icons/delete.svg";

type DeleteButtonProps = {
  label: string;
};

export default function DeleteButton(props: DeleteButtonProps) {
  return (
    <button
      onClick={(e) => {
        if (!confirm(props.label)) {
          e.preventDefault();
        }
      }}
      type="submit"
      className="flex gap-1 items-center text-red-600 hover:text-red-500 cursor-pointer"
    >
      <DeleteIcon className="w-4 h-4 fill-current" />
      Usuń
    </button>
  );
}
