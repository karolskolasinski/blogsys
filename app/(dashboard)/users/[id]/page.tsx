import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/blogsys/DashboardMenu";
import { ServerComponentProps } from "@/types/common";
import { getUserById, saveUser } from "@/actions/users";
import Breadcrumb from "@/components/blogsys/Breadcrumb";
import SaveIcon from "@/public/icons/save.svg";
import ArrowIcon from "@/public/icons/chevron-right.svg";
import Button from "@/components/blogsys/Button";
import ResetPass from "./ResetPass";
import HamburgerMenu from "@/components/blogsys/HamburgerMenu";

export default async function User(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const params = await props.params;
  const user = await getUserById(params.id as string);
  const title = user?.name ? "Edycja użytkownika" : "Dodaj użytkownika";
  const selectedRole = user?.role || "user";

  return (
    <main className="flex w-full h-screen">
      <DashboardMenu active="/users" />

      <section className="flex-1 h-full flex flex-col">
        <div className="flex gap-2 justify-between items-center max-w-screen">
          <Breadcrumb
            items={[{ label: "Użytkownicy", href: "/users" }, {
              label: title,
              href: `/posts/${user?.id}`,
            }]}
          />
          <HamburgerMenu active="/users" />
        </div>

        <form
          action={async (formData) => {
            "use server";
            await saveUser(formData);
          }}
          className="h-full px-4 pt-8 flex flex-col gap-2 bg-slate-50 border-t border-gray-200"
        >
          <input type="hidden" name="id" defaultValue={user?.id} />

          <div className="flex justify-between items-center gap-4">
            <input
              name="name"
              className="w-full text-3xl font-black rounded-lg focus:bg-white"
              defaultValue={user?.name}
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
            <input name="createdAt" type="hidden" value={user?.createdAt?.toISOString()} />
            <div className="h-8 flex items-center">
              Data utworzenia: {user?.createdAt?.toLocaleString()}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-2 text-gray-700">
            <input
              name="email"
              type="email"
              defaultValue={user?.email}
              maxLength={50}
              className="flex-1 bg-white p-2 border border-gray-300 rounded-lg shadow"
              placeholder="Wpisz email"
              required
            />

            <div className="relative inline-block flex-1">
              <select
                id="role"
                name="role"
                defaultValue={selectedRole}
                className="w-full bg-white p-2 border border-gray-300 rounded-lg shadow appearance-none"
              >
                <option disabled>Rola</option>
                <option value="user">Użytkownik</option>
                <option value="admin">Administrator</option>
              </select>
              <ArrowIcon className="w-5 h-5 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform rotate-90" />
            </div>
          </div>

          <ResetPass />
        </form>
      </section>
    </main>
  );
}
