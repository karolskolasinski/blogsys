import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import avatarReducer from "./avatarSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      avatar: avatarReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
