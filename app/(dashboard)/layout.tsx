import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StoreProvider from "@/app/(dashboard)/StoreProvider";
import { getAvatar, getUserById } from "@/actions/users";
import _ from "lodash";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout(props: Readonly<DashboardLayoutProps>) {
  const { children } = props;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userRes = await getUserById(session.user.id ?? "");
  const userData = userRes.data;
  const user = _.omit(userData, ["createdAt"]);

  const avatarRes = await getAvatar(session.user.avatarId ?? "");
  const avatar = avatarRes.data;

  return (
    <StoreProvider user={user} avatar={avatar}>
      {children}
    </StoreProvider>
  );
}
