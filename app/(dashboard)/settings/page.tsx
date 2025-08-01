import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/blogsys/DashboardMenu";
import { getAvatar, getUserById, saveAvatar, saveUser } from "@/actions/users";
import Breadcrumb from "@/components/blogsys/Breadcrumb";
import SaveIcon from "@/public/icons/blogsys/save.svg";
import Button from "@/components/blogsys/Button";
import AvatarInput from "./AvatarInput";
import HamburgerMenu from "@/components/blogsys/HamburgerMenu";
import ResetPass from "@/app/(dashboard)/users/[id]/ResetPass";
import Toast from "@/components/blogsys/Toast";

export default async function Settings() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const userId = session?.user?.id ?? "";
  const resUser = await getUserById(userId);
  const user = resUser?.data;
  const resAvatar = await getAvatar(user?.avatarId ?? "");
  const messages = [...resUser.messages, ...resAvatar.messages];
  const success = resUser.success && resAvatar.success;

  return (
    <main className="flex w-full h-screen">
      <Toast success={success} messages={messages} />
      <DashboardMenu active="/settings" />

      <section className="flex-1 h-full flex flex-col">
        <div className="flex gap-2 justify-between items-center max-w-screen">
          <Breadcrumb items={[{ label: "Ustawienia", href: "/settings" }]} />
          <HamburgerMenu active="/settings" />
        </div>

        <div className="flex-1 bg-slate-50">
          <form
            action={async (formData) => {
              "use server";
              formData.append("settings", "true");
              await saveUser(formData);
            }}
            className="px-4 pt-8 flex flex-col gap-2 border-t border-gray-200"
          >
            <input type="hidden" name="id" defaultValue={user?.id} />

            <div className="flex justify-between items-center gap-4">
              <div className="text-3xl font-black">Ustawienia</div>

              <Button
                href=""
                appearance="button"
                label="Zapisz"
                icon={<SaveIcon className="w-5 h-5 fill-white" />}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-sm text-gray-700">
              <input name="createdAt" type="hidden" value={user?.createdAt?.toISOString()} />
              <div className="h-8 flex items-center">
                Data utworzenia konta: {user?.createdAt?.toLocaleString()}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-2 text-gray-700">
              <input
                name="name"
                className="flex-1 bg-white p-2 border border-gray-300 rounded-lg shadow"
                defaultValue={user?.name}
                placeholder="Wpisz nazwę"
                maxLength={100}
                required
              />

              <input
                name="email"
                type="email"
                defaultValue={user?.email}
                maxLength={50}
                className="flex-1 bg-white p-2 border border-gray-300 rounded-lg shadow"
                placeholder="Wpisz email"
                required
              />
            </div>

            <ResetPass />
          </form>

          <form
            action={async (formData) => {
              "use server";
              await saveAvatar(formData);
            }}
            className="px-4 pb-4 flex flex-col gap-2"
          >
            <input type="hidden" name="id" defaultValue={user?.id} />

            <AvatarInput data={resAvatar?.data ?? null} />
          </form>
        </div>
      </section>
    </main>
  );
}
