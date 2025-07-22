import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <UserProvider user={user}>
      {children}
    </UserProvider>
  );
}
