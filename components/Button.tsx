"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import SpinnerIcon from "@/public/icons/spinner.svg";
import { useFormStatus } from "react-dom";

type ButtonProps = {
  role?: "button" | "link";
  icon: React.ReactNode;
  href: string;
  label: string;
  colorClass?: string;
};

export default function Button(props: ButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { pending: formPending } = useFormStatus();

  const isLoading = isPending || formPending;

  const className = props.role === "button"
    ? "button !rounded-full md:!rounded-lg flex items-center gap-2"
    : `flex gap-1 items-center ${props.colorClass} cursor-pointer`;
  const sizeClass = props.role === "button" ? "w-5 h-5" : "w-4 h-4";

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (props.href === "delete") {
      if (!confirm("Czy na pewno chcesz usunąć?")) {
        e.preventDefault();
      }
      return;
    }

    if (props.href === "") {
      return;
    }

    startTransition(() => router.push(props.href));
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
    >
      {isLoading
        ? <SpinnerIcon className={`${sizeClass} fill-current animate-spin`} />
        : props.icon}
      <span className="hidden md:inline">
        {props.label}
      </span>
    </button>
  );
}
