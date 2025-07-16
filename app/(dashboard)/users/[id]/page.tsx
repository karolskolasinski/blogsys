import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { ServerComponentProps } from "@/types/common";
import { getUserById, saveUser } from "@/actions/users";
import Breadcrumb from "@/components/Breadcrumb";
import SaveIcon from "@/public/icons/save.svg";

export default async function Users(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const params = await props.params;
  const user = await getUserById(params.id as string);
  const title = user?.name ? "Edycja użytkownika" : "Dodaj użytkownika";

  return (
    <main className="flex w-full h-screen">
      <DashboardMenu active="/users" user={session.user} />

      <section className="flex-1 h-full flex flex-col">
        <Breadcrumb
          items={[
            { label: "Użytkownicy", href: "/users" },
            { label: title, href: `/posts/${user?.id}` },
          ]}
        />

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
              className="w-full text-3xl font-black rounded focus:bg-white"
              defaultValue={user?.name}
              placeholder="Wpisz nazwę"
              maxLength={100}
              required
            />

            <button type="submit" className="button">
              <SaveIcon className="w-5 h-5 fill-white" />
              Zapisz
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-sm text-gray-700">
            <input name="createdAt" type="hidden" value={user?.createdAt?.toISOString()} />
            <div className="h-8 flex items-center">
              Data utworzenia: {user?.createdAt?.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <input
              name="email"
              type="email"
              defaultValue={user?.email}
              maxLength={50}
              className="flex-1 bg-white p-2 border border-gray-300 rounded shadow"
              placeholder="Wpisz email"
              required
            />

            <select
              name="role"
              defaultValue={user?.role}
              className="flex-1 bg-white p-2 border border-gray-300 rounded shadow"
            >
              <option value="user">Użytkownik</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </form>
      </section>
    </main>
  );
}
