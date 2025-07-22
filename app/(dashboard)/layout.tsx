import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import { getAvatar } from "@/actions/users";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  let avatar;
  try {
    avatar = await getAvatar(session.user.avatarId ?? "");
  } catch (err) {
    console.error(err);
    return children;
  }

  return (
    <UserProvider user={session.user} avatar={avatar?.data ?? ""}>
      {children}
    </UserProvider>
  );
}
