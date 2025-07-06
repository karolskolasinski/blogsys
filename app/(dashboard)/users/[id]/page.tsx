import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { ServerComponentProps } from "@/types/common";
import { getUserById } from "@/actions/users";

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
        {user?.email}
      </section>
    </main>
  );
}
