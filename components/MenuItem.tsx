import Link from "next/link";
import { headers } from "next/headers";

type MenuItemProps = {
  href: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

export default async function MenuItem({ href, label, Icon }: MenuItemProps) {
  const headersList = await headers();
  const currentPath = headersList.get("x-path") ?? "";
  const isActive = href === "/" ? currentPath === href : currentPath.startsWith(href);
  const activeClass = isActive
    ? "!border-l-primary-500 text-primary-500 fill-primary-500 hover:!border-l-primary-300 hover:text-primary-300 group-hover:!fill-primary-300"
    : "hover:border-l-primary-500 hover:text-primary-500 group-hover:fill-primary-500";

  return (
    <Link
      href={href}
      className={`group flex items-center gap-2 border-l-4 border-l-transparent p-2 duration-100 ease-in-out mb-4 ${activeClass}`}
    >
      <Icon
        className={`w-5 h-5 fill-gray-50 transition-colors duration-100 ease-in-out ${activeClass}`}
      />
      {label}
    </Link>
  );
}
