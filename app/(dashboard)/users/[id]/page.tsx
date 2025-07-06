import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { ServerComponentProps } from "@/types/common";
import { getUserById, saveUser } from "@/actions/users";

export default async function Posts(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const params = await props.params;
  const user = await getUserById(params.id as string);

  return (
    <main className="flex w-full text-sm h-screen">
      <DashboardMenu active="/users" />

      <section className="p-4 flex-1 flex flex-col">
        <form
          action={async (formData) => {
            "use server";
            await saveUser(formData);
          }}
          className="h-full flex flex-col"
        >
          <input type="hidden" name="id" defaultValue={user.id} />

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
