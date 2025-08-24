"use client";

import { saveUser } from "@/actions/users";
import Button from "@/components/blogsys/Button";
import SaveIcon from "@/public/icons/blogsys/save.svg";
import ChevronIcon from "@/public/icons/blogsys/chevron-right.svg";
import ResetPass from "@/app/(dashboard)/users/[id]/ResetPass";
import { User } from "@/types/common";
import { useActionState, useEffect } from "react";
import Toast from "@/components/blogsys/Toast";
import { redirect } from "next/navigation";

type SaveUserProps = {
  user?: User;
};

export function SaveUser(props: SaveUserProps) {
  const initialState = {
    success: false,
    messages: [],
    data: props.user,
  };
  const [state, formAction] = useActionState(saveUser, initialState);

  useEffect(() => {
    if (state.success) {
      redirect("/users");
    }
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="h-full px-4 pt-8 flex flex-col gap-2 bg-slate-50 border-t border-gray-200"
    >
      <Toast success={state.success} messages={state.messages} />
      <input type="hidden" name="id" defaultValue={state.data?.id ?? "new"} />

      <div className="flex justify-between items-center gap-4">
        <input
          name="name"
          className="w-full text-3xl font-black rounded-lg focus:bg-white"
          defaultValue={state.data?.name}
          placeholder="Wpisz nazwę"
          maxLength={100}
          required
        />

        <Button
          href=""
          appearance="button"
          label="Zapisz"
          icon={<SaveIcon className="w-5 h-5 fill-white" />}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap text-sm text-gray-700">
        <input name="createdAt" type="hidden" value={state.data?.createdAt?.toISOString()} />
        <div className="h-8 flex items-center">
          Data utworzenia: {state.data?.createdAt?.toLocaleString()}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-2 text-gray-700">
        <input
          name="email"
          type="email"
          defaultValue={state.data?.email}
          maxLength={50}
          className="flex-1 bg-white p-2 border border-gray-300 rounded-lg shadow"
          placeholder="Wpisz email"
          required
        />

        <div className="relative inline-block flex-1">
          <select
            id="role"
            name="role"
            defaultValue={state.data?.role ?? "user"}
            className="w-full bg-white p-2 border border-gray-300 rounded-lg shadow appearance-none"
          >
            <option disabled>Rola</option>
            <option value="user">Użytkownik</option>
            <option value="admin">Administrator</option>
          </select>
          <ChevronIcon className="w-5 h-5 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform rotate-90" />
        </div>
      </div>

      <ResetPass resetMode={state.data === undefined} />
    </form>
  );
}
