import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/common";

type UserState = {
  data?: Partial<User>;
};

const initialState: UserState = { data: undefined };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<User> | undefined>) => {
      state.data = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.data) {
        state.data = {
          ...state.data,
          ...action.payload,
        };
      }
    },
  },
});

export const { setUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
