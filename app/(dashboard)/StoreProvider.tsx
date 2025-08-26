"use client";

import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "@/lib/redux/store";
import { setUser } from "@/lib/redux/userSlice";
import { setAvatar } from "@/lib/redux/avatarSlice";
import { User } from "@/types/common";

type ReduxProviderProps = {
  children: ReactNode;
  user?: Partial<User>;
  avatar?: string;
};

export default function ReduxProvider(props: ReduxProviderProps) {
  const { children, user, avatar } = props;
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();

    if (user) {
      storeRef.current.dispatch(setUser(user));
    }

    if (avatar) {
      storeRef.current.dispatch(setAvatar(avatar));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
