import MenuItem from "@/components/MenuItem";
import HomeIcon from "@/public/icons/home.svg";
import UsersIcon from "@/public/icons/users.svg";
import SettingsIcon from "@/public/icons/settings.svg";
import PostsIcon from "@/public/icons/post.svg";
import LogoutIcon from "@/public/icons/logout.svg";

type DashboardMenuProps = {
  active: string;
};

export default function DashboardMenu(props: DashboardMenuProps) {
  return (
    <aside className="w-72 flex flex-col gap-2 px-4 py-8 border-r border-gray-200">
      <div className="flex gap-1 items-center pb-8">
        <PostsIcon className="w-10 h-10 fill-primary-500" />
        <h1 className="text-2xl font-black">blogsys</h1>
      </div>

      <MenuItem href="/" label="Strona główna" Icon={HomeIcon} active={props.active} />
      <MenuItem href="/posts" label="Wpisy" Icon={PostsIcon} active={props.active} />
      <MenuItem
        href="/users"
        label="Użytkownicy"
        Icon={UsersIcon}
        active={props.active}
      />
      <MenuItem
        href="/settings"
        label="Ustawienia"
        Icon={SettingsIcon}
        active={props.active}
      />

      <div className="flex-1 flex items-end">
        <div className="w-full flex gap-2 items-center justify-between border-t border-t-gray-200 pt-6">
          <div className="flex gap-2 items-center">
            <img src="https://placehold.co/50x50" alt="avatar" className="w-12 h-12 rounded-full" />

            <div>
              <strong>Jan Kowalski</strong>
              <div className="text-gray-500">Administrator</div>
            </div>
          </div>

          <div className="hover:bg-gray-100 rounded-xl p-2" title="Wyloguj">
            <a href="/logout">
              <LogoutIcon className="w-6 h-6 fill-gray-700" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
