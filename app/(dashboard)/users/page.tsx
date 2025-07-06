import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { deleteUser, getUsers } from "@/actions/users";
import Link from "next/link";

export default async function Users() {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  const users = await getUsers();

  return (
    <main className="flex-1 flex w-full">
      <DashboardMenu active="/users" />

      <section className="p-4 flex-1">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Użytkownicy</h1>

          <Link
            href="/users/new"
            className="button !bg-transparent !p-1 !py-1.5 !h-fit !font-normal"
          >
            Dodaj wpis
          </Link>
        </div>

        <div className="pt-10 overflow-x-auto">
          <table className="table-auto min-w-full divide-y divide-gray-200">
            <thead className="border-b border-b-gray-500 font-semibold">
              <tr className="text-left text-xs uppercase">
                <th className="px-6 py-3">Tytuł</th>
                <th className="px-6 py-3">Autor</th>
                <th className="px-6 py-3">Data utworzenia</th>
                <th className="px-6 py-3">Data aktualizacji</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const adminClass = user.role === "admin" ? "text-red-600" : "";
                return (
                  <tr key={user.id} className="group odd:bg-gray-100 align-top">
                    <td className="px-6 py-4">
                      {user.name}
                      <div className="mt-1 flex gap-2 opacity-0 group-hover:opacity-100">
                        <Link href={`/users/${user.id}`} className="text-primary-600">Edytuj</Link>
                        <span className="text-gray-400">|</span>
                        <form
                          action={async () => {
                            "use server";
                            await deleteUser(user.id!);
                          }}
                        >
                          <button className="text-red-600 cursor-pointer">Usuń</button>
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
      </section>
    </main>
  );
}
