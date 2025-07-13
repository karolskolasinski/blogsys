import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { deleteUser, getUsers } from "@/actions/users";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import AddIcon from "@/public/icons/add.svg";
import EditIcon from "@/public/icons/edit.svg";
import DeleteButton from "@/components/DeleteButton";

export default async function Users() {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  const users = await getUsers();

  return (
    <main className="flex-1 flex w-full">
      <DashboardMenu active="/users" />

      <section className="flex-1 flex flex-col">
        <Breadcrumb items={[{ label: "Użytkownicy", href: "/users" }]} />

        <div className="flex-1 bg-slate-50 p-4 pt-8 border-t border-gray-200">
          <div className="flex gap-4 items-center justify-between">
            <h1 className="text-3xl font-black">Użytkownicy</h1>

            <Link
              href="/users/new"
              className="button !rounded-full md:!rounded-md"
            >
              <AddIcon className="w-5 h-5 fill-white" />
              <span className="hidden md:inline">Dodaj nowego</span>
            </Link>
          </div>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-gray-200 shadow">
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
                {users.map((user) => {
                  if (!user) {
                    return null;
                  }
                  const adminClass = user.role === "admin" ? "text-red-600" : "";

                  return (
                    <tr key={user.id} className="group align-top">
                      <td className="px-6 py-4">
                        {user.name}
                        <div className="mt-2 flex gap-2 xl:opacity-0 group-hover:opacity-100 text-sm">
                          <Link
                            href={`/users/${user.id}`}
                            className="flex gap-1 items-center text-sky-600 hover:text-sky-500 duration-100"
                          >
                            <EditIcon className="w-4 h-4 fill-current" />
                            Edytuj
                          </Link>

                          <span className="text-gray-400">|</span>

                          <form
                            action={async () => {
                              "use server";
                              await deleteUser(user.id!);
                            }}
                          >
                            <DeleteButton label="Czy na pewno chcesz usunąć tego użytkownika?" />
                          </form>
                        </div>
                      </td>

                      <td className="px-6 py-4">{user.email}</td>
                      <td className={`px-6 py-4 ${adminClass}`}>{user.role}</td>
                      <td className="px-6 py-4">{user.createdAt?.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
