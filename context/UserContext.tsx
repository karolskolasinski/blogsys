"use client";

import React, { createContext, useContext } from "react";
import { User } from "@/types/common";

type UserContextType = {
  user: User;
  avatar: string;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider(props: { children: React.ReactNode; user: User; avatar: string }) {
  const { children, user, avatar } = props;
  return (
    <UserContext.Provider value={{ user, avatar }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
