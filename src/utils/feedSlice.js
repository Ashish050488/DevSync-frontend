import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeUserFromFeed: (state, action) => {
      return state.filter((user) => user._id !== action.payload);
    },
    clearFeed: (state, action) => {
      return null;
    },
  },
});

export const { addFeed, removeUserFromFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;