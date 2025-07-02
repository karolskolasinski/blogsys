import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";

export default async function Posts() {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  return (
    <main className="flex-1 flex w-full text-sm">
      <DashboardMenu />

      <section className="p-4 flex-1">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Nowy wpis</h1>
        </div>
      </section>
    </main>
  );
}
