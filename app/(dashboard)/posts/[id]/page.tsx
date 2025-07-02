import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import MarkdownEditor from "@/components/MarkdownEditor";

export default async function Posts() {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  return (
    <main className="flex w-full text-sm h-screen">
      <DashboardMenu />

      <section className="p-4 flex-1 flex flex-col">
        <MarkdownEditor />
      </section>
    </main>
  );
}
