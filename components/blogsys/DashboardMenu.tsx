import MenuItem from "./MenuItem";
import HomeIcon from "@/public/icons/home.svg";
import UsersIcon from "@/public/icons/users.svg";
import SettingsIcon from "@/public/icons/settings.svg";
import PostsIcon from "@/public/icons/post.svg";
import LogoutIcon from "@/public/icons/logout.svg";
import CredentialsIcon from "@/public/icons/credentials.svg";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import UserInfo from "@/components/blogsys/UserInfo";

type DashboardMenuProps = {
  active: string;
};

export default function DashboardMenu(props: DashboardMenuProps) {
  return (
    <aside className="w-72 hidden lg:flex flex-col gap-2 px-4 py-8 border-r border-gray-200">
      <div className="flex gap-1 items-center pb-8">
        <PostsIcon className="w-10 h-10 fill-primary-500" />
        <h1 className="text-2xl font-black">blogsys</h1>
      </div>

      <MenuItem
        href="/"
        label="Strona główna"
        icon={<HomeIcon className="w-6 h-6 fill-gray-400" />}
        active={props.active}
      />

      <MenuItem
        href="/accounts"
        label="Konta"
        icon={<CredentialsIcon className="w-6 h-6 fill-gray-400" />}
        active={props.active}
      />

      <MenuItem
        href="/posts"
        label="Wpisy"
        icon={<PostsIcon className="w-6 h-6 fill-gray-400" />}
        active={props.active}
      />

      <MenuItem
        href="/users"
        label="Użytkownicy"
        icon={<UsersIcon className="w-6 h-6 fill-gray-400" />}
        active={props.active}
      />

      <MenuItem
        href="/settings"
        label="Ustawienia"
        icon={<SettingsIcon className="w-6 h-6 fill-gray-400" />}
        active={props.active}
      />

      <div className="w-64 fixed bottom-8">
        <div className="w-full flex gap-2 items-center justify-between border-t border-t-gray-200 pt-6">
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
