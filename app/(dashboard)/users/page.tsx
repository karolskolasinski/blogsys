import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";

export default async function Users() {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  return (
    <main className="flex-1 flex w-full">
      <DashboardMenu />

      Users
    </main>
  );
}
