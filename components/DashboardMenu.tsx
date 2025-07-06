import MenuItem from "@/components/MenuItem";
import HomeIcon from "@/public/icons/home.svg";
import UsersIcon from "@/public/icons/users.svg";
import SettingsIcon from "@/public/icons/settings.svg";
import PostsIcon from "@/public/icons/article.svg";

type DashboardMenuProps = {
  active: string;
};

export default function DashboardMenu(props: DashboardMenuProps) {
  return (
    <aside className="bg-stone-900 text-gray-50 w-48 flex flex-col p-2">
      <MenuItem href="/" label="Strona główna" Icon={HomeIcon} active={props.active} />
      <MenuItem href="/posts" label="Posty" Icon={PostsIcon} active={props.active} />
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

      <button className="button text-black mt-8">
        Wyloguj
      </button>
    </aside>
  );
}
