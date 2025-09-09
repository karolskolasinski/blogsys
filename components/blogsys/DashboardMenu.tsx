import MenuItem from "./MenuItem";
import HomeIcon from "@/public/icons/blogsys/home.svg";
import UsersIcon from "@/public/icons/blogsys/users.svg";
import SettingsIcon from "@/public/icons/blogsys/settings.svg";
import PostsIcon from "@/public/icons/blogsys/post.svg";
import LogoutIcon from "@/public/icons/blogsys/logout.svg";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import UserInfo from "@/components/blogsys/UserInfo";

type DashboardMenuProps = {
  active: string;
  mobile?: boolean;
};

export default async function DashboardMenu(props: DashboardMenuProps) {
  const session = await auth();
  const role = session?.user?.role;
  const asideClass = props.mobile
    ? "h-full flex flex-col py-2 text-lg"
    : "w-72 hidden lg:flex flex-col gap-2 px-4 py-8 border-r border-gray-200";
  const active = props.active;

  return (
    <aside className={asideClass}>
      <div className="flex gap-1 items-center pb-8">
        <PostsIcon className="w-10 h-10 fill-primary-500" />
        <h1 className="text-2xl font-black">blogsys</h1>
      </div>

      <MenuItem
        href="/"
        label="Strona główna"
        icon={<HomeIcon className="w-6 h-6 fill-gray-400" />}
        active={active}
      />

      <MenuItem
        href="/posts"
        label="Wpisy"
        icon={<PostsIcon className="w-6 h-6 fill-gray-400" />}
        active={active}
      />

      <MenuItem
        href="/users"
        label="Użytkownicy"
        icon={<UsersIcon className="w-6 h-6 fill-gray-400" />}
        active={active}
        role={role}
      />

      <MenuItem
        href="/settings"
        label="Ustawienia"
        icon={<SettingsIcon className="w-6 h-6 fill-gray-400" />}
        active={active}
      />

      <div className="flex-1 flex items-end">
        <div className="flex-1 flex gap-2 items-center justify-between border-t border-t-gray-200 pt-6 lg:sticky bottom-8">
          <UserInfo />

          <form
            action={async () => {
              "use server";
              await signOut({ redirect: false });
              redirect("/");
            }}
          >
            <button
              type="submit"
              className="hover:bg-gray-100 rounded-xl p-2 cursor-pointer"
              title="Wyloguj"
            >
              <LogoutIcon className="w-6 h-6 fill-gray-700" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
