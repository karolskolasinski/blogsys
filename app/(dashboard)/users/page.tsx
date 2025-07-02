import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { db } from "@/lib/db";
import { User } from "@/types/common";
import _ from "lodash";

export default async function Users() {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  const snapshot = await db.collection("users").get();
  const users: User[] = snapshot.docs.map((doc) => ({
    ..._.omit(doc.data(), "password") as User,
    id: doc.id,
  }));

  return (
    <main className="flex-1 flex w-full text-sm">
      <DashboardMenu />

      <section className="p-4 flex-1">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Użytkownicy</h1>

          <button className="button !bg-transparent !p-1 !py-1.5 !h-fit !font-normal">
            Dodaj użytkownika
          </button>
        </div>

        <div className="pt-10 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="border-b border-b-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase">Imię</th>
                <th className="px-6 py-3 text-left text-xs uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs uppercase">Rola</th>
                <th className="px-6 py-3 text-left text-xs uppercase">Data utworzenia</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const adminClass = user.role === "admin" ? "text-red-600" : "";
                return (
                  <tr key={user.id} className="group odd:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      {user.name}
                      <div className="mt-1 flex gap-2 opacity-0 group-hover:opacity-100">
                        <button className="text-primary-600">Edytuj</button>
                        <span className="text-gray-400">|</span>
                        <button className="text-red-600">Usuń</button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">{user.email}</td>
                    <td className={`px-6 py-4 whitespace-nowrap align-top ${adminClass}`}>
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">{user.createdAt}</td>
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
