import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import { getAvatar, getUserById } from "@/actions/users";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  let user;
  let avatar;
  try {
    user = await getUserById(session.user.id ?? "");
    avatar = await getAvatar(session.user.avatarId ?? "");
  } catch (err) {
    console.error(err);
    return children;
  }

  return (
    <UserProvider user={user!} avatar={avatar?.data ?? ""}>
      {children}
    </UserProvider>
  );
}
