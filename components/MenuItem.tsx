import Link from "next/link";

type MenuItemProps = {
  href: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  active: string;
};

export default function MenuItem(props: MenuItemProps) {
  const { href, label, Icon, active } = props;
  const isActive = href === "/" ? active === href : active.startsWith(href);
  const activeClass = isActive ? "bg-gray-100" : "";

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 p-4 duration-100 ease-in-out font-bold hover:bg-gray-100 rounded-xl ${activeClass}`}
    >
      <Icon className={`w-6 h-6 fill-gray-400`} />
      {label}
    </Link>
  );
}
