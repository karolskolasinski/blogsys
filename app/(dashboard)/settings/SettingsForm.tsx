"use client";

import { saveUser } from "@/actions/users";
import Button from "@/components/blogsys/Button";
import SaveIcon from "@/public/icons/blogsys/save.svg";
import AvatarInput from "@/app/(dashboard)/settings/AvatarInput";
import ResetPass from "@/app/(dashboard)/users/[id]/ResetPass";
import { User } from "@/types/common";
import { useActionState } from "react";
import Toast from "@/components/blogsys/Toast";
import { initialActionState } from "@/lib/utils";

type SettingsFormProps = {
  user?: User;
  avatar?: string;
};

export default function SettingsForm(props: SettingsFormProps) {
  const { user, avatar } = props;
  const [state, formAction] = useActionState(saveUser, initialActionState);

  return (
    <div className="flex-1 bg-slate-50">
      <Toast success={state.success} messages={state.messages} />
      <form
        action={formAction}
        className="px-4 pt-8 flex flex-col gap-2 border-t border-gray-200"
      >
        <input type="hidden" name="id" defaultValue={user?.id} />

        <div className="flex justify-between items-center gap-4">
          <div className="text-3xl font-black">Ustawienia</div>

          <Button
            href=""
            appearance="button"
            label="Zapisz"
            icon={<SaveIcon className="w-5 h-5 fill-white" />}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-sm text-gray-700">
          <input name="createdAt" type="hidden" value={user?.createdAt?.toISOString()} />
          <div className="h-8 flex items-center">
            Data utworzenia konta: {user?.createdAt?.toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-2 text-gray-700">
          <input
            name="name"
            className="flex-1 bg-white p-2 border border-gray-300 rounded-lg shadow"
            defaultValue={user?.name}
            placeholder="Wpisz nazwę"
            maxLength={100}
            required
          />

          <input
            name="email"
            type="email"
            defaultValue={user?.email}
            maxLength={50}
            className="flex-1 bg-white p-2 border border-gray-300 rounded-lg shadow"
            placeholder="Wpisz email"
            required
          />
        </div>

        <div className="pb-4 flex flex-col gap-2">
          <AvatarInput data={avatar} />
        </div>

        <ResetPass />
      </form>
    </div>
  );
}
