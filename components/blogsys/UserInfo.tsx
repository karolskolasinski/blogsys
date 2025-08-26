"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import Avatar from "@/components/blogsys/Avatar";

export default function UserInfo() {
  const user = useSelector((state: RootState) => state.user.data);
  const avatar = useSelector((state: RootState) => state.avatar.blob);

  return (
    <div className="flex gap-4 items-center justify-center">
      <Avatar src={avatar} className="w-14 h-14" />

      <div>
        <strong>{user?.name}</strong>
        <div className="text-gray-500">
          {user?.role === "admin" ? "Administrator" : "Użytkownik"}
        </div>
      </div>
    </div>
  );
}
