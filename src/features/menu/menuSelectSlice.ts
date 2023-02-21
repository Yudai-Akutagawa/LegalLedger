import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import dataJson from "./menuSelect.json";

type menuStateType = { data: typeof dataJson };

const initialState: menuStateType = {
  data: { menuSelect: "list" },
};

export const menuSlice = createSlice({
  name: "menu",
  initialState: initialState,
  reducers: {
    selectList: (state) => {
      state.data.menuSelect = "list";
    },
    selectCategory: (state) => {
      state.data.menuSelect = "crud-category";
    },
    selectDetail: (state) => {
      state.data.menuSelect = "crud-detail";
    },
  },
});

export const { selectList, selectCategory, selectDetail } = menuSlice.actions;

export const menuSelect = (state: RootState) => state.menu.data.menuSelect;

export default menuSlice.reducer;
