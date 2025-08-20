"use client";

import { useActionState, useEffect } from "react";
import { deleteUser } from "@/actions/users";
import Button from "@/components/blogsys/Button";
import DeleteIcon from "@/public/icons/blogsys/delete.svg";
import { User } from "@/types/common";
import { initialActionState } from "@/lib/utils";
import Toast from "@/components/blogsys/Toast";
import { useRouter } from "next/navigation";

type DeleteUserProps = {
  user: User;
};

export function DeleteUser(props: DeleteUserProps) {
  const { user } = props;
  const [state, formAction] = useActionState(deleteUser, initialActionState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="inline">
      <Toast success={state.success} messages={state.messages} />
      <input type="hidden" name="id" value={user.id} />

      <Button
        href="delete"
        appearance="link"
        label="Usuń"
        icon={<DeleteIcon className="w-4 h-4 fill-current" />}
        colorClass="text-red-600 hover:text-red-500"
      />
    </form>
  );
}
