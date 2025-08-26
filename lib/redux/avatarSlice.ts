import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AvatarState = {
  blob?: string;
};

const initialState: AvatarState = { blob: undefined };

const avatarSlice = createSlice({
  name: "avatar",
  initialState,
  reducers: {
    setAvatar: (state, action: PayloadAction<string | undefined>) => {
      state.blob = action.payload;
    },
  },
});

export const { setAvatar } = avatarSlice.actions;
export default avatarSlice.reducer;
