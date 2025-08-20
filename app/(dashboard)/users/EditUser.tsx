"use client";

import Button from "@/components/blogsys/Button";
import { User } from "@/types/common";
import EditIcon from "@/public/icons/blogsys/edit.svg";

type EditUserProps = {
  user: User;
};

export function EditUser(props: EditUserProps) {
  const { user } = props;

  return (
    <Button
      href={`/users/${user.id}`}
      appearance="link"
      label="Edytuj"
      icon={<EditIcon className="w-4 h-4 fill-current" />}
      colorClass="text-sky-600 hover:text-sky-500"
    />
  );
}
