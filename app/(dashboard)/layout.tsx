import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import { getAvatar, getUserById } from "@/actions/users";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userRes = await getUserById(session.user.id ?? "");
  const user = userRes.data;
  const avatar = await getAvatar(session.user.avatarId ?? "");

  return (
    <UserProvider user={user} avatar={avatar?.data ?? ""}>
      {children}
    </UserProvider>
  );
}
