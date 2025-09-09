"use client";

import { useTransition } from "react";
import SpinnerIcon from "@/public/icons/blogsys/spinner.svg";
import { useRouter } from "next/navigation";
import { Role } from "@/types/common";

type MenuItemProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: string;
  role?: Role;
};

export default function MenuItem(props: MenuItemProps) {
  const { href, label, icon, role, active } = props;
  const activeClass = active === href ? "bg-gray-100" : "";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  if (role !== "admin" && href === "/users") {
    return null;
  }

  return (
    <button
      onClick={() => startTransition(() => router.push(props.href))}
      disabled={isPending}
      className={`flex items-center gap-2 p-4 duration-100 ease-in-out font-bold hover:bg-gray-100 rounded-xl cursor-pointer ${activeClass}`}
    >
      {isPending ? <SpinnerIcon className="w-6 h-6 fill-gray-500 animate-spin" /> : icon}
      <span className="text-left whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
