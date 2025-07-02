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
        <h1 className="text-2xl font-bold">Użytkownicy</h1>

        <div className="pt-10 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Imię</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Rola</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const adminClass = user.role === "admin" ? "text-red-600" : "";
                return (
                  <tr key={user.id} className="group">
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
