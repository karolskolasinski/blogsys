"use client";

import SaveIcon from "@/public/icons/save.svg";
import Button from "@/components/blogsys/Button";
import { Account } from "@/types/common";
import LidlIcon from "@/public/lidl.svg";
import InfoIcon from "@/public/icons/info.svg";
import { saveAccount } from "@/actions/accounts";

type AccountFormProps = {
  account: Account;
};

export default function AccountForm(props: AccountFormProps) {
  const account = props.account;

  return (
    <form
      action={async (formData) => await saveAccount(formData)}
      className="px-4 pt-8 flex-1 flex flex-col gap-2 bg-slate-50 border-t border-gray-200"
    >
      <input type="hidden" name="id" defaultValue={account.id} />
      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-2 items-center text-3xl font-black">
          Konto
          <LidlIcon className="w-10 h-10" />
        </div>

        <Button
          href=""
          appearance="button"
          label="Zapisz"
          icon={<SaveIcon className="w-5 h-5 fill-white" />}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap text-sm text-gray-700">
        <input name="createdAt" type="hidden" value={account.createdAt?.toISOString()} />
        <div className="h-8 flex items-center">
          Data utworzenia: {account.createdAt?.toLocaleString()}
        </div>
        <span className="text-gray-300 font-black">•</span>
        <div className="h-8 flex items-center">
          Ostatnio edytowany: {account.updatedAt?.toLocaleString()}
        </div>
      </div>

      <div className="h-8 flex gap-2 items-center text-gray-700 text-sm">
        <InfoIcon className="w-5 h-5 fill-current" />
        Hasła zostaną zaszyfrowane w bazie danych. W trybie edycji widzisz zaszyfrowane hasło.
      </div>

      <div className="flex items-center gap-2 text-gray-700">
        <input
          name="login"
          defaultValue={account?.login}
          maxLength={50}
          className="flex-1 bg-white p-2 border border-gray-300 rounded-lg shadow"
          placeholder="Wpisz login"
          required
        />

        <input
          name="password"
          defaultValue={account?.password}
          maxLength={50}
          className="flex-1 bg-white p-2 border border-gray-300 rounded-lg shadow"
          placeholder="Wpisz hasło"
          required
          autoComplete="off"
        />
      </div>
    </form>
  );
}
