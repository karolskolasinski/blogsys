"use client";

import { useTransition } from "react";
import SpinnerIcon from "@/public/icons/spinner.svg";
import { useRouter } from "next/navigation";

type MenuItemProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: string;
};

export default function MenuItem(props: MenuItemProps) {
  const { href, label, icon, active } = props;
  const router = useRouter();
  const isActive = href === "/" ? active === href : active.startsWith(href);
  const activeClass = isActive ? "bg-gray-100" : "";
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => router.push(props.href))}
      disabled={isPending}
      className={`flex items-center gap-2 p-4 duration-100 ease-in-out font-bold hover:bg-gray-100 rounded-xl cursor-pointer ${activeClass}`}
    >
      {isPending ? <SpinnerIcon className="w-6 h-6 fill-gray-500 animate-spin" /> : icon}
      {label}
    </button>
  );
}
