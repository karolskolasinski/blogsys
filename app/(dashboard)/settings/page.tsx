import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/blogsys/DashboardMenu";
import { getAvatar, getUserById } from "@/actions/users";
import Breadcrumb from "@/components/blogsys/Breadcrumb";
import HamburgerMenu from "@/components/blogsys/HamburgerMenu";
import Toast from "@/components/blogsys/Toast";
import SettingsForm from "./SettingsForm";

export default async function Settings() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const userId = session?.user?.id ?? "";
  const userRes = await getUserById(userId);
  const user = userRes?.data;
  const avatarRes = await getAvatar(user?.avatarId ?? "");
  const messages = [...userRes.messages, ...avatarRes.messages];
  const success = userRes.success && avatarRes.success;

  return (
    <main className="flex w-full h-screen">
      <Toast success={success} messages={messages} />
      <DashboardMenu active="/settings" />

      <section className="flex-1 h-full flex flex-col">
        <div className="flex gap-2 justify-between items-center max-w-screen">
          <Breadcrumb items={[{ label: "Ustawienia", href: "/settings" }]} />
          <HamburgerMenu active="/settings" />
        </div>

        <SettingsForm user={user} avatar={avatarRes.data} />
      </section>
    </main>
  );
}
