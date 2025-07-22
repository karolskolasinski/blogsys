import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/blogsys/DashboardMenu";
import { deleteUser, getUsers } from "@/actions/users";
import Breadcrumb from "@/components/blogsys/Breadcrumb";
import AddIcon from "@/public/icons/add.svg";
import EditIcon from "@/public/icons/edit.svg";
import Button from "@/components/blogsys/Button";
import DeleteIcon from "@/public/icons/delete.svg";

export default async function Users() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return redirect("/login");
  }

  let users;
  let errMsg = "";
  try {
    users = await getUsers();
  } catch (err) {
    console.error(err);
    errMsg = err instanceof Error ? err.message : "Coś poszło nie tak";
  }

  return (
    <main className="flex-1 flex w-full">
      <DashboardMenu active="/users" />

      <section className="flex-1 flex flex-col">
        <Breadcrumb items={[{ label: "Użytkownicy", href: "/users" }]} />

        <div className="flex-1 bg-slate-50 p-4 pt-8 border-t border-gray-200">
          <div className="flex gap-4 items-center justify-between">
            <h1 className="text-3xl font-black">Użytkownicy</h1>

            <Button
              href="/users/new"
              appearance="button"
              label="Dodaj nowego"
              icon={<AddIcon className="w-5 h-5 fill-white" />}
            />
          </div>

          {errMsg.length > 0
            ? <div className="h-40 flex items-center justify-center text-red-500">{errMsg}</div>
            : (
              <div className="mt-10 overflow-x-auto rounded-xl border border-gray-200 shadow">
                <table className="table-auto min-w-full divide-y divide-gray-200 bg-white border-collapse">
                  <thead className="border-b border-b-gray-300 font-semibold">
                    <tr className="text-left text-xs uppercase">
                      <th className="px-6 py-3">Nazwa</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Rola</th>
                      <th className="px-6 py-3">Data utworzenia</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {users?.map((user) => {
                      if (!user) {
                        return null;
                      }
                      const adminClass = user.role === "admin" ? "text-red-600" : "";

                      return (
                        <tr key={user.id} className="align-top">
                          <td className="px-6 py-4">
                            {user.name}
                            <div className="mt-2 flex gap-2 text-sm">
                              <Button
                                href={`/users/${user.id}`}
                                appearance="link"
                                label="Edytuj"
                                icon={<EditIcon className="w-4 h-4 fill-current" />}
                                colorClass="text-sky-600 hover:text-sky-500"
                              />

                              <span className="text-gray-400">|</span>

                              <form
                                action={async () => {
                                  "use server";
                                  await deleteUser(user.id!);
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

                          <td className="px-6 py-4">{user.email}</td>
                          <td className={`px-6 py-4 ${adminClass}`}>
                            {user.role === "admin" ? "Administrator" : "Użytkownik"}
                          </td>
                          <td className="px-6 py-4">{user.createdAt?.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </section>
    </main>
  );
}
