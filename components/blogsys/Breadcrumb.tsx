import HomeIcon from "@/public/icons/blogsys/home.svg";
import ChevronIcon from "@/public/icons/blogsys/chevron-right.svg";
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

      <ChevronIcon className="w-6 h-6 fill-gray-300" />

      {items.map((link, index) => {
        if (index === items.length - 1) {
          return (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm">{link.label}</span>
            </div>
          );
        }

        return (
          <div key={index} className="flex items-center gap-2">
            <Link href={link.href} className="hover:text-gray-700">
              <span className="text-sm">{link.label}</span>
            </Link>

            {index < items.length - 1 && <ChevronIcon className="w-6 h-6 fill-gray-300" />}
          </div>
        );
      })}
    </nav>
  );
}
