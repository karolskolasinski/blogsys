"use client";

import { useUser } from "@/context/UserContext";
import Avatar from "@/components/blogsys/Avatar";

export default function UserInfo() {
  const { user, avatar } = useUser();

  return (
    <div className="flex gap-4 items-center justify-center">
      <Avatar src={avatar} className="w-14 h-14" />

      <div>
        <strong>{user?.name}</strong>
        <div className="text-gray-500">{user?.role}</div>
      </div>
    </div>
  );
}
