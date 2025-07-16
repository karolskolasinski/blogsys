"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import SpinnerIcon from "@/public/icons/spinner.svg";
import Link from "next/link";

type ButtonProps = {
  type: "button" | "link";
  icon: React.ReactNode;
  href: string;
  label: string;
};

export default function Button(props: ButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  switch (props.type) {
    case "button":
      return (
        <button
          onClick={() => startTransition(() => router.push(props.href))}
          disabled={isPending}
          className="button !rounded-full md:!rounded-md flex items-center gap-2"
        >
          {isPending ? <SpinnerIcon className="w-5 h-5 fill-white animate-spin" /> : props.icon}
          <span className="hidden md:inline">
            {props.label}
          </span>
        </button>
      );
    case "link":
      return (
        <Link
          href={props.href}
          className="button !rounded-full md:!rounded-md flex items-center gap-2"
        >
          {props.icon}
          <span className="hidden md:inline">
            {props.label}
          </span>
        </Link>
      );
    default:
      return null;
  }
}
