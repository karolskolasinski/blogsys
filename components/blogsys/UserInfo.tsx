"use client";

import { useUser } from "@/context/UserContext";

export default function UserInfo() {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center">
      <strong>{user?.name}</strong>
      <div className="text-gray-500">{user?.role}</div>
    </div>
  );
}
