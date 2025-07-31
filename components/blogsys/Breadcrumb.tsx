import HomeIcon from "@/public/icons/home.svg";
import ChevronRightIcon from "@/public/icons/chevron-right.svg";
import Link from "next/link";

type BreadcrumbProps = {
  items: { label: string; href: string }[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex gap-2 items-center px-4 py-8 font-semibold overflow-x-auto whitespace-nowrap">
      <Link href="/">
        <HomeIcon className="w-5 h-5 hover:fill-gray-700" />
      </Link>

      <ChevronRightIcon className="w-6 h-6 fill-gray-300" />

      {items.map((link, index) => (
        <div key={index} className="flex items-center">
          <Link href={link.href} className="hover:text-gray-700">
            <span className="text-sm">{link.label}</span>
          </Link>

          {index < items.length - 1 && <ChevronRightIcon className="w-6 h-6 fill-gray-300" />}
        </div>
      ))}
    </nav>
  );
}
