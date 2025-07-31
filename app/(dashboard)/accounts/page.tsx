import DashboardMenu from "@/components/blogsys/DashboardMenu";
import Breadcrumb from "@/components/blogsys/Breadcrumb";
import Button from "@/components/blogsys/Button";
import EditIcon from "@/public/icons/edit.svg";
import DeleteIcon from "@/public/icons/delete.svg";
import AddIcon from "@/public/icons/add.svg";
import { deleteAccount, getAccounts } from "@/actions/accounts";
import ErrorMsg from "@/components/blogsys/ErrorMsg";
import CouponActivationProgress from "@/app/(dashboard)/accounts/CouponActivationProgress";
import HamburgerMenu from "@/components/blogsys/HamburgerMenu";

export default async function Accounts() {
  let accounts;
  let errMsg = "";
  try {
    accounts = await getAccounts();
  } catch (err) {
    console.error(err);
    errMsg = err instanceof Error ? err.message : "Coś poszło nie tak";
  }

  return (
    <main className="flex-1 flex w-full">
      <DashboardMenu active="/accounts" />

      <section className="flex-1 flex flex-col">
        <div className="flex gap-2 justify-between items-center">
          <Breadcrumb items={[{ label: "Konta", href: "/accounts" }]} />
          <HamburgerMenu active="/accounts" />
        </div>

        <div className="flex-1 bg-slate-50 p-4 pt-8 border-t border-gray-200">
          <div className="flex gap-4 items-center justify-between flex-wrap">
            <h1 className="text-3xl font-black">Konta</h1>

            <div className="flex gap-4">
              <Button
                href="/accounts/new"
                appearance="button"
                label="Dodaj konto"
                icon={<AddIcon className="w-5 h-5 fill-white" />}
              />
            </div>
          </div>

          {errMsg.length > 0
            ? <ErrorMsg errMsg={errMsg} />
            : (
              <div className="mt-10 overflow-x-auto rounded-xl border border-gray-200 shadow">
                {/* Mobile/Tablet cards */}
                <div className="lg:hidden bg-white">
                  {accounts?.map((account) => {
                    if (!account) {
                      return null;
                    }

                    return (
                      <div
                        key={account.id}
                        className="border-b border-gray-200 p-4 last:border-b-0"
                      >
                        <div className="flex flex-col">
                          <h3 className="font-medium text-gray-900">{account.login}</h3>
                          <div className="text-sm text-gray-500 break-all">
                            Hasło (zaszyfrowane): {account.password}
                          </div>
                          <div className="text-sm text-gray-500">
                            Utworzony: {account.createdAt?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Zaktualizowany: {account.updatedAt?.toLocaleString()}
                          </div>

                          <div className="flex flex-wrap gap-3 text-sm pt-4">
                            <Button
                              href={`/accounts/${account.id}`}
                              appearance="link"
                              label="Edytuj"
                              icon={<EditIcon className="w-4 h-4 fill-current" />}
                              colorClass="text-sky-600 hover:text-sky-500"
                            />
                            <form
                              action={async () => {
                                "use server";
                                await deleteAccount(account.id!);
                              }}
                              className="inline"
                            >
                              <Button
                                href="delete"
                                appearance="link"
                                label="Usuń"
                                icon={<DeleteIcon className="w-4 h-4 fill-current" />}
                                colorClass="text-red-600 hover:text-red-500"
                              />
                            </form>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop table */}
                <div className="hidden lg:block">
                  <table className="table-auto min-w-full divide-y divide-gray-200 bg-white border-collapse">
                    <thead className="border-b border-b-gray-300 font-semibold">
                      <tr className="text-left text-xs uppercase">
                        <th className="px-6 py-3">Login</th>
                        <th className="px-6 py-3">Hasło (zaszyfrowane)</th>
                        <th className="px-6 py-3">Data utworzenia</th>
                        <th className="px-6 py-3">Data aktualizacji</th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {accounts?.map((account) => (
                        <tr key={account.id} className="align-top">
                          <td className="px-6 py-4">
                            {account.login}
                            <div className="mt-2 flex gap-2 text-sm">
                              <Button
                                href={`/accounts/${account.id}`}
                                appearance="link"
                                label="Edytuj"
                                icon={<EditIcon className="w-4 h-4 fill-current" />}
                                colorClass="text-sky-600 hover:text-sky-500"
                              />
                              <span className="text-gray-400">|</span>
                              <form
                                action={async () => {
                                  "use server";
                                  await deleteAccount(account.id!);
                                }}
                              >
                                <Button
                                  href="delete"
                                  appearance="link"
                                  label="Usuń"
                                  icon={<DeleteIcon className="w-4 h-4 fill-current" />}
                                  colorClass="text-red-600 hover:text-red-500"
                                />
                              </form>
                            </div>
                          </td>

                          <td className="px-6 py-4 break-all">{account.password}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {account.createdAt?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {account.updatedAt?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          <CouponActivationProgress />
        </div>
      </section>
    </main>
  );
}
