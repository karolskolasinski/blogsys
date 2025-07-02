import MenuItem from "@/components/MenuItem";
import HomeIcon from "@/public/icons/home.svg";
import UsersIcon from "@/public/icons/users.svg";
import SettingsIcon from "@/public/icons/settings.svg";
import PostsIcon from "@/public/icons/article.svg";

export default function DashboardMenu() {
  return (
    <aside className="bg-stone-900 text-gray-50 w-48 flex flex-col p-2 text-sm">
      <MenuItem href="/dashboard" label="Strona główna" Icon={HomeIcon} />
      <MenuItem href="/users" label="Użytkownicy" Icon={UsersIcon} />
      <MenuItem href="/posts" label="Posty" Icon={PostsIcon} />
      <MenuItem href="/settings" label="Ustawienia" Icon={SettingsIcon} />

      <button className="button text-black mt-8">
        Wyloguj
      </button>
    </aside>
  );
}
