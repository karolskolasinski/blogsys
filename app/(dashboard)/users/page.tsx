import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/blogsys/DashboardMenu";
import { getUsers } from "@/actions/users";
import Breadcrumb from "@/components/blogsys/Breadcrumb";
import AddIcon from "@/public/icons/blogsys/add.svg";
import Button from "@/components/blogsys/Button";
import HamburgerMenu from "@/components/blogsys/HamburgerMenu";
import Toast from "@/components/blogsys/Toast";
import { DeleteUser } from "@/app/(dashboard)/users/DeleteUser";
import { EditUser } from "@/app/(dashboard)/users/EditUser";

export default async function Users() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return redirect("/login");
  }

  const res = await getUsers();
  const users = res?.data;

  return (
    <main className="flex-1 flex w-full">
      <Toast success={res.success} messages={res.messages} />
      <DashboardMenu active="/users" />

      <section className="flex-1 flex flex-col">
        <div className="flex gap-2 justify-between items-center max-w-screen">
          <Breadcrumb items={[{ label: "Użytkownicy", href: "/users" }]} />
          <HamburgerMenu active="/users" />
        </div>

        <div className="flex-1 bg-slate-50 p-4 pt-8 border-t border-gray-200">
          <div className="flex gap-4 items-center justify-between flex-wrap">
            <h1 className="text-3xl font-black">Użytkownicy</h1>

            <Button
              href="/users/new"
              appearance="button"
              label="Dodaj nowego"
              icon={<AddIcon className="w-5 h-5 fill-white" />}
            />
          </div>

          <div className="mt-10 overflow-x-auto rounded-xl border border-gray-200 shadow">
            {/* Mobile/Tablet cards */}
            <div className="lg:hidden bg-white">
              {users?.map((user) => {
                if (!user) {
                  return null;
                }
                const badgeClass = user.role === "admin"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800";

                return (
                  <div key={user.id} className="border-b border-gray-200 p-4 last:border-b-0">
                    <div className="flex flex-col">
                      <div className="flex gap-2 justify-between">
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
                        >
                          {user.role === "admin" ? "Administrator" : "Użytkownik"}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-sm text-gray-500">
                        Utworzony: {user.createdAt?.toLocaleString()}
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm pt-4">
                        <EditUser user={user} />
                        <DeleteUser user={user} />
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
                            <EditUser user={user} />
                            <span className="text-gray-400">|</span>
                            <DeleteUser user={user} />
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
          </div>
        </div>
      </section>
    </main>
  );
}
