import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { ServerComponentProps } from "@/types/common";
import { getUserById, saveUser } from "@/actions/users";
import Breadcrumb from "@/components/Breadcrumb";

export default async function Posts(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const params = await props.params;
  const user = await getUserById(params.id as string);
  const title = user?.name ? "Edycja użytkownika" : "Dodaj użytkownika";

  return (
    <main className="flex w-full h-screen">
      <DashboardMenu active="/users" />

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
          className="h-full flex flex-col"
        >
          <input type="hidden" name="id" defaultValue={user?.id} />

          <div className="flex flex-col gap-2">
            <label htmlFor="name">Imię</label>
            <input
              className="input"
              type="text"
              name="name"
              id="name"
              defaultValue={user.name}
              required
            />
          </div>

          <button type="submit" className="button w-fit">Opublikuj</button>

          <input name="createdAt" type="hidden" value={user.createdAt?.toISOString()} />
          <div>Data utworzenia: {user.createdAt?.toLocaleString()}</div>
        </form>
      </section>
    </main>
  );
}
